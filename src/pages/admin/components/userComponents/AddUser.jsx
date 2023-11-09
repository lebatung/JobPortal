import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  DatePicker,
  Modal,
  Descriptions,
  Image,
} from "antd";

import {
  request,
  loadPersonalDetailById,
  loadCategories,
  loadLocations,
} from "../../../../helpers/axios_helper";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import FileUploader from "./FileUploader.jsx";

const { Option } = Select;

export default function AddUser() {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isCreateVisible, setIsCreateModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [personalDetail, setPersonalDetail] = useState({
    username: "",
    password: "",
    roleId: "",
    avatar: "none.jpg",
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
  });

  const {
    username,
    password,
    roleId,
    avatar,
    name,
    email,
    gender,
    locationId,
    categoryId,
    address,
    dayOfBirth,
    phoneNumber,
    taxCode,
    linkWebsite,
  } = personalDetail;

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const onInputChange = (e) => {
    setPersonalDetail({ ...personalDetail, [e.target.name]: e.target.value });
  };

  const handleEditClick = (id) => {
    setSelectedUserId(id);
    setIsCreateModalVisible(true);
  };

  const { id } = useParams();

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

    loadPersonalDetailById(id)
      .then((data) => {
        setPersonalDetail(data);
      })
      .catch((error) => {
        console.error("Error loading locations:", error);
      });
  }, [id]);

  const [selectedDay, setSelectedDay] = useState( personalDetail.dayOfBirth ? moment(personalDetail.dayOfBirth) : null );

  const onFinish = () => {
    
    const formattedDayOfBirth = selectedDay ? selectedDay.format("YYYY-MM-DD") : null;

    const formData = {
      username,
      email,
      password,
      avatar,
      name,
      roleId,
      gender,
      locationId,
      categoryId,
      address,
      dayOfBirth: formattedDayOfBirth,
      phoneNumber,
      taxCode,
      linkWebsite,
    };

    request("POST", `/api/users/create`, formData)
      .then((response) => {
        toast.success("Thêm người dùng thành công");
        console.log("response:", response.data);
        setIsCreateModalVisible(false); 
      })
      .catch((error) => {
        console.error("Thêm người dùng thất bại:", error);
        toast.error("Thêm người dùng thất bại");
        setIsCreateModalVisible(false);
      });

    console.log("Thông tin đăng ký:", formData);
  };
  return (
    <>
      <ToastContainer />
      <hr />
      <Card title="Edit User Profile">
        <div>
          <Form name="EditUserDetail" onFinish={onFinish} layout="vertical">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Ảnh đại diện">
                {
                  <>
                    <Form.Item label="Chọn ảnh làm avatar">
                      <FileUploader
                        name="avatar"
                        onUploadSuccess={(value) =>
                          setPersonalDetail({
                            ...personalDetail,
                            avatar: value,
                          })
                        }
                      />
                    </Form.Item>
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
                  </>
                }
              </Descriptions.Item>

              <Descriptions.Item label="Tên người dùng">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Tên người dùng"
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên người dùng!",
                        },
                      ]}
                    >
                      <Input
                        value={username}
                        name="username"
                        onChange={(e) => onInputChange(e)}
                      />
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
              <Descriptions.Item 
              label="Mật khẩu"
              name="password"
              >

                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Mật khẩu"
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
                        value={password}
                        name="password"
                        onChange={(e) => onInputChange(e)}
                      />
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Vai trò">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item 
                    label="Vai trò"
                    name="roleId"
                    rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn vai trò!",
                        },
                      ]}
                    >
                      <Select
                        value={roleId}
                        onChange={(value) =>
                          setPersonalDetail({
                            ...personalDetail,
                            roleId: value,
                          })
                        }
                      >
                        <Option value={13}>Candidate</Option>
                        <Option value={12}>Recruitment</Option>
                      </Select>
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Họ và tên">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Họ và tên"
                      name="name"
                      rules={[
                        { required: true, message: "Vui lòng nhập họ và tên" },
                      ]}
                      validateTrigger="onBlur"
                    >
                      <Input
                        value={name}
                        name="name"
                        onChange={(e) => onInputChange(e)}
                      />
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item label="Email">
                      <Input
                        value={email}
                        name="email"
                        onChange={(e) => onInputChange(e)}
                      />
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item label="Giới tính">
                      <Select
                        value={gender}
                        onChange={(value) =>
                          setPersonalDetail({
                            ...personalDetail,
                            gender: value,
                          })
                        }
                      >
                        <Option value={0}>Nam</Option>
                        <Option value={1}>Nữ</Option>
                      </Select>
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Địa điểm">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Địa điểm"
                      name="location"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn địa điểm!",
                        },
                      ]}
                    >
                      <Select
                        value={locationId}
                        onChange={(value) =>
                          setPersonalDetail({
                            ...personalDetail,
                            locationId: value,
                          })
                        }
                        placeholder="Chọn địa điểm"
                      >
                        {locations.map((locations) => (
                          <Option key={locations.id} value={locations.id}>
                            {locations.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Nhóm ngành, nghề">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Nhóm ngành, nghề:"
                      name="category"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn ngành nghề!",
                        },
                      ]}
                    >
                      <Select
                        value={categoryId}
                        onChange={(value) =>
                          setPersonalDetail({
                            ...personalDetail,
                            categoryId: value,
                          })
                        }
                        placeholder="Chọn ngành nghề"
                      >
                        {categories.map((categories) => (
                          <Option key={categories.id} value={categories.id}>
                            {categories.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Địa chỉ:"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập địa chỉ",
                        },
                      ]}
                    >
                      <Input
                        value={address}
                        name="address"
                        onChange={(e) => onInputChange(e)}
                      />
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item label="Ngày sinh">
                      <DatePicker
                        value={selectedDay}
                        onChange={(values) => {
                          setSelectedDay(values);
                        }}
                        placeholder="Ngày sinh"
                      />
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Số điện thoại"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại",
                        },
                        {
                          validator: async (_, value) => {
                            if (!value) {
                              return Promise.reject(
                                "Vui lòng nhập số điện thoại"
                              );
                            }
                            if (!/^\d{10}$/.test(value)) {
                              return Promise.reject(
                                "Số điện thoại không hợp lệ"
                              );
                            }
                          },
                        },
                      ]}
                    >
                      <Input
                        value={phoneNumber}
                        name="phoneNumber"
                        onChange={(e) => onInputChange(e)}
                      />
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Mã số thuế">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item label="Mã số thuế">
                      <Input
                        value={taxCode}
                        name="taxCode"
                        onChange={(e) => onInputChange(e)}
                      />
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Website">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item label="Link Website">
                      <Input
                        value={linkWebsite}
                        name="linkWebsite"
                        onChange={(e) => onInputChange(e)}
                      />
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
            </Descriptions>
            <div style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "flex-end",
              }}>
              <Button
                className="ant-btn-primary"
                onClick={() => handleEditClick(id)}
              >
                {" "}
                Xác nhận{" "}
              </Button>
            </div>
          </Form>
        </div>
      </Card>
      <Modal
        title={"Confirm Creating"}
        visible={isCreateVisible}
        onOk={onFinish}
        onCancel={() => setIsCreateModalVisible(false)}
      >
        Are you sure you want to {"Create"} this user's account?
      </Modal>
    </>
  );
}
