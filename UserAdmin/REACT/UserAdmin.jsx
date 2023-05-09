import { React, useEffect, useState } from "react";
import {
  Col,
  Row,
  Card,
  Table,
  Button,
  Container,
  InputGroup,
} from "react-bootstrap";
import debug from "sabio-debug";
import UserAdminRow from "./UserAdminRow";
import UserAdminSingle from "./UserAdminSingle";
import userService from "../../services/userService";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import { Formik, Form as FormikForm, Field } from "formik";
import { RefreshCw, Search } from "react-feather";
import "./userAdmin.css";
import { Notyf } from "notyf";
import * as lookUpService from "../../services/lookUpService";

const _logger = debug.extend("UserAdmin");
const notyf = new Notyf({ position: { y: "top" } });

function UserAdmin() {
  const [userListData, setUserListData] = useState({
    arrayOfUsers: [],
    userComponents: [],
    pageIndex: 0,
    pageSize: 12,
    totalCount: 20,
  });

  const [singleUser, setSingleUser] = useState();

  const updateSingleUser = (statusId) => {
    setSingleUser((prevState) => {
      const newSingleUser = { ...prevState };
      newSingleUser.status.id = statusId;
      return newSingleUser;
    });
  };

  useEffect(() => {
    setUserListData((prevState) => {
      const newUserListData = { ...prevState };
      newUserListData.userComponents.map(updateStatus);
      return newUserListData;
    });
  }, [singleUser]);

  const updateStatus = (userRow) => {
    if (singleUser.id) {
      if (userRow.props.userData.id === singleUser.id) {
        const index = userRow.key;
        setUserListData((prevState) => {
          const newStatusChange = { ...prevState };
          newStatusChange.arrayOfUsers[index].status.id = singleUser.status.id;
          newStatusChange.userComponents =
            newStatusChange.arrayOfUsers.map(mapUsers);
          return newStatusChange;
        });
      }
    }
  };

  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState(null);

  useEffect(() => {
    if (query) {
      if (filter === "All") {
        userService
          .searchPaginated(query, userListData.pageIndex, userListData.pageSize)
          .then(onGetUsersSuccess)
          .catch(onGetUsersError);
      } else {
        userService
          .searchAndFilterPaginated(
            query,
            filter,
            userListData.pageIndex,
            userListData.pageSize
          )
          .then(onGetUsersSuccess)
          .catch(onGetUsersError);
      }
    } else if (query === null) {
      if (filter !== "All") {
        userService
          .getByStatus(filter, userListData.pageIndex, userListData.pageSize)
          .then(onGetUsersSuccess)
          .catch(onGetUsersError);
      } else {
        userService
          .getPaginated(userListData.pageIndex, userListData.pageSize)
          .then(onGetUsersSuccess)
          .catch(onGetUsersError);
      }
    }
  }, [userListData.pageIndex, filter, query]);

  const onGetUsersSuccess = (response) => {
    const total = response.item.totalCount;
    const page = response.item.pageIndex;
    const users = response.item.pagedItems;

    setUserListData((prevState) => {
      const newUserList = { ...prevState };
      newUserList.arrayOfUsers = users;
      newUserList.userComponents = users.map(mapUsers);
      newUserList.pageIndex = page;
      newUserList.totalCount = total;
      setSingleUser(users[0]);
      return newUserList;
    });
  };

  const onGetUsersError = (error) => {
    _logger(error);
    notyf.error("Failed to retrieve user data");
  };

  const mapUsers = (user, index) => {
    return (
      <UserAdminRow userData={user} key={index} setSingleUser={setSingleUser} />
    );
  };

  const onPageChange = (page) => {
    setUserListData((prevState) => {
      const newData = { ...prevState };
      newData.pageIndex = page - 1;
      return newData;
    });
  };

  const filterForm = {
    filter: "",
  };

  const onFilterChange = (values) => {
    setUserListData((prevState) => {
      const newFilter = { ...prevState };
      newFilter.pageIndex = 0;
      return newFilter;
    });

    setFilter(values.filter);
  };

  const searchForm = {
    query: "",
  };

  const onSearch = (values) => {
    setUserListData((prevState) => {
      const newSearch = { ...prevState };
      newSearch.pageIndex = 0;
      return newSearch;
    });

    setQuery(values.query);
  };

  useEffect(() => {
    lookUpService
      .getTypes(["StatusTypes"])
      .then(onGetTypesSuccess)
      .catch(onGetTypesError);
  }, []);

  const [statusTypes, setStatusTypes] = useState();

  const onGetTypesSuccess = (response) => {
    const statusTypes = response.item.statusTypes;
    setStatusTypes(statusTypes);
  };

  const onGetTypesError = (error) => {
    _logger(error);
  };

  return (
    <Container fluid>
      <Row className="mb-2 mb-xl-3">
        <Col xl="2">
          <h3>User Admin Dashboard</h3>
        </Col>
        <Col>
          <Formik
            enableReinitialize={true}
            initialValues={searchForm}
            onSubmit={onSearch}
          >
            <FormikForm>
              <InputGroup>
                <Field name="query"></Field>
                <Button type="submit" variant="secondary">
                  {<Search className="feather" />}
                </Button>
              </InputGroup>
            </FormikForm>
          </Formik>
        </Col>
      </Row>
      <Row>
        <Col xl="8">
          <Card className="user-admin-card">
            <Card.Header className="pb-0">
              <Row>
                <Col>
                  <Card.Title className="mb-0">Users</Card.Title>
                </Col>
                <Col className="text-center">
                  <Pagination
                    className="mt-0 mb-0"
                    onChange={onPageChange}
                    pageSize={userListData.pageSize}
                    current={userListData.pageIndex + 1}
                    total={userListData.totalCount}
                    locale={locale}
                  />
                </Col>
                <Col className="text-end">
                  <Formik
                    enableReinitialize={true}
                    initialValues={filterForm}
                    onSubmit={onFilterChange}
                  >
                    <FormikForm>
                      <div className="user-admin-filter">
                        {statusTypes && (
                          <Field
                            as="select"
                            name="filter"
                            className="user-admin-dropdown"
                          >
                            <option value="All">Filter Status</option>
                            <option value="All">All</option>
                            <option value={statusTypes[0].id}>
                              {statusTypes[0].name}
                            </option>
                            <option value={statusTypes[1].id}>
                              {statusTypes[1].name}
                            </option>
                            <option value={statusTypes[3].id}>
                              {statusTypes[3].name}
                            </option>
                          </Field>
                        )}
                        <Button type="submit" variant="info" className="btn-sm">
                          <RefreshCw className="feather" />
                        </Button>
                      </div>
                    </FormikForm>
                  </Formik>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Table className="mb-0">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Email</th>
                    <th className="text-end">Status</th>
                  </tr>
                </thead>
                <tbody>{userListData.userComponents}</tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col xl="4">
          {singleUser && (
            <UserAdminSingle
              userData={singleUser}
              updateSingleUser={updateSingleUser}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default UserAdmin;
