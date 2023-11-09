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

  return (
    <>
      <hr />
      <Card title="Thông Tin Nhà Tuyển Dụng">
        <Descriptions bordered column={1} style={{ marginBottom: "16px" }}>
          <Descriptions.Item
            label={<strong style={{ fontWeight: "bold" }}>Ảnh đại diện</strong>}
          >
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
          <Descriptions.Item
            label={
              <strong style={{ fontWeight: "bold" }}>Tên nhà tuyển dụng</strong>
            }
          >
            {personalDetail.name}
          </Descriptions.Item>
          <Descriptions.Item
            label={<strong style={{ fontWeight: "bold" }}>Email</strong>}
          >
            {personalDetail.email}
          </Descriptions.Item>

          <Descriptions.Item
            label={<strong style={{ fontWeight: "bold" }}>Địa chỉ</strong>}
          >
            {personalDetail.address}
          </Descriptions.Item>
          <Descriptions.Item
            label={<strong style={{ fontWeight: "bold" }}>Liên hệ</strong>}
          >
            {personalDetail.phoneNumber}
          </Descriptions.Item>
          <Descriptions.Item
            label={<strong style={{ fontWeight: "bold" }}>Mã số thuế</strong>}
          >
            {personalDetail.taxCode ? (
              <span>{personalDetail.taxCode}</span>
            ) : (
              <span>Chưa cập nhật</span>
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <strong style={{ fontWeight: "bold" }}>Nhóm ngành, nghề</strong>
            }
          >
            <Tag color="blue">{personalDetail.category.name}</Tag>
          </Descriptions.Item>
          <Descriptions.Item
            label={<strong style={{ fontWeight: "bold" }}>Địa điểm</strong>}
          >
            <Tag color="green">{personalDetail.location.name}</Tag>
          </Descriptions.Item>
          <Descriptions.Item
            label={<strong style={{ fontWeight: "bold" }}>Website</strong>}
          >
            <a
              href={personalDetail.linkWebsite}
              target="_blank"
              rel="noopener noreferrer"
            >
              {personalDetail.linkWebsite}
            </a>
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
