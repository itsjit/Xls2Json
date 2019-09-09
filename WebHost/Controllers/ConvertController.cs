using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xls2Json.Exceptions;

namespace Xls2Json.WebHost.Controllers
{
    /// <summary>
    /// Conversions.
    /// </summary>
    [Route("api/convert")]
    [ApiController]
    public class ConvertController : ControllerBase
    {
        /// <summary>
        /// Converts input XLS file into JSON.
        /// </summary>
        /// <param name="file">The XLS file.</param>
        /// <param name="includeNulls">Whether to include null properties in result.</param>
        /// <returns>JSON</returns>
        /// <response code="200">If the conversion is successful</response>
        /// <response code="400">If there is an error during conversion or file structure is not correct</response>  
        [HttpPost("toJson")]
        [DisableRequestSizeLimit]
        [Produces("application/json")]
        [ProducesResponseType(statusCode: 400, type: typeof(string))]
        [ProducesResponseType(statusCode: 200, type: typeof(object))]
        public ActionResult<object> ToJson(IFormFile file, [FromQuery] bool includeNulls = true)
        {
            try
            {
                if (file.Length > 0)
                {
                    ConversionOptions options = ConversionOptions.Default;
                    options.IncludeNulls = includeNulls;
                    using (var convertor = new Convertor(file.OpenReadStream(), options))
                    {
                        return convertor.ConvertToObject();
                    }
                }
                else
                {
                    return this.BadRequest("Zero file length.");
                }
            }
            catch (ConversionException e)
            {
                return this.BadRequest(e.Message);
            }
        }
    }
}