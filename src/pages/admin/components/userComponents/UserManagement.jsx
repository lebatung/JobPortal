import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Button, Space, Modal, Select } from "antd";
import { loadUsers } from "../../../../helpers/axios_helper";
import axios from "axios";

import ViewUserDetail from "./ViewUserDetail";
import EditUserDetail from "./EditUserDetail";
import AddUser from "./AddUser";
import SearchComponents from "../SearchComponent";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isActiveModalVisible, setIsActiveModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserActive, setSelectedUserActive] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const performSearch = (searchTerm) => {
    const filteredUsers = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredUsers);
  };

  const { id } = useParams();

  useEffect(() => {
    loadUsers()
      .then((data) => {
        setUsers(data);
        //console.log(users.personalDetailId.id)
      })
      .catch((error) => {
        console.error("Error loading users:", error);
      });
  }, [
    isActiveModalVisible,
    isDeleteModalVisible,
    isCreateModalVisible,
    isEditModalVisible,
  ]);

  const columns = [
    {
      title: "STT",
      dataIndex: "rowNumber",
      key: "rowNumber",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <span style={{ color: active ? "green" : "red" }}>
          {active ? "Active" : "Inactive"}
        </span>
      ),
    },

    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEditClick(record)}>
            {" "}
            Edit
            {/* <Link
              to={`/adminDashboard/users/edit-user-detail/${record.personalDetailId}`}
            >
              Edit
            </Link> */}
          </Button>

          <Button
            className="ant-btn-danger"
            onClick={() => handleDeleteClick(record)}
          >
            Delete
          </Button>

          <Button onClick={() => handleViewClick(record)}>View</Button>

          <Button
            className={
              record.active === 1 ? "ant-btn-danger" : "ant-btn-primary"
            }
            onClick={() => handleDisableClick(record)}
          >
            {record.active === 1 ? "Disable" : "Enable"}
          </Button>
        </Space>
      ),
    },
  ];

  const handleDisable = () => {
    if (selectedUserId !== null && selectedUserActive !== null) {
      const userUpdateDTO = {
        id: selectedUserId,
        active: selectedUserActive === 1 ? 0 : 1,
      };

      //console.log("UserUpdateDTO:", userUpdateDTO);

      axios
        .put(`/api/users/disable`, userUpdateDTO)
        .then((response) => {
          console.log(
            `${
              selectedUserActive === 1 ? "Disabled" : "Enabled"
            } user with ID ${selectedUserId}`
          );
          setIsActiveModalVisible(false);
        })
        .catch((error) => {
          console.error("Error disabling/enabling user:", error);
          setIsActiveModalVisible(false);
        });
    } else {
      console.error(
        "Record is invalid or does not contain an ID or active value."
      );
    }
  };

  const handleDelete = () => {
    axios
      .delete(`/api/users/${selectedUserId}`)
      .then((response) => {
        toast.success("Xoá người dùng thành công");
        console.log("Xóa thành công:", response.data);
      })
      .catch((error) => {
        toast.error("Xóa người dùng thất bại");
        console.error("Lỗi khi xóa:", error);
      });
    console.log(selectedUserId);
    setIsDeleteModalVisible(false);
  };

  const handleDisableClick = (record) => {
    setSelectedUserId(record.id);
    setSelectedUserActive(record.active); // Lưu giá trị active vào state
    setIsActiveModalVisible(true);
  };
  const handleDeleteClick = (record) => {
    setSelectedUserId(record.id);
    setIsDeleteModalVisible(true);
  };

  const handleViewClick = (record) => {
    setSelectedUserId(record.id);
    setIsViewModalVisible(true);
  };

  const handleEditClick = (record) => {
    setSelectedUserId(record.id);
    //console.log(selectedUserId);
    setIsEditModalVisible(true);
  };
  const handleCreateClick = () => {
    setIsCreateModalVisible(true);
  };

  const handleRoleChange = (value) => {
    setSelectedRole(value);
  };
  const handleFilterByRole = () => {
    console.log(selectedRole);
    if (selectedRole) {
      // Lọc người dùng dựa trên vai trò đã chọn
      const filteredUsers = users.filter((user) =>
        user.roles.includes(selectedRole)
      );
      setSearchResults(filteredUsers);
    } else {
      // Nếu không có vai trò được chọn, hiển thị tất cả người dùng
      setSearchResults(users);
    }
  };
  return (
    <>
      <ToastContainer />
      <div
        style={{
          marginBottom: 10,
          marginTop: 10,
          marginLeft: 5,
          marginRight: 5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SearchComponents onSearch={performSearch} />
        <div>
          <Select
            style={{ width: 200, marginRight: 10 }}
            placeholder="Lọc người dùng theo vai trò"
            onChange={handleRoleChange}
          >
            <Select.Option value="">All</Select.Option>
            <Select.Option value="ROLE_RECRUITMENT">
              Recruitment
            </Select.Option>{" "}
            <Select.Option value="ROLE_CANDIDATE">Candidate</Select.Option>{" "}
          </Select>

          <Button type="primary" onClick={handleFilterByRole}>
            Lọc
          </Button>
        </div>

        <Button type="primary" onClick={() => handleCreateClick()}>
          Add New User
        </Button>
      </div>
      <hr />
      <Table
        columns={columns}
        dataSource={searchResults.length > 0 ? searchResults : users}
      />
      <Modal
        title={selectedUserActive === 1 ? "Confirm Disable" : "Confirm Enable"}
        visible={isActiveModalVisible}
        onOk={handleDisable}
        onCancel={() => setIsActiveModalVisible(false)}
      >
        Are you sure you want to{" "}
        {selectedUserActive === 1 ? "disable" : "enable"} this user's account?
      </Modal>
      <Modal
        title={"Confirm Deleting"}
        visible={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      >
        Are you sure you want to {"delete"} this user's account?
      </Modal>
      <Modal
        title="View User Detail"
        visible={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedUserId && <ViewUserDetail selectedUserId={selectedUserId} />}
      </Modal>
      <Modal
        title="Edit User Detail"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        width={1200}
        footer={[
          <Button key="back" onClick={() => setIsEditModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedUserId && <EditUserDetail selectedUserId={selectedUserId} />}
      </Modal>
      <Modal
        title="Create User"
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        width={1200}
        footer={[
          <div
            key="custom-footer"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button key="back" onClick={() => setIsCreateModalVisible(false)}>
              Close
            </Button>
            ,
          </div>,
        ]}
      >
        {<AddUser />}
      </Modal>
    </>
  );
}

export default UserManagement;
