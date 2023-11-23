import React, { useState } from "react";
import { Card, Descriptions, Form, Input, Button, message } from "antd";

import { changePassword, request } from "../../../../../helpers/axios_helper";
import { useAuth } from "../../../../../contexts/AuthContext";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {
  const { username } = useAuth();

  const [form] = Form.useForm();

  const [requestPassword, setRequestPassword] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const { currentPassword, newPassword } = requestPassword;

  const onFinish = async (values) => {
    const requestData = {
      username,
      currentPassword: values.currentPassword,
      newPassword: values.newPassword, // Sửa chính tả ở đây
    };
  
    try {
      await request("PUT", `/changePassword`, requestData) // Sử dụng await
        .then((response) => {
          toast.success("Đổi mật khẩu thành công");
          console.log("response:", response.data);
        })
        .catch((error) => {
          console.error("Đổi mật khẩu thất bại", error);
          toast.error("Mật khẩu cũ không chính xác");
        });
    } catch (error) {
      console.error("Error:", error);
    }
  
    console.log(requestData);
  };
  

  return (
    <>
      <ToastContainer />
      <Card>
        <Form
          form={form}
          name="changePassword"
          onFinish={onFinish}
          layout="vertical"
        >
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Mật Khẩu Hiện Tại">
              <Form.Item
                name="currentPassword"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu hiện tại",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="Mật Khẩu Mới">
              <Form.Item
                name="newPassword"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới" },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Descriptions.Item>
          </Descriptions>
          <div
            key="custom-footer"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <div style={{ flex: 1 }}></div> {/* Phần tử trống */}
            <Button
              type="primary"
              htmlType="submit"
              style={{
                marginTop: 16,
              }}
            >
              Thay Đổi Mật Khẩu
            </Button>
          </div>
        </Form>
      </Card>
    </>
  );
};

export default ChangePassword;
