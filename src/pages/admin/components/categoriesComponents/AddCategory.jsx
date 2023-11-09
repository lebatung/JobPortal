import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Form, Input, Select, Modal, Button, Card, Descriptions } from "antd";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadCategory } from "../../../../helpers/axios_helper";

const { Option } = Select;

const AddCategory = () => {
  const [form] = Form.useForm();

  const [isCreateVisible, setIsCreateModalVisible] = useState(false);

  const [category, setCategory] = useState({
    name: "",
    enable: "",
  });

  const { name, enable } = category;

  const onInputChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const { id } = useParams();

  useEffect(() => {
    loadCategory(id)
      .then((data) => {
        setCategory(data);
        form.setFieldsValue(data); // Đặt giá trị cho form
      })
      .catch((error) => {
        console.error("Error loading category:", error);
      });
  }, [id, form]);

  const handleCreateClick = (id) => {
    setIsCreateModalVisible(true);
  };

  const onFinish = (values) => {
    form
      .validateFields()
      .then(() => {
        // Tất cả các trường đều hợp lệ, tiến hành submit
        axios
          .post(`http://localhost:8080/api/categories/create`, values)
          .then((response) => {
            console.log("Thêm nhóm ngành thành công:", response.data);
            toast.success("Thêm nhóm ngành thành công");
            setIsCreateModalVisible(false);
          })
          .catch((error) => {
            console.error("ERROR:", error);
            toast.error("Thêm nhóm ngành thất bại");
          });
      })
      .catch((error) => {
        // Có trường không hợp lệ, tắt modal
        setIsCreateModalVisible(false);
      });
  };

  return (
    <>
      <ToastContainer />
      <hr />
      <Card title="Edit Category">
        <div>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Tên nhóm ngành, nghề">
                <Form.Item
                  label="Tên nhóm nghành:"
                  name="name" // Tên của trường
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên nhóm ngành",
                    },
                  ]}
                >
                  <Input
                    name="name" // Tên của trường
                    onChange={(e) => onInputChange(e)}
                  />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Form.Item
                  label="Trạng thái"
                  name="enable" // Tên của trường
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn trạng thái",
                    },
                  ]}
                >
                  <Select
                    onChange={(value) =>
                      setCategory({ ...category, enable: value })
                    }
                  >
                    <Option value={1}>Enable</Option>
                    <Option value={0}>Disable</Option>
                  </Select>
                </Form.Item>
              </Descriptions.Item>
            </Descriptions>
            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button type="primary" onClick={() => handleCreateClick(id)}>
                Xác nhận
              </Button>
            </div>
          </Form>
        </div>
      </Card>
      <Modal
        title={"Confirm Creating"}
        visible={isCreateVisible}
        onOk={form.submit} // Sử dụng form.submit để gửi form
        onCancel={() => setIsCreateModalVisible(false)}
      >
        Are you sure you want to {"Create"} this category?
      </Modal>
    </>
  );
};

export default AddCategory;
