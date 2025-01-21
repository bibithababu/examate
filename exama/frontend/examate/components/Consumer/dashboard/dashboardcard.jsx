
import React from 'react';
import './dashboard.css'
import { Col } from 'react-bootstrap';

const DashboardCard = (props) => {
    const {content,count} = props;
    return(
        <Col xs={12} sm={12} md={6} lg={3} style={{ marginBottom: '3%' }}>
        <div className={`dashboardcard ${content} `}  >
              <div className="card-details">
    <div className='text-body'>{content}</div>
    <div className='text-title'>{count}</div>
    </div>
    </div>
    </Col>
    );
}

export default DashboardCard;
