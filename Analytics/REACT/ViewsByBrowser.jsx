import React from "react";
import PropTypes from "prop-types";
import { Doughnut } from "react-chartjs-2";
import usePalette from "../../hooks/usePalette";

function ViewsByBrowser(props) {
  const palette = usePalette();

  const data = {
    labels: props.browserData.labels,
    datasets: [
      {
        data: props.browserData.data,
        backgroundColor: [
          palette.primary,
          palette.success,
          palette.danger,
          palette.warning,
          palette["purple"],
        ],
        borderWidth: 3,
        borderColor: palette.white,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    cutoutPercentage: 75,
    responsive: true,
  };

  return <Doughnut data={data} options={options} />;
}

ViewsByBrowser.propTypes = {
  browserData: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default ViewsByBrowser;
