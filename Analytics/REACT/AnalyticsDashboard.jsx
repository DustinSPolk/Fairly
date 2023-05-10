import { React, useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { RefreshCw } from "react-feather";
import LineChart from "./LineChart";
import WorldMap from "./WorldMap";
import ViewsByDevice from "./ViewsByDevice";
import ViewsByBrowser from "./ViewsByBrowser";
import ViewsByPage from "./ViewsByPage";
import UserType from "./UserType";
import googleAnalyticsService from "../../services/googleAnalyticsService";
import { Notyf } from "notyf";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import "./analytics.css";
import usePalette from "../../hooks/usePalette";
import analyticsDatePickSchema from "../../schemas/analyticsDatePickSchema";

const _logger = debug.extend("Analytics");
const notyf = new Notyf({ position: { y: "top" } });

function AnalyticsDashboard() {
  const palette = usePalette();

  const onDatePick = (values) => {
    setHasDataMapped({
      line: false,
      location: false,
      device: false,
      browser: false,
      userType: false,
      page: false,
    });

    setDates((prevState) => {
      const newDates = { ...prevState };
      newDates.startDate = values.startDate;
      newDates.endDate = values.endDate;
      setHasDateChanged(true);
      return newDates;
    });
  };

  const [hasDataMapped, setHasDataMapped] = useState({
    line: false,
    location: false,
    device: false,
    browser: false,
    userType: false,
    page: false,
  });

  const [hasDateChanged, setHasDateChanged] = useState(false);

  const today = new Date(Date.now());
  const oneWeekAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);

  const [dates, setDates] = useState({
    startDate: oneWeekAgo.toISOString().substring(0, 10),
    endDate: today.toISOString().substring(0, 10),
  });

  const formDates = {
    startDate: dates.startDate,
    endDate: dates.endDate,
  };

  const runServices = () => {
    setHasDataMapped({
      line: false,
      location: false,
      device: false,
      browser: false,
      userType: false,
      page: false,
    });

    const viewsPayload = {
      startDate: dates.startDate,
      endDate: dates.endDate,
      metrics: [{ expression: "ga:pageviews" }],
      dimensions: [{ name: "ga:date" }],
    };

    const locationsPayload = {
      startDate: dates.startDate,
      endDate: dates.endDate,
      metrics: null,
      dimensions: [
        { name: "ga:latitude" },
        { name: "ga:longitude" },
        { name: "ga:city" },
      ],
    };

    const devicePayload = {
      startDate: dates.startDate,
      endDate: dates.endDate,
      metrics: null,
      dimensions: [{ name: "ga:deviceCategory" }],
    };

    const browserPayload = {
      startDate: dates.startDate,
      endDate: dates.endDate,
      metrics: null,
      dimensions: [{ name: "ga:browser" }],
    };

    const userTypePayload = {
      startDate: dates.startDate,
      endDate: dates.endDate,
      metrics: null,
      dimensions: [{ name: "ga:userType" }],
    };

    const pagesPayload = {
      startDate: dates.startDate,
      endDate: dates.endDate,
      metrics: [{ expression: "ga:uniquePageviews" }],
      dimensions: [{ name: "ga:pagePath" }],
      orderBy: [
        {
          fieldName: "ga:uniquePageviews",
          sortOrder: "descending",
        },
      ],
    };

    googleAnalyticsService
      .getAnalytics(viewsPayload)
      .then(onGetViewsSuccess)
      .catch(onGetViewsError);

    googleAnalyticsService
      .getAnalytics(locationsPayload)
      .then(onGetLocationsSuccess)
      .catch(onGetLocationsError);

    googleAnalyticsService
      .getAnalytics(devicePayload)
      .then(onGetDevicesSuccess)
      .catch(onGetDevicesError);

    googleAnalyticsService
      .getAnalytics(browserPayload)
      .then(onGetBrowserSuccess)
      .catch(onGetBrowserError);

    googleAnalyticsService
      .getAnalytics(userTypePayload)
      .then(onGetUserTypeSuccess)
      .catch(onGetUserTypeError);

    googleAnalyticsService
      .getAnalytics(pagesPayload)
      .then(onGetPagesSuccess)
      .catch(onGetPagesError);
  };

  useEffect(() => {
    runServices();
  }, []);

  useEffect(() => {
    if (hasDateChanged) {
      setLineData({
        labels: [],
        datasets: [
          {
            label: "",
            fill: true,
            backgroundColor: "#0068ff35",
            borderColor: palette.primary,
            data: [],
          },
        ],
      });

      setLocationMarkers([]);

      setDeviceData({
        labels: [],
        data: [],
      });

      setBrowserData({
        labels: [],
        data: [],
      });

      setUserTypeData({
        labels: [],
        data: [],
      });

      setPageData({
        labels: [],
        data: [],
      });

      runServices();
    }
  }, [hasDateChanged]);

  const onGetViewsSuccess = (response) => {
    const data = response.item.reports[0].data.rows;
    setHasDateChanged(false);

    setLineData({
      labels: [],
      datasets: [
        {
          label: "",
          fill: true,
          backgroundColor: "#0068ff35",
          borderColor: palette.primary,
          data: [],
        },
      ],
    });

    data.map(mapLineData);

    setHasDataMapped((prevState) => {
      const mappedData = { ...prevState };
      mappedData.line = true;
      return mappedData;
    });
  };

  const onGetViewsError = (error) => {
    _logger(error);
    notyf.error("Failed to retrieve analytics data");
  };

  const mapLineData = (data) => {
    const date = data.dimensions[0];
    const values = data.metrics[0].values[0];
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    const dateLabel = `${year}-${month}-${day}`;

    setLineData((prevState) => {
      const newData = { ...prevState };
      newData.labels.push(dateLabel);
      newData.datasets[0].data.push(values);
      return newData;
    });
  };

  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        fill: true,
        backgroundColor: "#0068ff35",
        borderColor: palette.primary,
        data: [],
      },
    ],
  });

  const onGetLocationsSuccess = (response) => {
    const data = response.item.reports[0].data.rows;
    data.map(mapLocationData);
    setHasDataMapped((prevState) => {
      const mappedData = { ...prevState };
      mappedData.location = true;
      return mappedData;
    });
  };

  const onGetLocationsError = (error) => {
    _logger(error);
    notyf.error("Failed to retrieve analytics data");
  };

  const [locationMarkers, setLocationMarkers] = useState([]);

  const mapLocationData = (location) => {
    const lat = location.dimensions[0];
    const lng = location.dimensions[1];
    const city = location.dimensions[2];
    const latLng = [lat, lng];
    const marker = {
      latLng: latLng,
      name: city,
    };

    if (city !== "(not set)") {
      setLocationMarkers((prevState) => {
        const newMarks = [...prevState];
        newMarks.push(marker);
        return newMarks;
      });
    }
  };

  const onGetDevicesSuccess = (response) => {
    const data = response.item.reports[0].data.rows;
    data.map(mapDeviceData);
    setHasDataMapped((prevState) => {
      const mappedData = { ...prevState };
      mappedData.device = true;
      return mappedData;
    });
  };

  const onGetDevicesError = (error) => {
    _logger(error);
    notyf.error("Failed to retrieve analytics data");
  };

  const [deviceData, setDeviceData] = useState({
    labels: [],
    data: [],
  });

  const mapDeviceData = (data) => {
    const label = data.dimensions[0];
    const device = data.metrics[0].values[0];

    setDeviceData((prevState) => {
      const newDevices = { ...prevState };
      newDevices.labels.push(label);
      newDevices.data.push(device);
      return newDevices;
    });
  };

  const [browserData, setBrowserData] = useState({
    labels: [],
    data: [],
  });

  const onGetBrowserSuccess = (response) => {
    const data = response.item.reports[0].data.rows;
    data.map(mapBrowserData);
    setHasDataMapped((prevState) => {
      const mappedData = { ...prevState };
      mappedData.browser = true;
      return mappedData;
    });
  };

  const onGetBrowserError = (error) => {
    _logger(error);
    notyf.error("Failed to retrieve analytics data");
  };

  const mapBrowserData = (data) => {
    const label = data.dimensions[0];
    const browser = data.metrics[0].values[0];

    setBrowserData((prevState) => {
      const newDevices = { ...prevState };
      newDevices.labels.push(label);
      newDevices.data.push(browser);
      return newDevices;
    });
  };

  const [userTypeData, setUserTypeData] = useState({
    labels: [],
    data: [],
  });

  const onGetUserTypeSuccess = (response) => {
    const data = response.item.reports[0].data.rows;
    data.map(mapUserTypeData);
    setHasDataMapped((prevState) => {
      const mappedData = { ...prevState };
      mappedData.userType = true;
      return mappedData;
    });
  };

  const onGetUserTypeError = (error) => {
    _logger(error);
    notyf.error("Failed to retrieve analytics data");
  };

  const mapUserTypeData = (data) => {
    const label = data.dimensions[0];
    const type = data.metrics[0].values[0];

    setUserTypeData((prevState) => {
      const newDevices = { ...prevState };
      newDevices.labels.push(label);
      newDevices.data.push(type);
      return newDevices;
    });
  };

  const [pageData, setPageData] = useState({
    labels: [],
    data: [],
  });

  const onGetPagesSuccess = (response) => {
    const data = response.item.reports[0].data.rows;
    data.map(mapPageData);
    setHasDataMapped((prevState) => {
      const mappedData = { ...prevState };
      mappedData.page = true;
      return mappedData;
    });
  };

  const onGetPagesError = (error) => {
    _logger(error);
    notyf.error("Failed to retrieve analytics data");
  };

  const mapPageData = (data) => {
    const label = data.dimensions[0];
    const type = data.metrics[0].values[0];

    setPageData((prevState) => {
      const newPages = { ...prevState };
      newPages.labels.push(label);
      newPages.data.push(type);
      return newPages;
    });
  };

  return (
    <Container fluid>
      <Row className="mb-2 mb-xl-3">
        <Col>
          <h3>Google Analytics Dashboard</h3>
        </Col>
        <Col xs="auto" className="ms-auto text-end mt-n1">
          <Formik
            enableReinitialize={true}
            initialValues={formDates}
            onSubmit={onDatePick}
            validationSchema={analyticsDatePickSchema}
          >
            <FormikForm>
              <Container>
                <Row>
                  <Col className="px-1">
                    <Field
                      name="startDate"
                      className="form-control"
                      type="date"
                    ></Field>
                    <ErrorMessage
                      className="analytics-date-error"
                      name="startDate"
                      component="div"
                    />
                  </Col>
                  <Col className="px-1">
                    <Field
                      name="endDate"
                      className="form-control"
                      type="date"
                    ></Field>
                    <ErrorMessage
                      className="analytics-date-error"
                      name="endDate"
                      component="div"
                    />
                  </Col>
                  <Col className="px-1">
                    <Button
                      type="submit"
                      variant="primary"
                      className="shadow-sm"
                    >
                      <RefreshCw className="feather" />
                    </Button>
                  </Col>
                </Row>
              </Container>
            </FormikForm>
          </Formik>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="analytics-line-card">
            <Card.Header className="pb-1">
              <h4>Total Views</h4>
            </Card.Header>
            <Card.Body className="pt-2">
              {hasDataMapped.line && <LineChart lineData={lineData} />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg="7" xl="8">
          <Card className="analytics-bottom-card">
            <Card.Header className="pb-1">
              <h4>Views By City</h4>
            </Card.Header>
            <Card.Body className="pt-2">
              {hasDataMapped.location && (
                <WorldMap locationMarkers={locationMarkers} />
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="analytics-bottom-card">
            <Card.Header className="pb-1">
              <h4>Views By Device</h4>
            </Card.Header>
            <Card.Body className="pt-2">
              {hasDataMapped.device && (
                <ViewsByDevice deviceData={deviceData} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="analytics-bottom-card">
            <Card.Header className="pb-1">
              <h4>Views By Page</h4>
            </Card.Header>
            <Card.Body className="pt-2">
              {hasDataMapped.page && <ViewsByPage pageData={pageData} />}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="analytics-bottom-card">
            <Card.Header className="pb-1">
              <h4>New/Returning Visitors</h4>
            </Card.Header>
            <Card.Body className="pt-2">
              {hasDataMapped.userType && (
                <UserType userTypeData={userTypeData} />
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="analytics-bottom-card">
            <Card.Header className="pb-1">
              <h4>Views By Browser</h4>
            </Card.Header>
            <Card.Body className="pt-2">
              {hasDataMapped.browser && (
                <ViewsByBrowser browserData={browserData} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AnalyticsDashboard;
