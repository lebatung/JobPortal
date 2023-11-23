import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Form, Input, Button, Tabs } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import TabPane from "antd/es/tabs/TabPane";

import { request, setAuthHeader } from "../../../helpers/axios_helper";
import { useAuth } from "../../../contexts/AuthContext";

function LoginForm({ updateIsAuthenticated, updateIsLoginFormVisible }) {
  const navigate = useNavigate();

  const onFinish = (values) => {
    const loginData = {
      username: values.username,
      password: values.password,
    };

    request("POST", "/login", loginData)
      .then((response) => {
        toast.success("Đăng nhập thành công");
        setAuthHeader(response.data.token);
        updateIsAuthenticated(true);
        updateIsLoginFormVisible(false);

        window.location.reload();
        console.log(response.data.token);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            toast.error("Tài khoản không tồn tại.");
          } else if (error.response.status === 401) {
            toast.error("Sai tài khoản hoặc mật khẩu.");
          } else if (error.response.status === 403) {
            toast.error("Tài khoản của bạn đã bị khóa. Liên hệ admin để tìm giải pháp");
          } else {
            toast.error("Đã xảy ra lỗi."); // Thông báo lỗi chung cho trường hợp khác
          }
        } else {
          toast.error("Đã xảy ra lỗi."); // Thông báo lỗi chung cho trường hợp khác
        }
      });
  };

  const loginButton = {
    width: "100%",
  };

  const pDiv = {
    textAlign: "center",
    fontSize: "17px",
  };

  return (
    <div>
   
      <Tabs>
        <TabPane>
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
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
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Mật khẩu"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loginButton
                style={loginButton}
                // onClick={onLogin}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
          <p style={pDiv}>
            Chưa có tài khoản?{" "}
            <Link to="/register" href="/">
              Đăng ký
            </Link>{" "}
          </p>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default LoginForm;
