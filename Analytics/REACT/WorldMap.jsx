import React from "react";
import { VectorMap } from "react-jvectormap";
import PropTypes from "prop-types";
import usePalette from "../../hooks/usePalette";

function WorldMap(props) {
  const palette = usePalette();

  const options = {
    map: "world_mill",
    normalizeFunction: "polynomial",
    hoverOpacity: 0.7,
    hoverColor: false,
    zoomOnScroll: false,
    regionStyle: {
      initial: {
        fill: palette["gray-200"],
      },
    },
    containerStyle: {
      width: "100%",
      height: "100%",
    },
    markerStyle: {
      initial: {
        r: 9,
        fill: palette.primary,
        "fill-opacity": 0.9,
        stroke: palette.white,
        "stroke-width": 7,
        "stroke-opacity": 0.4,
      },
      hover: {
        fill: palette.primary,
        "fill-opacity": 0.9,
        stroke: palette.primary,
        "stroke-width": 7,
        "stroke-opacity": 0.4,
      },
    },
    backgroundColor: "transparent",
    markers: props.locationMarkers,
  };

  return <VectorMap {...options} />;
}

WorldMap.propTypes = {
  locationMarkers: PropTypes.arrayOf(
    PropTypes.shape({
      latLng: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};

export default WorldMap;
