import React, { useState, useEffect } from "react";
import AvatarEdit from "react-avatar-edit";
import html2pdf from "html2pdf.js";
import {
  Input,
  DatePicker,
  Button,
  Space,
  Select,
  Row,
  Col,
  Card,
  message,
  Tabs,
  Typography,
  Modal,
  Image,
  Divider,
  Tooltip,
  Form,
  Descriptions,
} from "antd";
import ReactQuill from "react-quill";

const { Item } = Form;
const { Option } = Select;
const { TabPane } = Tabs;
const { Text, Paragraph, Title } = Typography;

const Template1 = () => {
  const [leftData, setLeftData] = useState({
    fullName: "",
    position: "",
    dob: "",
    avatar: null,
    gender: "",
    phoneNumber: "",
    additionalInfo: "",
  });
  const [educationList, setEducationList] = useState([
    {
      educationName: "",
      educationPeriod: "",
      major: "",
      gpa: "",
    },
  ]);
  const addEducation = () => {
    setEducationList([
      ...educationList,
      { educationName: "", educationPeriod: "", major: "", gpa: "" },
    ]);
  };
  const handleEducationChange = (e, index, field) => {
    const updatedEducationList = [...educationList];
    updatedEducationList[index][field] = e.target.value;
    setEducationList(updatedEducationList);
  };
  const removeEducation = (index) => {
    const updatedEducationList = [...educationList];
    updatedEducationList.splice(index, 1);
    setEducationList(updatedEducationList);
  };

  const [sideList, setSideList] = useState([
    {
      sideTitle: "",
      jobsDesc: "",
    },
  ]);
  const addSide = () => {
    setSideList([...sideList, { sideTitle: "", sideDecs: "" }]);
  };
  const handleSideChange = (e, index, field) => {
    const updatedSideList = [...sideList];
    updatedSideList[index][field] = e.target.value;
    setSideList(updatedSideList);
  };
  const removeSide = (index) => {
    const updatedSideList = [...sideList];
    updatedSideList.splice(index, 1);
    setSideList(updatedSideList);
  };

  const [jobsExpList, setJobsExpList] = useState([
    {
      jobsName: "",
      jobsPeriod: "",
      jobsPosition: "",
      jobsDesc: "",
    },
  ]);
  const addJobsExp = () => {
    setJobsExpList([
      ...jobsExpList,
      { jobsName: "", jobsPeriod: "", jobsPosition: "", jobsDesc: "" },
    ]);
  };
  const handleJobsExpChange = (e, index, field) => {
    const updatedJobsExpList = [...jobsExpList];
    updatedJobsExpList[index][field] = e.target.value;
    setJobsExpList(updatedJobsExpList);
  };
  const removeJobsExp = (index) => {
    const updatedJobsExpList = [...jobsExpList];
    updatedJobsExpList.splice(index, 1);
    setJobsExpList(updatedJobsExpList);
  };

  // const handleGeneratePDF = () => {
  //   const pdf = new jsPDF();
  //   pdf.text(`Full Name: ${leftData.fullName}`, 10, 10);
  //   pdf.text(`Date of Birth: ${leftData.dob?.toString()}`, 10, 20);

  //   // Add profile photo if available
  //   if (image) {
  //     const imgData = image.replace(/^data:image\/(png|jpg);base64,/, "");
  //     pdf.addImage(imgData, "JPEG", 10, 30, 50, 50);
  //   }

  //   // Additional personal information
  //   pdf.text(`Email: ${leftData.email}`, 10, 90);
  //   pdf.text(`Gender: ${leftData.gender}`, 10, 100);
  //   pdf.text(`Phone Number: ${leftData.phoneNumber}`, 10, 110);
  //   pdf.text(`Address: ${leftData.address}`, 10, 120);

  //   // Educational background
  //   pdf.text("Educational Background", 10, 140);
  //   let educationYPosition = 150;
  //   educationList.forEach((education) => {
  //     pdf.text(`- ${education.educationName} (${education.educationPeriod})`, 10, educationYPosition);
  //     pdf.text(`  Major: ${education.major}`, 15, educationYPosition + 10);
  //     pdf.text(`  GPA: ${education.gpa}`, 15, educationYPosition + 20);
  //     educationYPosition += 30;
  //   });

  //   // Work experience
  //   pdf.text("Work Experience", 10, educationYPosition);
  //   let workExpYPosition = educationYPosition + 10;
  //   jobsExpList.forEach((job) => {
  //     pdf.text(`- ${job.jobsName} (${job.jobsPeriod})`, 10, workExpYPosition);
  //     pdf.text(`  Position: ${job.jobsPosition}`, 15, workExpYPosition + 10);
  //     pdf.text(`  Description: ${job.jobsDesc}`, 15, workExpYPosition + 20);
  //     workExpYPosition += 40;
  //   });

  //   // Additional skills, certifications, etc.
  //   pdf.text("Skills, Certifications, etc.", 10, workExpYPosition);
  //   let skillsYPosition = workExpYPosition + 10;
  //   sideList.forEach((side) => {
  //     pdf.text(`- ${side.sideTitle}`, 10, skillsYPosition);
  //     pdf.text(`  Description: ${side.sideDesc}`, 15, skillsYPosition + 10);
  //     skillsYPosition += 30;
  //   });

  //   pdf.save("cv_template.pdf");
  // };

  const handleGeneratePDF = () => {
    const element = document.getElementById("pdf-content"); // Thay 'pdf-content' bằng id thích hợp của container chứa nội dung cần chuyển đổi// Thay 'yourHtmlElementId' bằng id của phần tử HTML bạn muốn chuyển đổi

    const options = {
      margin: 10,
      filename: "resume.pdf",
      image: { type: "pdf", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    if (element) {
      html2pdf(element, options);
    } else {
      console.error("Element not found");
    }
  };

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const onCrop = (preview) => {
    setImage(preview);
  };
  const saveImage = () => {
    setOpen(false);
  };
  const onClose = () => {
    setOpen(false);
    setImage(null);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  useEffect(() => {
    // Update the rightData when leftData changes
    setLeftData({
      ...leftData,
      gender: leftData.gender,
      startDate: leftData.startDate,
      endDate: leftData.endDate,
      additionalInfo: leftData.additionalInfo,
    });
  }, [leftData]);

  const personalTitle = {
    fontWeight: "bold",
    marginRight: "6px",
  };

  function formatDateString(originalDate) {
    const parts = originalDate.split("-");
    return parts[2]
      ? `${parts[2]}/${parts[1]}/${parts[0]}`
      : `${parts[1]}/${parts[0]}`;
  }

  
  return (
    <div style={{ display: "flex", padding: "20px" }}>
      <Tabs tabPosition="left" style={{ marginRight: "20px", flex: 1,  width: "300px"}}>
        <TabPane tab="Thông tin cá nhân" key="1">
          <Space direction="vertical">
            <Input
              placeholder="Full Name"
              value={leftData.fullName}
              onChange={(e) =>
                setLeftData({ ...leftData, fullName: e.target.value })
              }
            />

            <Input
              placeholder="Vị trí công việc"
              value={leftData.position}
              onChange={(e) =>
                setLeftData({ ...leftData, position: e.target.value })
              }
            />
            <DatePicker
              placeholder="Date of Birth"
              style={{ width: "100%" }}
              onChange={(date, dateString) =>
                setLeftData({ ...leftData, dob: dateString })
              }
            />

            <div>
              <Button
                variant="outlined"
                onClick={handleClickOpen}
                style={{ width: "100%" }}
              >
                Change Profile Photo
              </Button>
              <Modal
                open={open}
                maskClosable={true}
                onCancel={handleClose}
                footer={null}
              >
                <div>
                  <h2 id="customized-dialog-title">Update Image</h2>
                  <AvatarEdit
                    value={leftData.avatar}
                    exportAsSquare
                    width={400}
                    height={400}
                    onCrop={onCrop}
                    onClose={onClose}
                    label="Adjust the avatar"
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "20px",
                    }}
                  >
                    <Button
                      type="primary"
                      autoFocus
                      variant="contained"
                      onClick={saveImage}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </Modal>
            </div>

            <Select
              placeholder="Giới tính"
              style={{ width: "100%" }}
              value={leftData.gender}
              onChange={(value) => setLeftData({ ...leftData, gender: value })}
            >
              <Option value="Nam">Nam</Option>
              <Option value="nữ">Nữ</Option>
            </Select>
            <Input
              placeholder="Email"
              value={leftData.email}
              onChange={(e) =>
                setLeftData({ ...leftData, email: e.target.value })
              }
            />
            <Input
              placeholder="Số điện thoại"
              value={leftData.phoneNumber}
              onChange={(e) =>
                setLeftData({ ...leftData, phoneNumber: e.target.value })
              }
            />
            <Input
              placeholder="Address"
              value={leftData.address}
              onChange={(e) =>
                setLeftData({ ...leftData, address: e.target.value })
              }
            />
            <ReactQuill
              defaultValue={leftData.additionalInfo}
              onChange={(e) => setLeftData({ ...leftData, additionalInfo: e })}
              style={{ height: "200px", width: "100%" }}
            />
          </Space>
        </TabPane>
        <TabPane tab="Học vấn" key="2">
         
            {educationList.map((education, index) => (
              <Space
                key={index}
                direction="vertical"
                style={{ marginBottom: "20px" }}
              >
                <Input
                  placeholder="Education"
                  value={education.educationName}
                  onChange={(e) =>
                    handleEducationChange(e, index, "educationName")
                  }
                />
                <Input
                  placeholder="nhập thời gian"
                  value={education.educationPeriod}
                  onChange={(e) =>
                    handleEducationChange(e, index, "educationPeriod")
                  }
                />
                <Input
                  placeholder="Chuyên ngành"
                  value={education.major}
                  onChange={(e) => handleEducationChange(e, index, "major")}
                />
                <Input
                  placeholder="Điểm trung bình"
                  value={education.gpa}
                  onChange={(e) => handleEducationChange(e, index, "gpa")}
                />
                <Button type="link" onClick={() => removeEducation(index)}>
                  Xóa
                </Button>
              </Space>
            ))}
            <div>
              <Button
                style={{ width: "100%" }}
                type="primary"
                onClick={addEducation}
              >
                + Thêm mới
              </Button>
            </div>
     
        </TabPane>
        

        <TabPane tab="Kinh nghiệm làm việc" key="3">
          <Space direction="vertical">
            {jobsExpList.map((jobsExp, index) => (
              <Space
                key={index}
                direction="vertical"
                style={{ marginBottom: "20px" }}
              >
                <Input
                  placeholder="Tên Công ty"
                  value={jobsExp.jobsName}
                  onChange={(e) => handleJobsExpChange(e, index, "jobsName")}
                />
                <Input
                  placeholder="nhập thời gian"
                  value={jobsExp.jobsPeriod}
                  onChange={(e) => handleJobsExpChange(e, index, "jobsPeriod")}
                />
                <Input
                  placeholder="Vị trí công việc"
                  value={jobsExp.jobsPosition}
                  onChange={(e) =>
                    handleJobsExpChange(e, index, "jobsPosition")
                  }
                />
                {/* <Input
                  placeholder="Mô tả"
                  value={jobsExp.jobsDesc}
                  onChange={(e) => handleJobsExpChange(e, index, "jobsDesc")}
                /> */}
                <ReactQuill
                  value={jobsExp.jobsDesc}
                  onChange={(value) =>
                    handleJobsExpChange(
                      { target: { value } },
                      index,
                      "jobsDesc"
                    )
                  }
                  style={{ height: "200px", width: "100%" }}
                />
                <div style={{ marginTop: "70px" }}>
                  <Button type="danger" onClick={() => removeJobsExp(index)}>
                    Xóa
                  </Button>
                </div>
              </Space>
            ))}
            <div>
              <Button
                style={{ width: "100%" }}
                type="primary"
                onClick={addJobsExp}
              >
                + Thêm mới
              </Button>
            </div>
          </Space>
        </TabPane>
        <TabPane tab="Kỹ năng, bằng cấp, chứng chỉ" key="4">
          <Space direction="vertical">
            {sideList.map((side, index) => (
              <Space
                key={index}
                direction="vertical"
                style={{ marginBottom: "20px" }}
              >
                <Input
                  placeholder="Tên Kỹ năng, bằng cấp, chứng chỉ"
                  value={side.sideTitle}
                  onChange={(e) => handleSideChange(e, index, "sideTitle")}
                />
                {/* <Input
                  placeholder="Mô tả"
                  value={jobsExp.jobsDesc}
                  onChange={(e) => handleJobsExpChange(e, index, "jobsDesc")}
                /> */}
                <ReactQuill
                  value={side.sideDesc}
                  onChange={(value) =>
                    handleSideChange({ target: { value } }, index, "sideDesc")
                  }
                  style={{ height: "200px", width: "100%" }}
                />
                <div style={{ marginTop: "70px" }}>
                  <Button type="danger" onClick={() => removeSide(index)}>
                    Xóa
                  </Button>
                </div>
              </Space>
            ))}
            <div>
              <Button
                style={{ width: "100%" }}
                type="primary"
                onClick={addSide}
              >
                + Thêm mới
              </Button>
            </div>
          </Space>
        </TabPane>
        <TabPane tab="Tải về" key="5">
        <div>
          <Button type="primary" block onClick={handleGeneratePDF}>
            Tải về
          </Button>
        </div>
      </TabPane>
        
        {/* Add more tabs as needed */}
      </Tabs>

      <div id="pdf-content" style={{ width: "700px", flex: 2 }}>
        <Card >
          <Row gutter={8}>
            <Col span={8}>
              <Image
                preview={false}
                src={
                  image || "https://img.icons8.com/color/344/test-account.png"
                }
                alt="Avatar Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                }}
                width={165}
                height={165}
              />
            </Col>
            <Col span={16}>
              <Row gutter={16}>
                <Col
                  span={24}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Paragraph
                    style={{
                      fontSize: "34px",
                      color: "#0803bf",
                      textTransform: "uppercase",
                      marginBottom: "-5px",
                    }}
                  >
                    {leftData.fullName}
                  </Paragraph>
                </Col>
                <Col
                  span={24}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Paragraph
                    style={{
                      fontSize: "22px",
                    }}
                  >
                    {leftData.position}
                  </Paragraph>
                </Col>
                <Col
                  span={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Paragraph>
                    <strong style={personalTitle}>Email:</strong>
                    {leftData.email}
                  </Paragraph>
                </Col>
                <Col
                  span={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Paragraph>
                    <strong style={personalTitle}>Giới tính:</strong>
                    {leftData.gender}
                  </Paragraph>
                </Col>
                <Col
                  span={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Paragraph>
                    <strong style={personalTitle}>Ngày sinh:</strong>
                    {leftData.dob ? formatDateString(leftData.dob) : ""}
                  </Paragraph>
                </Col>
                <Col
                  span={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Paragraph>
                    <strong style={personalTitle}>SĐT:</strong>
                    {leftData.phoneNumber}
                  </Paragraph>
                </Col>
                <Col
                  span={24}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Paragraph>
                    <strong style={personalTitle}>Địa chỉ:</strong>
                    {leftData.address}
                  </Paragraph>
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider
            orientation="left"
            style={{
              color: "#0803bf", // Màu của chữ
              fontWeight: "bold", // Độ đậm của chữ
              borderTop: "2px  #0803bf", // Màu và độ dày của đường kẻ ngang
            }}
          >
            GIỚI THIỆU
          </Divider>
          <Row gutter={8} style={{ margin: "20px", textAlign: "left" }}>
            {leftData.additionalInfo && (
              <div
                dangerouslySetInnerHTML={{ __html: leftData.additionalInfo }}
              />
            )}
          </Row>

          <Divider
            orientation="left"
            style={{
              color: "#0803bf",
              fontWeight: "bold",
              borderTop: "2px  #0803bf",
            }}
          >
            HỌC VẤN
          </Divider>

          <ul>
            {educationList.map((education, index) => (
              <li key={index}>
                <Row
                  gutter={8}
                  style={{ marginTop: "20px", marginLeft: "20px" }}
                >
                  <Col span={24}>
                    <Paragraph style={{ textAlign: "left" }}>
                      <strong style={{ fontWeight: "bold" }}>
                        {education.educationName}{" "}
                        {education.educationPeriod &&
                          `(${education.educationPeriod})`}
                      </strong>
                    </Paragraph>
                  </Col>
                </Row>

                <Row gutter={8} style={{ marginLeft: "20px" }}>
                  <Col span={12}>
                    <Paragraph
                      style={{ textAlign: "left", marginRight: "6px" }}
                    >
                      <strong style={{ fontWeight: "bold" }}>
                        Chuyên ngành:{" "}
                      </strong>
                      {education.major}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph
                      style={{ textAlign: "left", marginRight: "6px" }}
                    >
                      <strong style={{ fontWeight: "bold" }}>
                        Điểm trung bình:{" "}
                      </strong>
                      {education.gpa}
                    </Paragraph>
                  </Col>
                </Row>
              </li>
            ))}
          </ul>
          <Divider
            orientation="left"
            style={{
              color: "#0803bf", // Màu của chữ
              fontWeight: "bold", // Độ đậm của chữ
              borderTop: "2px  #0803bf", // Màu và độ dày của đường kẻ ngang
            }}
          >
            KINH NGHIỆM LÀM VIỆC
          </Divider>
          <ul>
            <Row gutter={8}>
              {jobsExpList.map((jobsExp, index) => (
                <Col span={12} key={index}>
                  <li>
                    <Row style={{ marginTop: "20px", marginLeft: "20px" }}>
                      <Col span={24}>
                        <Paragraph style={{ textAlign: "left" }}>
                          <strong style={{ fontWeight: "bold" }}>
                            {jobsExp.jobsName}{" "}
                            {jobsExp.jobsPeriod && `(${jobsExp.jobsPeriod})`}
                          </strong>
                        </Paragraph>
                      </Col>
                    </Row>

                    <Row style={{ marginLeft: "20px" }}>
                      <Col span={12}>
                        <Paragraph
                          style={{ textAlign: "left", marginRight: "6px" }}
                        >
                          <strong style={{ fontWeight: "bold" }}></strong>
                          {jobsExp.jobsPosition}
                        </Paragraph>
                      </Col>
                    </Row>

                    <Row style={{ textAlign: "left" }}>
                      <Col span={24}>
                        <div
                          dangerouslySetInnerHTML={{ __html: jobsExp.jobsDesc }}
                        />
                      </Col>
                    </Row>
                  </li>
                </Col>
              ))}
            </Row>
          </ul>
          <Divider
            orientation="left"
            style={{
              color: "#0803bf", // Màu của chữ
              fontWeight: "bold", // Độ đậm của chữ
              borderTop: "2px  #0803bf", // Màu và độ dày của đường kẻ ngang
            }}
          >
            KỸ NĂNG, BẰNG CẤP, CHỨNG CHỈ
          </Divider>
          <ul>
            <Row gutter={8}>
              {sideList.map((side, index) => (
                <Col span={12} key={index}>
                  <li>
                    <Row style={{ marginTop: "20px", marginLeft: "20px" }}>
                      <Col span={24}>
                        <Paragraph style={{ textAlign: "left" }}>
                          <strong style={{ fontWeight: "bold" }}>
                            {side.sideTitle}{" "}
                          </strong>
                        </Paragraph>
                      </Col>
                    </Row>

                    <Row style={{ marginLeft: "20px" }}>
                      <Col span={12}>
                        <Paragraph
                          style={{ textAlign: "left", marginRight: "6px" }}
                        >
                          <strong style={{ fontWeight: "bold" }}></strong>
                          {side.sideName}
                        </Paragraph>
                      </Col>
                    </Row>

                    <Row style={{ textAlign: "left" }}>
                      <Col span={24}>
                        <div
                          dangerouslySetInnerHTML={{ __html: side.sideDesc }}
                        />
                      </Col>
                    </Row>
                  </li>
                </Col>
              ))}
            </Row>
          </ul>
        </Card>
        
      </div>
      
    </div>
  );
};
export default Template1;
