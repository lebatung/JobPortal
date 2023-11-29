import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  Button,
  Space,
  Modal,
  Select,
  Input,
  Col,
  Card,
  Row,
} from "antd";
import {
  loadUsersByActive,
  loadUsersNPD,
} from "../../../../helpers/axios_helper";
import axios from "axios";

import ViewUserDetail from "./ViewUserDetail";
import EditUserDetail from "./EditUserDetail";
import AddUser from "./AddUser";
import SearchComponents from "../SearchComponent";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import Icon from "@ant-design/icons/lib/components/Icon";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isActiveModalVisible, setIsActiveModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserActive, setSelectedUserActive] = useState(null);

  const [disableReason, setDisableReason] = useState("");
  const [isMessageInputVisible, setIsMessageInputVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(false);
  const [selectedPersonalDetailId, setSelectedPersonalDetailId] =
    useState(null);

  const handleDisableReasonChange = (event) => {
    setDisableReason(event.target.value);
  };

  const [searchResults, setSearchResults] = useState([]);
  const performSearch = (searchTerm) => {
    const filteredUsers = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredUsers);
  };

  const [activeUsersData, setActiveUsersData] = useState([]);
  const [pendingUsersData, setPendingUsersData] = useState([]);
  const [inactiveUsersData, setInactiveUsersData] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    loadUsersNPD()
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

  useEffect(() => {
    loadUsersByActive()
      .then((response) => {
        console.log("users Active Response:", response);
        if (response) {
          setActiveUsersData(response.activeUsers || []);
          setPendingUsersData(response.pendingUsers || []);
          setInactiveUsersData(response.inactiveUsers || []);
        } else {
          console.error("No data in loadUsersByActive response.");
        }
      })
      .catch((error) => {
        console.error("Error loading loadUsersByActive:", error);
      });
  }, []);

  const columns = [
    {
      title: "STT",
      dataIndex: "rowNumber",
      key: "rowNumber",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên người dùng",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <span
          style={{
            color: active === 1 ? "green" : active === 2 ? "orange" : "red",
          }}
        >
          {active === 1
            ? "Đang hoạt động"
            : active === 2
            ? "Chờ duyệt"
            : "Ngừng hoạt động"}
        </span>
      ),
    },

    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEditClick(record)}>
            {" "}
            Edit
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
              record.active === 1
                ? "ant-btn-danger"
                : record.active === 2
                ? "ant-btn-warning"
                : "ant-btn-primary"
            }
            onClick={() => handleDisableClick(record)}
          >
            {record.active === 1
              ? "Disable"
              : record.active === 2
              ? "Activate"
              : "Enable"}
          </Button>
        </Space>
      ),
    },
  ];

  const handleDisable = () => {
    console.log("selectedUser", selectedUser);
    if (selectedUserId !== null && selectedUserActive !== null) {
      const userUpdateDTO = {
        id: selectedUserId,
        active: selectedUserActive === 1 ? 0 : 1,
      };

      axios
        .put(`/api/users/disable`, userUpdateDTO)
        .then((response) => {
          console.log(
            `${
              selectedUserActive === 1 ? "Disabled" : "Enabled"
            } user with ID ${selectedUserId}`
          );
          setIsActiveModalVisible(false);
          toast.success(
            `${
              selectedUserActive === 1 ? "Vô hiệu hóa" : "Kích hoạt"
            } tài khoản thành công`
          );
        })
        .catch((error) => {
          console.error("Error disabling/enabling user:", error);
          setIsActiveModalVisible(false);
          toast.error(
            `${selectedUserActive === 1 ? "Disabled" : "Enabled"} thành công`
          );
        });
      console.log("userUpdateDTO", userUpdateDTO);
    } else {
      console.error(
        "Record is invalid or does not contain an ID or active value."
      );
    }

    if (selectedUserActive === 1) {
      const sendMailData = {
        subject: "Tạm khóa tài khoản",
        message: disableReason, // Sử dụng giá trị từ state disableReason
      };

      axios
        .post(`/mail/send/${selectedUser.personalDetail.email}`, sendMailData)
        .then((mailResponse) => {
          console.log("Email sent successfully");
        })
        .catch((mailError) => {
          console.error("Error sending email:", mailError);
        });

      console.log("sendMailData", sendMailData);
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
    setSelectedUser(record);
    setSelectedUserId(record.id);
    setSelectedUserActive(record.active);
    if (record.active === 1) {
      setIsMessageInputVisible(true); // Hiển thị Input khi Active là 1
    } else {
      setIsMessageInputVisible(false);
    }
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
    setSelectedPersonalDetailId(record.personalDetail.id);
    //console.log(selectedUserId);
    setIsEditModalVisible(true);
  };
  const handleCreateClick = () => {
    setIsCreateModalVisible(true);
  };

  const handleRoleChange = (value) => {
    setSelectedRole(value);
  };
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };
  const handleFilterByRole = () => {
    console.log(selectedRole);
    if (selectedRole) {
      const filteredUsers = users.filter((user) =>
        user.roles.includes(selectedRole)
      );
      setSearchResults(filteredUsers);
    } else {
      setSearchResults(users);
    }
  };

  const handleFilterByStatus = () => {
    if (selectedStatus !== null) {
      const filteredUsers = users.filter(
        (user) => user.active === selectedStatus
      );
      setSearchResults(filteredUsers);
    } else {
      setSearchResults(users);
    }
  };

  const handleFilter = () => {
    if (selectedRole || selectedStatus !== null) {
      if (selectedRole && selectedStatus !== null) {
        const filteredUsers = users.filter(
          (user) =>
            user.roles.includes(selectedRole) && user.active === selectedStatus
        );
        setSearchResults(filteredUsers);
      } else {
        const filteredUsers = users.filter((user) =>
          selectedRole
            ? user.roles.includes(selectedRole)
            : true || selectedStatus !== null
            ? user.active === selectedStatus
            : true
        );
        setSearchResults(filteredUsers);
      }
    } else {
      setSearchResults(users);
    }
  };

  const cardData = [
    {
      status: "Tổng cộng",
      iconType: "info-circle",
      imageSrc: `http://localhost:8080/api/files/peopleTotal.png`,
      data: users.length,
      color: "#000000",
    },
    {
      status: "Đang hoạt động",
      iconType: "play-circle",
      imageSrc: `http://localhost:8080/api/files/peopleActive.png`,
      data: activeUsersData.length,
      textColor: "#3587A4",
    },
    {
      status: "Ngừng hoạt động",
      iconType: "pause-circle",
      imageSrc: `http://localhost:8080/api/files/peopleInactive.png`,
      data: inactiveUsersData.length,
      textColor: "#2D898B",
    },
    {
      status: "Chờ duyệt",
      iconType: "clock-circle",
      imageSrc: `http://localhost:8080/api/files/peoplePending.png`,
      data: pendingUsersData.length,
      textColor: "#C1DFF0",
    },
  ];

  return (
    <>
      <ToastContainer />
      <div>
        <Row gutter={16}>
          {cardData.map((data, index) => (
            <Col span={6} key={index}>
              <Card
                style={{
                  margin: "5px",
                  borderRadius: "5px",
                  border: "1px solid grey",
                  height: "120px",
                }}
              >
                <Row>
                  <Col span={12}>
                    <div style={{ flex: 1 }}>
                      <img
                        src={data.imageSrc}
                        alt={data.status}
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: "center", marginLeft: "10px" }}>
                      <Icon
                        type={data.iconType}
                        style={{ fontSize: "24px", marginRight: "8px" }}
                      />
                      <h3 style={{ display: "inline" }}>{data.status}</h3>
                      <h4>{data.data}</h4>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
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
        <SearchComponents
          onSearch={performSearch}
          style={{ border: "2px solid #000", borderRadius: "5px" }}
        />
        <div>
          <Select
            style={{
              width: 200,
              marginRight: 10,
              border: "0.5px solid grey",
              borderRadius: "5px",
            }}
            placeholder="Lọc người dùng theo trạng thái"
            onChange={handleStatusChange}
          >
            <Select.Option value={null}>Tất cả</Select.Option>
            <Select.Option value={1}>Đang hoạt động</Select.Option>
            <Select.Option value={0}>Ngừng hoạt động</Select.Option>
            <Select.Option value={2}>Chờ duyệt</Select.Option>
          </Select>
          <Select
            style={{
              width: 200,
              marginRight: 10,
              border: "0.5px solid grey",
              borderRadius: "5px",
            }}
            placeholder="Lọc người dùng theo vai trò"
            onChange={handleRoleChange}
          >
            <Select.Option value="">Tất cả</Select.Option>
            <Select.Option value="ROLE_RECRUITMENT">
              Nhà tuyển dụng
            </Select.Option>{" "}
            <Select.Option value="ROLE_CANDIDATE">Người tìm việc</Select.Option>{" "}
          </Select>

          <Button type="primary" onClick={handleFilter}>
            Lọc
          </Button>
        </div>

        <Button type="primary" onClick={() => handleCreateClick()}>
          Thêm người dùng
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
        {selectedUserActive === 1 ? (
          <>
            <p>Nhập vào lí do khóa tài khoản:</p>
            <Input
              placeholder="Enter reason for disabling"
              onChange={(e) => setDisableReason(e.target.value)}
            />
          </>
        ) : (
          <p>Are you sure you want to enable this user's account?</p>
        )}
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
        title="Thông tin tài khoản"
        visible={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <div
            key="custom-footer"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {" "}
            <Button key="back" onClick={() => setIsViewModalVisible(false)}>
              Close
            </Button>
            ,
          </div>,
        ]}
      >
        {selectedUserId && <ViewUserDetail selectedUserId={selectedUserId} />}
      </Modal>
      <Modal
        title="Cập nhật thông tin tài khoản"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        width={1200}
        footer={[
          <div
            key="custom-footer"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button
              key="back"
              onClick={() => setIsEditModalVisible(false)}
              style={{ marginRight: "auto", marginLeft: 0 }}
            >
              Close
            </Button>
            ,
          </div>,
        ]}
      >
        {selectedUserId && (
          <EditUserDetail
            selectedUserId={selectedUserId}
            selectedPersonalDetailId={selectedPersonalDetailId}
          />
        )}
      </Modal>
      <Modal
        title="Thêm tài khoản người dùng"
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
