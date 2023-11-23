import React, { useState, useEffect } from "react";
import { Card, Descriptions, Tag, Image, Button, Modal } from "antd";

import { useAuth } from "../../../../../contexts/AuthContext";
import { loadPersonalDetailByUsername } from "../../../../../helpers/axios_helper";

import ChangePassword from "./ChangePassword";
import EditPersonalDetail from "./EditPersonalDetail";

const UserDetailManagement = () => {
  const { username } = useAuth();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isChangePwModalVisible, setIsChangePwModalVisible] = useState(false);

  const [selectedPersonalDetailId, setSelectedPersonalDetailId] =
    useState(null);

  const [personalDetail, setPersonalDetail] = useState({
    avatar: "",
    name: "",
    email: "",
    gender: "",
    location: "",
    category: "",
    address: "",
    dayOfBirth: null,
    phoneNumber: "",
    taxCode: "",
    linkWebsite: "",
    userRoleDTOList: "",
  });

  useEffect(() => {
    loadPersonalDetailByUsername(username)
      .then((data) => {
        setPersonalDetail(data);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });
  }, [username]);

  const handleEditClick = () => {
    setSelectedPersonalDetailId(personalDetail.id);
    console.log(personalDetail.id);
    setIsEditModalVisible(true);
  };

  const handleChangePw = () => {
    console.log(personalDetail.id);
    setIsChangePwModalVisible(true);
  };
  function formatGender(gender) {
    return gender === 0 ? "Nam" : "Nữ";
  }
  function formatDateString(originalDate) {
    const parts = originalDate.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return (
    <>
      <hr />
      <Card title="Thông Tin ứng viên">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Ảnh đại diện">
            {
              <div
                style={{
                  alignItems: "center",
                }}
              >
                <Image
                  width={100}
                  src={`http://localhost:8080/api/files/${personalDetail.avatar}`}
                  alt="Avatar"
                />
              </div>
            }
          </Descriptions.Item>
          <Descriptions.Item label="Tên ứng viên">
            {personalDetail.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {personalDetail.email}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {personalDetail.dayOfBirth}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {formatGender(personalDetail.gender)}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {personalDetail.address}
          </Descriptions.Item>
          <Descriptions.Item label="Số liên hệ">
            {personalDetail.phoneNumber}
          </Descriptions.Item>

          <Descriptions.Item label="Nhóm ngành, nghề">
            <Tag color="blue">{personalDetail.category.name}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Địa điểm">
            <Tag color="green">{personalDetail.location.name}</Tag>
          </Descriptions.Item>
        </Descriptions>
        <div style={{ marginTop: 16 }}>
          <Button
            type="primary"
            onClick={() => handleEditClick()}
            style={{ marginRight: 16 }}
          >
            Edit
          </Button>
          <Button onClick={() => handleChangePw()}>Đổi mật khẩu</Button>
        </div>
      </Card>
      <Modal
        title="Edit User Detail"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        width={1200}
        footer={[
          <div
            key="custom-footer"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button key="back" onClick={() => setIsEditModalVisible(false)}>
              Close
            </Button>
            ,
          </div>,
        ]}
      >
        {
          <EditPersonalDetail
            selectedPersonalDetailId={selectedPersonalDetailId}
          />
        }
      </Modal>
      <Modal
        title={"Đổi mật khẩu"}
        visible={isChangePwModalVisible}
        onCancel={() => setIsChangePwModalVisible(false)}
        footer={[
          <div
            key="custom-footer"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button key="back" onClick={() => setIsChangePwModalVisible(false)}>
              Close
            </Button>
            ,
          </div>,
        ]}
      >
        {<ChangePassword />}
      </Modal>
    </>
  );
};

export default UserDetailManagement;
