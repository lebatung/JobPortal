import React from 'react';
import { Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { templates } from '../cvsManagement/data/templates';

export default function CvsManagement() {
  const navigate = useNavigate();

  const navigateToFillDetails = (id) => {
    navigate(`/candidateDashboard/template/fill-details`);
  };

  return (
    <div className="home">
      <div className="home-templates-cont">
        <h2 className="template-header-title">Templates</h2>
        <p className="template-select-text">Select a template to get started</p>

        <div
          style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
          
          }}>
          {templates.map((template) => (
            <Card
              key={template.id}
              hoverable
              style={{ width: 300, marginBottom: 20 }}
              cover={
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    alt={template.template_name}
                    src={template.template_img}
                    style={{
                      width: '100%',
                      height: 'auto',
                      transition: 'transform 0.3s',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              }>
              <div style={{ textAlign: 'center' }}>
                <Button
                  className="use-template-btn"
                  onClick={() => navigateToFillDetails()}
                  size="medium"
                  type="primary">
                  Use Template
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
