import React from 'react';
import { Layout } from 'antd'
import {
  PoweroffOutlined
} from '@ant-design/icons';
import Notification from './notification/Notification';
import { useServerLogout } from 'hooks/AuthHooks'
const { Header } = Layout
const TopHeader = () => {
  const { mutate: logOut } = useServerLogout();
  const handleLogOut = () => {
    logOut()
  }
  return (
    <section className='s-page s-top-header'>
      <Header className="site-layout-background"
        style={{
          padding: 0,
        }}
      >
        <div className='s-header'>
          <div className='s-header-icon'>

            <Notification />
            <div className='logout-icon' onClick={handleLogOut} >
              <PoweroffOutlined />
            </div>
          </div>
        </div>
      </Header>

    </section>
  );
}

export default TopHeader;
