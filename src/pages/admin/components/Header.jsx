import React from 'react';
import { Layout, Input, Button } from 'antd';
import { Row, Col, Typography, Avatar } from 'antd';
import {
  SearchOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons';

import '../css/style.css';

const { Header } = Layout;
const { Title, Text } = Typography;

function HeaderDashboard() {
  return (
    <Header className="header">
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={4} style={{ color: 'blue', margin: 0 }}>
            Admin Dashboard
          </Title>
        </Col>
        <Col>
          <Row justify="end" align="middle">
            <Col>
              <Text style={{ color: 'black', marginRight: '16px' }}>
                <MessageOutlined />
              </Text>
            </Col>
            
          </Row>
        </Col>
      </Row>
    </Header>
  );
}

export default HeaderDashboard;
