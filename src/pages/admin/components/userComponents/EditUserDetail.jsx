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
  Image,
  Descriptions,
  Tag,
} from "antd";

import {
  request,
  loadPersonalDetailById,
  loadPersonalDetail,
  loadCategories,
  loadLocations,
  updateUserDetail,
} from "../../../../helpers/axios_helper";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import FileUploader from "./FileUploader.jsx";

const { Option } = Select;

const EditUserDetail = (props) => {
  const selectedUserId = props.selectedUserId;
  const selectedPersonalDetailId = props.selectedPersonalDetailId;
  // console.log(props);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [personalDetail, setPersonalDetail] = useState({
    avatar: "",
    name: "",
    email: "",
    gender: "",
    location: "",
    category: "",
    address: "",
    dayOfBirth: "1999-01-01",
    phoneNumber: "",
    taxCode: "",
    linkWebsite: "",
  });

  const {
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

  const handleEditClick = () => {
    console.log(personalDetail.id);
    setIsEditModalVisible(true);
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

  }, [selectedUserId, isEditModalVisible]);

  useEffect(()=> {
    loadPersonalDetailById(selectedPersonalDetailId)
    .then((data) => {
      setPersonalDetail(data);
    })
    .catch((error) => {
      console.error("Error loading categories:", error);
    });
  }, [selectedPersonalDetailId])

  const [selectedDay, setSelectedDay] = useState(
    personalDetail.dayOfBirth ? moment(personalDetail.dayOfBirth) : null
  );

  const onFinish = () => {
    form
      .validateFields()
      .then(() => {
        const formattedDayOfBirth = selectedDay
          ? selectedDay.format("YYYY-MM-DD")
          : null;

        const formData = {
          avatar,
          name,
          email,
          gender,
          locationId: personalDetail.location.id,
          categoryId: personalDetail.category.id,
          address,
          dayOfBirth: formattedDayOfBirth,
          phoneNumber,
          taxCode,
          linkWebsite,
        };

        request(
          "PUT",
          `/api/personal-details/update/${personalDetail.id}`,
          formData
        )
          .then((response) => {
            toast.success("Cập nhật thành công");
            console.log("response:", response.data);
            setIsEditModalVisible(false);
          })
          .catch((error) => {
            console.error("Cập nhật thất bại:", error);
            toast.error("Cập nhật thất bại");
            setIsEditModalVisible(false);
          });

        console.log("Thông tin chỉnh sửa:", formData);
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
              <Descriptions.Item label="Họ và tên">
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
            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                className="ant-btn-primary"
                onClick={() => handleEditClick()}
              >
                Lưu
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
};

export default EditUserDetail;
