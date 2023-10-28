import React from 'react'
import { Form, Input, Button, Space } from "antd";

export default function CvsManagement() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Submitted values:", values);
  };
  return (
    <>
       <Form form={form} name="cv_form" onFinish={onFinish} layout="vertical">
      <Form.Item name="education" label="Education">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item name="exp" label="Experience">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item name="skill" label="Skills">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item name="intro" label="Introduction">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item name="detail" label="Details">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button type="default" onClick={form.resetFields}>
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
    </>
  )
}
