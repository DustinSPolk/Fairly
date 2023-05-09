import { React } from "react";
import { Line } from "react-chartjs-2";
import PropTypes from "prop-types";
import usePalette from "../../hooks/usePalette";

function LineChart(props) {
  const palette = usePalette();

  const options = {
    elements: {
      line: {
        point: {
          backgroundColor: palette.primary,
        },
        tension: 0.3,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    grid: {},
    legend: {
      display: false,
    },
    tooltips: {
      intersect: false,
      trigger: "axis",
    },
    hover: {
      intersect: true,
    },
    scales: {
      xAxis: {
        type: "category",
        data: props.lineData.labels,
      },
      yAxis: [
        {
          ticks: {
            stepSize: 500,
          },
          display: true,
          borderDash: [5, 5],
          gridLines: {
            color: "rgba(0,0,0,0)",
            fontColor: "#fff",
          },
        },
      ],
    },
  };

  return <Line options={options} data={props.lineData} />;
}

LineChart.propTypes = {
  lineData: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        fill: PropTypes.bool.isRequired,
        backgroundColor: PropTypes.string.isRequired,
        borderColor: PropTypes.string.isRequired,
        data: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
    ),
  }).isRequired,
};

export default LineChart;
