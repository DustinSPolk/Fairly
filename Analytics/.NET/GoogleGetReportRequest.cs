using Google.Apis.AnalyticsReporting.v4.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.GoogleReportRequest
{
    public class GoogleGetReportRequest
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public List<Metric> Metrics { get; set; }
        public List<Dimension> Dimensions { get; set; }
        public List<OrderBy> OrderBy { get; set; }
    }
}
