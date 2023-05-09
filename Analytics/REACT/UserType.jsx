import React from "react";
import PropTypes from "prop-types";
import { Pie } from "react-chartjs-2";
import usePalette from "../../hooks/usePalette";

function UserType(props) {
  const palette = usePalette();

  const data = {
    labels: props.userTypeData.labels,
    datasets: [
      {
        data: props.userTypeData.data,
        backgroundColor: [palette.primary, palette.success],
        borderWidth: 3,
        borderColor: palette.white,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  return <Pie data={data} options={options} />;
}

UserType.propTypes = {
  userTypeData: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default UserType;
