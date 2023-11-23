import React, { useEffect, useState } from "react";
import { Card, Button, Descriptions, Tag, Image, Modal } from "antd";
import {
  loadPersonalDetail,
  loadPersonalDetailById,
} from "../../../../helpers/axios_helper";

import EditUserDetail from "./EditUserDetail";

export default function ViewUserDetail(props) {
  const selectedUserId = props.selectedUserId;

  //console.log(selectedUserId);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

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

  const handleEditClick = () => {
    //console.log(personalDetail.id);
    setIsEditModalVisible(true);
  };

  useEffect(() => {
    loadPersonalDetail(selectedUserId)
      .then((data) => {
        setPersonalDetail(data);
        console.log("loadPersonalDetail data: ", data);
      })
      .catch((error) => {
        console.error("Error loading users:", error);
      });
  }, [selectedUserId]);

  const roleMapping = {
    11: "ADMIN",
    12: "Nhà tuyển dụng",
    13: "Người ứng tuyển",
    // Thêm các ánh xạ khác nếu cần thiết
  };
  let roleID = "";
  if (
    personalDetail.userRoleDTOList &&
    personalDetail.userRoleDTOList.length > 0
  ) {
    roleID = personalDetail.userRoleDTOList[0].roleID;
  }

  const roleName = roleMapping[roleID];
  return (
    <>
      <hr />
      <Card title="Thông Tin Người dùng">
        <Descriptions bordered column={1} size="small">
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
          <Descriptions.Item label="Tên người dùng">
            {personalDetail.name}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            {roleName || "Không rõ vai trò"}
          </Descriptions.Item>

          <Descriptions.Item label="Email">
            {personalDetail.email}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {personalDetail.gender === 0 ? "Nam" : "Nữ"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {personalDetail.dayOfBirth}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {personalDetail.address}
          </Descriptions.Item>
          <Descriptions.Item label="Số liên hệ">
            {personalDetail.phoneNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Mã số thuế">
            {personalDetail.taxCode}
          </Descriptions.Item>
          <Descriptions.Item label="Nhóm ngành">
            <Tag color="blue">{personalDetail.category.name}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Địa điểm">
            <Tag color="green">{personalDetail.location.name}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Website">
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
          <Button type="primary" onClick={() => handleEditClick()}>
            Edit
            {/* <Link
              to={`/adminDashboard/users/edit-user-detail/${personalDetail.id}`}
            >
              Edit
            </Link> */}
          </Button>
          <Button type="danger">Delete</Button>
        </div>
      </Card>
      <Modal
        title="Edit User Detail"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        width={1200}
        footer={[
          <Button
            key="back"
            onClick={() => setIsEditModalVisible(false)}
            style={{ marginLeft: 0 }}
          >
            Close
          </Button>,
        ]}
      >
        {selectedUserId && <EditUserDetail selectedUserId={selectedUserId} />}
      </Modal>
    </>
  );
}
