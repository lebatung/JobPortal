import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Card,
  Modal,
  Descriptions,
} from "antd";
import { loadCategory } from "../../../../helpers/axios_helper";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;

const EditCategory = (props) => {

const selectedCategoryId = props.selectedCategoryId;

  const [form] = Form.useForm();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [category, setCategory] = useState({
    name: "",
    enable: "",
  });

  const { name, enable } = category;

  const onInputChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const { id } = useParams();

  useEffect(() => {
    loadCategory(selectedCategoryId)
      .then((data) => {
        setCategory(data);
      })
      .catch((error) => {
        console.error("Error loading category:", error);
      });
  }, [selectedCategoryId]);

  const onFinish = () => {
    const formData = {
      name,
      enable,
    };

    axios
      .put(`http://localhost:8080/api/categories/${category.id}`, formData)
      .then((response) => {
        console.log("Đã cập nhật thành công:", response.data);
        toast.success("Cập nhật thành công");
        setIsEditModalVisible(false);
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật:", error);
        setIsEditModalVisible(false);
        toast.error("Cập nhật không thành công.");
        
      });
    //console.log("Submitted values:", formData);
  };

  const handleEditClick = () => {
    //console.log(category.id, category.name);
    setIsEditModalVisible(true);
  };

  return (
    <>
      <ToastContainer />
      <hr />
      <Card >
        <div>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Tên nhóm ngành, nghề">
                {
                  <>
                    <Form.Item
                      label="Tên nhóm ngành:"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên nhóm ngành",
                        },
                      ]}
                    >
                      <Input
                        value={name}
                        name="name"
                        onChange={(e) => onInputChange(e)}
                      />
                    </Form.Item>
                  </>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {
                  <>
                    <Form.Item label="Trạng thái hoạt động">
                      <Select
                        value={enable}
                        onChange={(value) =>
                          setCategory({ ...category, enable: value })
                        }
                      >
                        <Option value={1}>Hoạt động</Option>
                        <Option value={0}>Ngừng hoạt động</Option>
                      </Select>
                    </Form.Item>
                  </>
                }
              </Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 16, display: "flex",
                justifyContent: "flex-end",}}>
              <Button
                className="ant-btn-primary"
                onClick={() => handleEditClick()}
              >
                {" "}
                Lưu{" "}
              </Button>
            </div>
          </Form>
        </div>
      </Card>
      <Modal
        title={"Confirm Editing"}
        visible={isEditModalVisible}
        onOk={onFinish}
        onCancel={() => setIsEditModalVisible(false)}
      >
        Are you sure you want to {"Edit"} this category?
      </Modal>
    </>
  );
};

export default EditCategory;
