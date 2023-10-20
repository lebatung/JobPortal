import React, { useEffect, useState } from "react";
import { Card, Button, Descriptions, Tag, Image, Modal } from "antd";
import { loadCategory, loadPersonalDetail } from "../../../../helpers/axios_helper";

import EditCategory from "./EditCategory";

export default function ViewUserDetail(props) {

  const selectedCategoryId = props.selectedCategoryId;

  

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [category, setCategory] = useState({
    name: "",
    enable: "",

  });

  const handleEditClick = () => {
    //console.log(personalDetail.id);
    
    setIsEditModalVisible(true);
  };

  useEffect(() => {
    loadCategory(selectedCategoryId)
      .then((data) => {
        setCategory(data);
        console.log("reponse data: ", data);
      })
      .catch((error) => {
        console.error("Error loading users:", error);
      });
  }, [selectedCategoryId]);

  return (
    <>
      <hr />
      <Card title="Thông Tin Người dùng">
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Tên nhóm ngành, nghề">
            {category.name}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            { <span style={{ color: category.enable ? "green" : "red" }}>
          {category.enable ? "Enable" : "Disable"}
        </span>}
          </Descriptions.Item>
        </Descriptions>
        <div style={{ marginTop: 16 }}>
          <Button  style={{marginRight: 16 }}
          type="primary" 
          onClick={() => handleEditClick()}
          >
            Edit

          </Button>
          <Button type="danger">Delete</Button>
        </div>
      </Card>
      <Modal
        title="Edit User Detail"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        width={600}
        footer={[
          <Button key="back" onClick={() => setIsEditModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedCategoryId && <EditCategory selectedCategoryId={selectedCategoryId} />}
      </Modal>
    </>
  );
}
