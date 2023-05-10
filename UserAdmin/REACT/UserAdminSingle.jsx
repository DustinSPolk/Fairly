import { React } from "react";
import { Badge, Card, Row, Col, Table, Button } from "react-bootstrap";
import blankAvatar from "../../assets/img/avatars/blank-avatar.jpg";
import PropTypes from "prop-types";
import userService from "../../services/userService";
import { Notyf } from "notyf";

const _logger = debug.extend("UserAdminSingle");

function UserAdminSingle(props) {
  const user = props.userData;
  const userName = `${user.firstName} ${user.lastName}`;

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

  const signupDate = user.dateCreated.substring(0, 10);

  const statusTypes = {
    active: 1,
    inactive: 2,
    pending: 3,
    flagged: 4,
    removed: 5,
  };

  const handleClick = (e) => {
    e.preventDefault();
    const btnId = e.target.id;
    const userId = user.id;
    switch (btnId) {
      case "active-btn":
        userService
          .updateStatus(userId, statusTypes.active)
          .then(onUpdateStatusActive)
          .catch(onUpdateStatusError);
        break;
      case "inactive-btn":
        userService
          .updateStatus(userId, statusTypes.inactive)
          .then(onUpdateStatusInactive)
          .catch(onUpdateStatusError);
        break;
      case "flagged-btn":
        userService
          .updateStatus(userId, statusTypes.flagged)
          .then(onUpdateStatusFlagged)
          .catch(onUpdateStatusError);
        break;
    }
  };

  const onUpdateStatusActive = (response) => {
    _logger(response);
    props.updateSingleUser(1);
  };
  const onUpdateStatusInactive = (response) => {
    _logger(response);
    props.updateSingleUser(2);
  };
  const onUpdateStatusFlagged = (response) => {
    _logger(response);
    props.updateSingleUser(4);
  };
  const onUpdateStatusError = (error) => {
    _logger(error);
    Notyf.error("Failed to update status");
  };

  const onError = (e) => {
    e.currentTarget.onerror = null; // prevents looping
    e.currentTarget.src = blankAvatar;
  };

  return (
    <Card className="user-admin-card">
      <Card.Header>
        <Card.Title className="mb-0">{userName}</Card.Title>
      </Card.Header>
      <Card.Body className="pt-0">
        <Row className="g-0 ">
          <Col className="text-center">
            <img
              src={props.userData.avatarUrl || blankAvatar}
              width="128"
              height="128"
              className="rounded-circle mb-3"
              alt="avatar"
              onError={onError}
            />
          </Col>
        </Row>

        <Table size="sm" className="my-2">
          <tbody>
            <tr>
              <th>Name</th>
              <td>{userName}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{user.email}</td>
            </tr>
            <tr>
              <th>Signup Date</th>
              <td>{signupDate}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>
                <Badge bg={badgeColor(props.userData.status.id)}>
                  {checkStatus(props.userData.status.id)}
                </Badge>
              </td>
            </tr>
          </tbody>
        </Table>

        <hr />

        <strong>Change Status</strong>

        <Row>
          <Col className="text-center">
            <Button
              onClick={handleClick}
              id="active-btn"
              className="btn btn-success mt-2"
            >
              Active
            </Button>
          </Col>
          <Col className="text-center">
            <Button
              onClick={handleClick}
              id="inactive-btn"
              className="btn btn-danger mt-2"
            >
              Inactive
            </Button>
          </Col>
          <Col className="text-center">
            <Button
              onClick={handleClick}
              id="flagged-btn"
              className="btn btn-warning mt-2"
            >
              Flagged
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

UserAdminSingle.propTypes = {
  userData: PropTypes.shape({
    dateCreated: PropTypes.string.isRequired,
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
  updateSingleUser: PropTypes.func.isRequired,
};

export default UserAdminSingle;
