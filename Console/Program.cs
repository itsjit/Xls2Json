using System;
using System.IO;
using System.Linq;
using Xls2Json.Exceptions;

namespace Xls2Json.Console
{
    public static class Program
    {
        public const string ErrorFormat = "*** Error: {0}";

        public static int Success => 0;

        public static int Error => -1;

        private static int Main(string[] args)
        {
            try
            {
                ConversionOptions options = ConversionOptions.Default;

                if (System.Console.IsInputRedirected)
                {
                    using (var convertor = new Convertor(System.Console.OpenStandardInput(255), options))
                    {
                        WriteToStdOutput(convertor.ConvertToJson());
                    }
                }
                else
                {
                    string fileName = GetInputFileName(args);
                    using (var convertor = new Convertor(new FileStream(fileName, FileMode.Open), options))
                    {
                        WriteToFile(GenerateOuputFileName(fileName), convertor.ConvertToJson());
                    }
                }
                return Success;
            }
            catch (ConversionException e)
            {
                System.Console.Error.WriteLine(ErrorFormat, e.Message);
#if DEBUG
                System.Console.WriteLine();
                System.Console.WriteLine("Press <ENTER> for exit.");
                System.Console.ReadLine();
#endif
                return Error;
            }
            catch (FileNotFoundException e)
            {
                System.Console.Error.WriteLine(ErrorFormat, e.Message);
#if DEBUG
                System.Console.WriteLine();
                System.Console.WriteLine("Press <ENTER> for exit.");
                System.Console.ReadLine();
#endif
                return Error;
            }
            catch (Exception e)
            {
                System.Console.Error.WriteLine(ErrorFormat, e.Message);
                System.Console.Error.WriteLine($"***\t{e}");
#if DEBUG
                System.Console.WriteLine();
                System.Console.WriteLine("Press <ENTER> for exit.");
                System.Console.ReadLine();
#endif
                return Error;
            }
        }

        private static string GetInputFileName(string[] args)
        {
            string fileName = args?.FirstOrDefault();
            if (string.IsNullOrEmpty(fileName) || !File.Exists(fileName))
            {
                throw new FileNotFoundException($"File '{fileName}' has not been found.");
            }

            return fileName;
        }

        private static void WriteToFile(string fileName, string result)
        {
            using (var sw = new StreamWriter(fileName, false))
            {
                sw.Write(result);
                sw.Flush();
            }
        }

        private static void WriteToStdOutput(string result)
            => System.Console.Out.Write(result);

        private static string GenerateOuputFileName(string fileName, int? index = null)
        {
            string suffix = index.HasValue ? $"({index.Value})" : string.Empty;
            string newFileName = $"{fileName}{suffix}.json";
            if (File.Exists(newFileName))
            {
                return GenerateOuputFileName(fileName, (index ?? 0) + 1);
            }
            return newFileName;
        }
    }
}