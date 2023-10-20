import React, { useState, useEffect } from "react";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { Input, Form, Checkbox, Button, Select } from "antd";
import {
  request,
  loadCategories,
  loadLocations,
  setAuthHeader,
} from "../../../helpers/axios_helper";

const { Option } = Select;

export default function RecruitmentRegistrationForm() {
  const [showDetailedForm, setShowDetailedForm] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [categoryId, setCattegoryId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [roleId, setRoleId] = useState(13);

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const onFinishRecruitmentRegistration = (values) => {
    setUsername(values.username);
    setEmail(values.email);
    setPassword(values.password);

    setShowDetailedForm(true);
  };

  const onFinishCandidateDetailRegistration = (values) => {
    setName(values.name);
    setCattegoryId(values.category);
    setLocationId(values.location);
    setRoleId(13);

    const candidateFormData = {
      username,
      email,
      password,
      name,
      categoryId,
      locationId,
      roleId: roleId,
    };

    request("POST", "/register", candidateFormData)
      .then((response) => {
        toast.success("Đăng ký thành công");
        console.log("response:", response.data);
        setAuthHeader(response.data.token);
      })
      .catch((error) => {
        console.error("Register Error:", error);
        window.localStorage.removeItem("au_token");
      });

    // In thông tin đã lưu lên console
    console.log("Thông tin đăng ký:", candidateFormData);
  };

  useEffect(() => {
    loadCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });

    loadLocations()
      .then((data) => {
        setLocations(data);
      })
      .catch((error) => {
        console.error("Error loading locations:", error);
      });
  }, []);

  const pDiv = {
    textAlign: "center",
    fontSize: "17px",
  };
  const registerButton = {
    width: "100%",
  };

  return (
    <div>
      <ToastContainer />
      <div>
        {showDetailedForm ? (
          <Form
            name="recruitmentDetailRegistration"
            onFinish={onFinishCandidateDetailRegistration}
          >
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên công ty!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Họ và tên ứng viên"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name="category"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ngành nghề!",
                },
              ]}
            >
              <Select
                placeholder="Chọn ngành nghề"
                onChange={(value) => setCattegoryId(value)}
              >
                {categories.map((categories) => (
                  <Option key={categories.id} value={categories.id}>
                    {categories.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="location"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn địa chỉ!",
                },
              ]}
            >
              <Select
                placeholder="Chọn địa chỉ"
                onChange={(value) => setLocationId(value)}
              >
                {locations.map((locations) => (
                  <Option key={locations.id} value={locations.id}>
                    {locations.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={registerButton}>
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form
            name="recruitmentRegistration"
            onFinish={onFinishRecruitmentRegistration}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên người dùng!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Tên người dùng"
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "Email không hợp lệ!",
                },
                {
                  required: true,
                  message: "Vui lòng nhập email!",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Mật khẩu"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Vui lòng xác nhận mật khẩu!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không trùng khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Xác nhận mật khẩu"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Form.Item name="agreement" valuePropName="checked" noStyle>
                <Checkbox>
                  Tôi đã đọc và đồng ý với các điều khoản và điều kiện
                </Checkbox>
              </Form.Item>

              <a href="/">Điều khoản</a>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={registerButton}>
                Tiếp tục
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
}
