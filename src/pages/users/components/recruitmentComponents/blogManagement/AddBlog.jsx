import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../../../../../contexts/AuthContext";

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
  loadPersonalDetailByUsername,
  loadUserByUsername,
} from "../../../../../helpers/axios_helper";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import FileUploader from "../../../../../helpers/FileUploader.jsx";

const { Option } = Select;

export default function AddBlog() {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isCreateVisible, setIsCreateModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { username } = useAuth();

  const [user, setUser] = useState({
    id: "",
    personalDetailId: "",
  });
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
  const [blog, setBlog] = useState({
    image: "image.png",
    title: "",
    detail: "",
    deadLine: "",
    salaryMin: "",
    salaryMax: "",
    workingTime: "",
    education:"",
    quantity: "",
    position: "",
    exp: "",
    gender: "",
    locationId: "",
    categoryId: "",
    userId: "",
    enable: "",
  });

  const {
    image,
    title,
    deadLine,
    detail,
    salaryMin,
    salaryMax,
    workingTime,
    education,
    quantity,
    position,
    exp,
    gender,
    locationId,
    categoryId,
    userId,
    enable,
  } = blog;

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const onInputChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleEditClick = (id) => {
    setSelectedUserId(id);
    setIsCreateModalVisible(true);
  };

  const { id } = useParams();

  useEffect(() => {
    loadUserByUsername(username)
      .then((data) => {
        setUser(data);
        //console.log(data);  
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });

    loadPersonalDetailByUsername(username)
      .then((data) => {
        setPersonalDetail(data);
        //console.log(data);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });
  }, [id, username]);

  const onFinish = () => {
    const formattedDay =
      deadLine !== null ? deadLine.format("YYYY-MM-DD") : null;

    const formData = {
      image,
      title,
      deadLine: formattedDay,
      detail,
      salaryMin,
      salaryMax,
      workingTime,
      education,
      quantity,
      position,
      exp,
      gender,
      locationId: personalDetail.location.id,
      categoryId: personalDetail.category.id,
      userId: user.id,
      enable: 2, // 0: Active, 1: Inactive, 2: Pending, 3: Rejected
    };

    request("POST", `/api/blogs/create`, formData)
      .then((response) => {
        toast.success("Thêm tin tuyển dụng thành công.");
        console.log("response:", response.data);
        setIsCreateModalVisible(false);
      })
      .catch((error) => {
        console.error("Thêm tin tuyển dụng thất bại:", error);
        toast.error("Thêm tin tuyển dụng thất bại");
        setIsCreateModalVisible(false);
      });

    console.log("Thông tin tin tuyển dụng:", formData);
  };
  return (
    <>
      <ToastContainer />
      <hr />
      <Card title="Edit User Profile">
        <div>
          <Form name="EditUserDetail" onFinish={onFinish} layout="vertical">
            <Descriptions bordered column={1} size="small">
              {/* <Descriptions.Item label="Hình ảnh">
                {
                  <>
                    <Form.Item label="Chọn ảnh cho bài viết">
                      <FileUploader
                        name="image"
                        onUploadSuccess={(value) =>
                          setBlog({
                            ...blog,
                            image: value,
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
                        src={`http://localhost:8080/api/files/${blog.image}`}
                        alt="image blog"
                      />
                    </div>
                  </>
                }
              </Descriptions.Item> */}

              <Descriptions.Item label="Tiêu đề">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Tiêu đề"
                      name="title"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tiêu đề bài đăng!",
                        },
                      ]}
                    >
                      <Input
                        value={title}
                        name="title"
                        onChange={(e) => onInputChange(e)}
                      />
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả công việc">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Mô tả ngắn gọn về nội dung công việc"
                      name="detail"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mô tả công việc!",
                        },
                      ]}
                    >
                      <Input.TextArea
                        value={detail}
                        name="detail"
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        onChange={(e) => onInputChange(e)}
                      />
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Deadline">
                <div style={{ alignItems: "center" }}>
                  <Form.Item
                    label="Thời hạn ứng tuyển(YYYY/MM/DD)"
                    name="deadLine"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn Thời hạn ứng tuyển",
                      },
                    ]}
                  >
                    <DatePicker
                      defaultValue={deadLine}
                      onChange={(date) => setBlog({ ...blog, deadLine: date })}
                      placeholder="Nhập deadline..."
                    />
                  </Form.Item>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Education">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Yêu cầu chuyên môn"
                      name="education"
                      rules={[
                        { required: true, message: "Vui lòng yêu cầu chuyên môn" },
                      ]}
                      validateTrigger="onBlur"
                    >
                      <Input
                        value={education}
                        name="education"
                        onChange={(e) => onInputChange(e)}
                      />
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>          
              <Descriptions.Item label="Working times">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Thời gian làm việc"
                      name="workingTime"
                      rules={[
                        { required: true, message: "Vui lòng nhập họ và tên" },
                      ]}
                      validateTrigger="onBlur"
                    >
                      <Input
                        value={workingTime}
                        name="workingTime"
                        onChange={(e) => onInputChange(e)}
                      />
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Quantity">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Số lượng"
                      name="quantity"
                      rules={[
                        { required: true, message: "Vui lòng nhập số lượng" },
                      ]}
                    >
                      <Input
                        value={quantity}
                        name="quantity"
                        onChange={(e) => onInputChange(e)}
                      />
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Giới tính"
                      name="gender"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập gới tính!",
                        },
                      ]}
                    >
                      <Input
                        value={gender}
                        name="gender"
                        onChange={(e) => onInputChange(e)}
                      />
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Exp">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Kinh nghiệm làm việc"
                      name="exp"
                      rules={[
                        { required: true, message: "Vui lòng nhập kinh nghiệm làm việc" },
                      ]}
                    >
                      <Input
                        value={exp}
                        name="exp"
                        onChange={(e) => onInputChange(e)}
                      />
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Position">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Vị trí, chức vụ"
                      name="position"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập vị trí công việc",
                        },
                      ]}
                    >
                      <Input
                        value={position}
                        name="position"
                        onChange={(e) => onInputChange(e)}
                      />
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>

              <Descriptions.Item label="Salary">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Mức lương từ(triệu đồng)"
                      name="salaryMin"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập Mức lương",
                        },
                      ]}
                    >
                      <Input
                        value={salaryMin}
                        name="salaryMin"
                        onChange={(e) => onInputChange(e)}
                      />
                    </Form.Item>
                    <Form.Item
                      label="đến(triệu đồng)"
                      name="salaryMax"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập Mức lương",
                        },
                      ]}
                    >
                      <Input
                        value={salaryMax}
                        name="salaryMax"
                        onChange={(e) => onInputChange(e)}
                      />
                    </Form.Item>
                  </div>
                }
              </Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 16 }}>
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
        Are you sure you want to {"Create"} this blog?
      </Modal>
    </>
  );
}
