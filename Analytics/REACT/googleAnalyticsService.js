import axios from "axios";
import * as helper from "../services/serviceHelpers";

const endpoint = `${helper.API_HOST_PREFIX}/api/googleanalytics/`;

const getAnalytics = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint}data`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const googleAnalyticsService = { getAnalytics };
export default googleAnalyticsService;
