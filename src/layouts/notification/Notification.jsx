import React, { useEffect, useState } from 'react';
import {
  BellOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { Drawer, Badge } from 'antd';
import { useFetchNotification } from 'hooks/WebHooks';
import NotificationList from './NotificationList';


const Notification = () => {
  const { data: notification } = useFetchNotification();
  const [notify, setNotify] = useState('');

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (notification !== undefined) {

      setNotify(notification.data)
    }
  }, [notification])
  return (
    <div>
      <Link type="primary" onClick={showDrawer}>
        <Badge count={notify.length} overflowCount={10}>
          <BellOutlined style={{ fontSize: '23px', color: '#171B30' }} />
        </Badge>
      </Link>
      <Drawer title="Notification" placement="right" onClose={onClose} open={open}>
        <NotificationList />
      </Drawer>
    </div>
  );
};
export default Notification;