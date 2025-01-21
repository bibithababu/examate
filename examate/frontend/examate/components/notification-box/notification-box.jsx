
import { React,useEffect } from 'react';

import { formatDistanceToNow } from 'date-fns';
import "./notification-box.css";



const NotificationDropdown = ({notificationsCount,notifications}) => {

  const notificationStatus = {0:'active',1:'' };

  useEffect(() => {
  }, [notificationsCount]); 


    return (
<div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
  <div className="offcanvas-header">
    <h5 id="offcanvasRightLabel">NOTIFICATIONS</h5>
    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div className="offcanvas-body">
    {notifications && notifications.length > 0 ? (
      <div>
        <div className="list-group">
          {notifications.map(notification => (
            <div key={notification.id} className={`list-group-item list-group-item-action ${notificationStatus[notification.status]}`}>
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{notification.title}</h5>
                <small>{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</small>
              </div>
              <p className="mb-1">{notification.body}</p>
            </div>
          ))}
        </div>
        {/* <div className="d-flex justify-content-center">
        <button type="button" onClick={handleViewMore} className="btn btn-link">more info</button>
        </div> */}
        
      </div>
    ) : (
      <p>No notifications found</p>
    )}
  </div>
</div>
    );
  };
  

export default NotificationDropdown;
