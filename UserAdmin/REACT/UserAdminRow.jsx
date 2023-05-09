import React from "react";
import { Badge } from "react-bootstrap";
import blankAvatar from "../../assets/img/avatars/blank-avatar.jpg";
import PropTypes from "prop-types";

function UserAdminRow(props) {
  const checkStatus = (userStatus) => {
    switch (userStatus) {
      case 1:
        return "Active";
        break;
      case 2:
        return "Inactive";
        break;
      case 3:
        return "Pending";
        break;
      case 4:
        return "Flagged";
        break;
      case 5:
        return "Removed";
        break;
    }
  };

  const badgeColor = (userStatus) => {
    switch (userStatus) {
      case 1:
        return "success";
        break;
      case 2:
        return "danger";
        break;
      case 3:
        return "info";
        break;
      case 4:
        return "warning";
        break;
      case 5:
        return "dark";
        break;
    }
  };

  const handleClick = () => {
    props.setSingleUser(props.userData);
  };

  const onError = (e) => {
    e.currentTarget.onerror = null; // prevents looping
    e.currentTarget.src = blankAvatar;
  };

  return (
    <tr onClick={handleClick}>
      <td>
        <img
          src={props.userData.avatarUrl || blankAvatar}
          width="32"
          height="32"
          className="rounded-circle my-n1"
          alt="avatar"
          onError={onError}
        />
      </td>
      <td>{`${props.userData.firstName} ${props.userData.lastName}`}</td>
      <td>{props.userData.email}</td>
      <td className="text-end">
        <Badge bg={badgeColor(props.userData.status.id)}>
          {checkStatus(props.userData.status.id)}
        </Badge>
      </td>
    </tr>
  );
}

UserAdminRow.propTypes = {
  userData: PropTypes.shape({
    avatarUrl: PropTypes.string,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    status: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  setSingleUser: PropTypes.func.isRequired,
};

export default UserAdminRow;
