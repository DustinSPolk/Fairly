import ReactGA from "react-ga";

const googleAnalytics = () => {
  const GA_ID = process.env.REACT_APP_ANALYTICS_ID;

  ReactGA.initialize(GA_ID);
  ReactGA.pageview(window.location.pathname + window.location.search);
};

export default googleAnalytics;
