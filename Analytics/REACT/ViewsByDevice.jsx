import React from "react";
import PropTypes from "prop-types";
import { Doughnut } from "react-chartjs-2";
import usePalette from "../../hooks/usePalette";

function ViewsByDevice(props) {
  const palette = usePalette();

  const data = {
    labels: props.deviceData.labels,
    datasets: [
      {
        data: props.deviceData.data,
        backgroundColor: [palette.primary, palette.success, palette.danger],
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

ViewsByDevice.propTypes = {
  deviceData: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    data: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }).isRequired,
};

export default ViewsByDevice;
