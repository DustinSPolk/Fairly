using Google.Apis.AnalyticsReporting.v4.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Requests.GoogleReportRequest;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/googleanalytics")]
    [ApiController]
    public class GoogleReportApiController : BaseApiController
    {
        private IGoogleAnalyticsReportService _service = null;
        private IAuthenticationService<int> _authservice = null;
        public GoogleReportApiController(IGoogleAnalyticsReportService service,
            ILogger<GoogleReportApiController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authservice = authService;
        }

        [HttpPost("data")]
        public ActionResult<ItemResponse<GetReportsResponse>> GetReport(GoogleGetReportRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                GetReportsResponse report = _service.GetAnalyticsReport(model);

                if (report == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Analytics data not found.");
                }
                else
                {
                    response = new ItemResponse<GetReportsResponse>() { Item = report };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }
    }
}
