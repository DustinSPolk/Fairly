    public class GoogleGetReportRequest
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public List<Metric> Metrics { get; set; }
        public List<Dimension> Dimensions { get; set; }
        public List<OrderBy> OrderBy { get; set; }
    }
