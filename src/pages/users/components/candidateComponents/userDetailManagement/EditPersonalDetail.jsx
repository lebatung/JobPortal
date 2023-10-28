import React, { useState, useEffect } from "react";
import moment from "moment";
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.module.css';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Modal,
  Image,
  Descriptions,
  DatePicker,
  Space,
} from "antd";

import {
  request,
  loadCategories,
  loadLocations,
  loadPersonalDetailById,
} from "../../../../../helpers/axios_helper";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import FileUploader from "../../../../../helpers/FileUploader";
const { Option } = Select;

export default function EditPersonalDetail(props) {
  const selectedPersonalDetailId = props.selectedPersonalDetailId;

  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [personalDetail, setPersonalDetail] = useState({
    avatar: "",
    name: "",
    email: "",
    dayOfBirth: "1999-01-01",
    gender: "",
    location: "",
    category: "",
    address: "",
    phoneNumber: "",
    taxCode: "",
    linkWebsite: "",
  });

  const {
    avatar,
    name,
    email,
    dayOfBirth,
    gender,
    locationId,
    categoryId,
    address,
    phoneNumber,
  } = personalDetail;

  const onInputChange = (e) => {
    setPersonalDetail({ ...personalDetail, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => {
    console.log(personalDetail.id);
    setIsEditModalVisible(true);
  };

  const handleDateChange = (date) => {
    setSelectedDay(date);
    console.log("selectedDay: ", selectedDay);
  };

  useEffect(() => {
    loadCategories()
      .then((data) => {
        // console.log("Data from API:", data);
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

    loadPersonalDetailById(selectedPersonalDetailId)
      .then((data) => {
        setPersonalDetail(data);
        // if (personalDetail.dayOfBirth) {
        //   setSelectedDay(moment(personalDetail.dayOfBirth));
        // }
        // console.log(data.dayOfBirth);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });
  }, [selectedPersonalDetailId]);

  const [selectedDay, setSelectedDay] = useState( personalDetail.dayOfBirth ? moment(personalDetail.dayOfBirth) : null );
  const onFinish = () => {
    form
      .validateFields()
      .then(() => {
        const formattedDayOfBirth = selectedDay ? selectedDay.format("YYYY-MM-DD") : null;
        const formData = {
          avatar,
          name,
          email,
          dayOfBirth: formattedDayOfBirth,
          gender,
          locationId: personalDetail.location.id,
          categoryId: personalDetail.category.id,
          address,
          phoneNumber,
        };
        console.log("formData", formData);
        request(
          "PUT",
          `/api/personal-details/update/${personalDetail.id}`,
          formData
        )
          .then((response) => {
            toast.success("Cập nhật thành công");
            console.log("response:", response.data);
            setIsEditModalVisible(false);
            console.log("Thông tin chỉnh sửa:", formData);
          })
          .catch((error) => {
            console.error("Cập nhật thất bại:", error);
            toast.error("Cập nhật thất bại");
            console.log("Thông tin chỉnh sửa:", formData);
            setIsEditModalVisible(false);
          });
      })
      .catch((error) => {
        console.error("Lỗi kiểm tra dữ liệu form:", error);
        toast.error("Xin hãy điền tất cả các trường dữ liệu");
        setIsEditModalVisible(false);
      });
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
              <Descriptions.Item label="Tên ứng viên">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Họ và tên"
                      rules={[
                        { required: true, message: "Vui lòng nhập họ và tên" },
                      ]}
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
              <Descriptions.Item label="Day of birth">
                <div style={{ alignItems: "center" }}>
                  <Form.Item
                    label="Ngày sinh"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày sinh",
                      },
                    ]}
                  >
                    <DatePicker
                      value={selectedDay}
                      onChange={(values) => {
                        setSelectedDay(values);
                      }}
                      placeholder=""
                    />
                  </Form.Item>
                </div>
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
              <Descriptions.Item label="Số điện thoại liên hệ">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Số điện thoại liên hệ"
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

              <Descriptions.Item label="Nhóm ngành, nghề">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Nhóm ngành, nghề:"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn ngành nghề!",
                        },
                      ]}
                    >
                      <Select
                        value={personalDetail.category.name}
                        onChange={(value) => {
                          const selectedCategory = categories.find(
                            (category) => category.name === value
                          );
                          if (selectedCategory) {
                            setPersonalDetail({
                              ...personalDetail,
                              category: selectedCategory,
                            });
                          }
                        }}
                        placeholder=""
                      >
                        {categories.map((category) => (
                          <Option key={category.id} value={category.name}>
                            {category.name}
                          </Option>
                        ))}
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
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn địa điểm!",
                        },
                      ]}
                    >
                      <Select
                        value={personalDetail.location.name}
                        onChange={(value) => {
                          const selectedLocation = locations.find(
                            (location) => location.name === value
                          );
                          if (selectedLocation) {
                            setPersonalDetail({
                              ...personalDetail,
                              location: selectedLocation,
                            });
                          }
                        }}
                        placeholder=""
                      >
                        {locations.map((location) => (
                          <Option key={location.id} value={location.name}>
                            {location.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 16 }}>
              <Button
                className="ant-btn-primary"
                onClick={() => handleEditClick()}
                style={{ narginRight: 16 }}
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
        Are you sure you want to {"Edit"} this user's account details?
      </Modal>
    </>
  );
}
