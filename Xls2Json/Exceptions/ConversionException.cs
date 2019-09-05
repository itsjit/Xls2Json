using System;
using System.Runtime.Serialization;

namespace Xls2Json.Exceptions
{
    [Serializable]
    public class ConversionException : Exception
    {
        //
        // For guidelines regarding the creation of new exception types, see
        //    http://msdn.microsoft.com/library/default.asp?url=/library/en-us/cpgenref/html/cpconerrorraisinghandlingguidelines.asp
        // and
        //    http://msdn.microsoft.com/library/default.asp?url=/library/en-us/dncscol/html/csharp07192001.asp
        //

        public ConversionException()
        {
        }

        public ConversionException(string message) : base(message)
        {
        }

        public ConversionException(string message, Exception inner) : base(message, inner)
        {
        }

        protected ConversionException(
                SerializationInfo info,
                StreamingContext context
            ) : base(info, context)
        {
        }
    }
}