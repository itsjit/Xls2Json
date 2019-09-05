using System;
using System.IO;
using System.Linq;
using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Syncfusion.XlsIO;
using Xls2Json.Exceptions;

namespace Xls2Json
{
    public class Convertor : IDisposable
    {
        private readonly Stream input;
        private readonly ConversionOptions options;

        public Convertor(Stream input, ConversionOptions options)
        {
            this.input = input ?? throw new ArgumentNullException(nameof(input));
            this.options = options ?? throw new ArgumentNullException(nameof(options));
        }

        public object ConvertToObject()
        {
            using (var excelEngine = new ExcelEngine())
            {
                IApplication application = excelEngine.Excel;
                IWorkbook workbook = application.Workbooks.Open(this.input);
                if (workbook.Worksheets.Count == 0)
                {
                    throw new ConversionException($"The workbook doesn't contain any sheets.");
                }

                return workbook.Worksheets.Count == 1
                    ? GetObjectFromSheet(workbook.Worksheets.First(), this.options)
                    : workbook.Worksheets.ToDictionary(sheet => sheet.Name,
                        sheet => GetObjectFromSheet(sheet, this.options));
            }
        }

        public string ConvertToJson()
            => SerializeObject(this.ConvertToObject());

        internal static ExcelFormatType GetColumnFormat(IRange column)
        {
            if (column is null)
            {
                throw new ArgumentNullException(nameof(column));
            }

            PropertyInfo property = column
                .GetType()
                .GetProperty("FormatType", BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);

            if (property == null)
            {
                throw new NullReferenceException($"Property 'FormatType' has not bee found.");
            }

            return (ExcelFormatType)(property.GetValue(column) ?? ExcelFormatType.Unknown);
        }

        internal static object GetObjectFromSheet(IWorksheet sheet, ConversionOptions options)
        {
            if (sheet is null)
            {
                throw new ArgumentNullException(nameof(sheet));
            }
            if (sheet.Rows.Length == 0)
            {
                throw new ConversionException($"The sheet '{sheet.Name}' doesn't contain any rows.");
            }

            IRange firstRow = sheet.Rows.First();
            return sheet.Rows
                .Skip(1)
                .Select(row => firstRow.Columns
                        .ToDictionary(
                                column => column.Value,
                                column => GetPropertyFromCellValue(
                                        sheet[row.Row, column.Column].Value,
                                        GetColumnFormat(sheet[row.Row, column.Column])
                                    )
                            )
                        .Where(a => FilterProperty(a.Value, options))
                        .ToDictionary(a => a.Key, a => a.Value)
                    )
                .ToArray();
        }

        private static bool FilterProperty(object value, ConversionOptions options)
            => options.IncludeNulls
                || (value != null && (value as JToken)?.Type != JTokenType.Null);

        internal static object GetPropertyFromCellValue(string stringValue, ExcelFormatType format = ExcelFormatType.Unknown)
        {
            if (format == ExcelFormatType.Text)
            {
                return stringValue;
            }

            try
            {
                return JToken.Parse(stringValue);
            }
            catch (JsonReaderException)
            {
                return stringValue;
            }
        }

        internal static string SerializeObject(object result)
            => JsonConvert.SerializeObject(result, Formatting.Indented);

        public void Dispose()
        {
            this.input.Dispose();
        }
    }
}