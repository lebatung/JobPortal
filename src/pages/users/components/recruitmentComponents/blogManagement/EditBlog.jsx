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
} from "antd";

import {
  request,
  loadUserByUsername,
  loadPersonalDetailByUsername,
  loadBlogById,
  loadLocations,
  loadCategories,
} from "../../../../../helpers/axios_helper";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "../../../../../contexts/AuthContext";

const { Option } = Select;

const EditBlog = (props) => {
  const selectedBlogId = props.selectedBlogId;
  const { username } = useAuth();

  const [locations, setLocations] = useState([]);
  const [categories, setCatgories] = useState([]);
  const [form] = Form.useForm();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

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
  });

  const [blog, setBlog] = useState({
    title: "",
    detail: "",
    deadLine: "2023-12-31",
    salaryMin: "",
    salaryMax: "",
    workingTime: "",
    education:"",
    quantity: "",
    position: "",
    exp: "",
    gender: "",
    image: "image.png",
    location: "",
    category: "",
  });

  const {
    title,
    detail,
    deadLine,
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
  } = blog;

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const onInputChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => {
    setIsEditModalVisible(true);
  };

  function formatDateString(originalDate) {
    const parts = originalDate.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

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
        console.log(data);
      })
      .catch((error) => {
        console.error("Error loading users:", error);
      });

    loadBlogById(selectedBlogId)
      .then((data) => {
        setBlog(data);
      })
      .catch((error) => {
        console.error("Error loading users:", error);
      });
      loadLocations(selectedBlogId)
      .then((data) => {
        setLocations(data);
      })
      .catch((error) => {
        console.error("Error loading users:", error);
      });
      loadCategories(selectedBlogId)
      .then((data) => {
        setCatgories(data);
      })
      .catch((error) => {
        console.error("Error loading users:", error);
      });
  }, [selectedBlogId, username]);

  const [selectedDay, setSelectedDay] = useState( blog.deadLine ? moment(blog.deadLine) : null );

  const onFinish = () => {
    form
      .validateFields()
      .then(() => {
        
        const formattedDeadLine = selectedDay ? selectedDay.format("YYYY-MM-DD") : null;
        const formData = {
          title,
          detail,
          deadLine: formattedDeadLine,
          salaryMin,
          salaryMax,
          workingTime,
          education,
          quantity,
          position,
          exp,
          gender,
          locationId: blog.location.id,
          categoryId: blog.category.id,
          userId: user.id,
        };

        request(
          "PUT",
          `/api/blogs/update/${blog.id}`,
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
      <Card>
        <div>
          <Form name="EditBlog" onFinish={onFinish} layout="vertical">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Tiêu đề">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Tiêu đề"
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
                    label="Thời hạn ứng tuyển"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn Thời hạn ứng tuyển",
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
              <Descriptions.Item label="Education">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Yêu cầu chuyên môn"
                      
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng yêu cầu chuyên môn",
                        },
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
              <Descriptions.Item label="Location">
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
                        value={blog.location.name} 
                        onChange={(value) => {
                          const selectedLocation = locations.find(
                            (location) => location.name === value
                          );
                          if (selectedLocation) {
                            setBlog({
                              ...blog,
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
              <Descriptions.Item label="Category">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Nhóm ngành, nghề"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn nhóm ngành, nghề!",
                        },
                      ]}
                    >
                      <Select
                        value={blog.category.name} 
                        onChange={(value) => {
                          const selectedCategory = categories.find(
                            (category) => category.name === value
                          );
                          if (selectedCategory) {
                            setBlog({
                              ...blog,
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
              <Descriptions.Item label="Working times">
                {
                  <div
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      label="Thời gian làm việc"
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
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập kinh nghiệm làm việc",
                        },
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
            <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
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
        Are you sure you want to {"Edit"} this blog?
      </Modal>
    </>
  );
};

export default EditBlog;
