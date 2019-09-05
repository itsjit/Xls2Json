namespace Xls2Json
{
    public class ConversionOptions
    {
        private static ConversionOptions defaultOptions;

        public static ConversionOptions Default
            => defaultOptions
                ?? (defaultOptions =
                    new ConversionOptions()
                    {
                        IncludeNulls = true
                    }
                );

        public bool IncludeNulls { get; set; }
    }
}