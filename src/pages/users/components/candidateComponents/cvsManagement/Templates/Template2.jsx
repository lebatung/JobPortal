import React from 'react';
import { Input, DatePicker, Upload, Button, Space, Select, Row, Col, Card, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';

const { Option } = Select;

const CVTemplate = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Card title="CV Template" style={{ width: '500px' }}>
        <Space direction="vertical" size="middle">
          <Input placeholder="Full Name" />
          <DatePicker placeholder="Date of Birth" style={{ width: '100%' }} />
          <Upload
            listType="picture-card"
            showUploadList={false}
            action="/upload"
            beforeUpload={beforeUpload}
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload Avatar</div>
            </div>
          </Upload>
          <Input placeholder="Skills" />
          <Input placeholder="Education" />
          <Select placeholder="Gender" style={{ width: '100%' }}>
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
          </Select>
          <Row gutter={16}>
            <Col span={12}>
              <DatePicker placeholder="Start Date" style={{ width: '100%' }} />
            </Col>
            <Col span={12}>
              <DatePicker placeholder="End Date" style={{ width: '100%' }} />
            </Col>
          </Row>
          <TextArea placeholder="Additional Information" autoSize={{ minRows: 3, maxRows: 5 }} />
          <Button type="primary" block>
            Generate PDF
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default CVTemplate;

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}
