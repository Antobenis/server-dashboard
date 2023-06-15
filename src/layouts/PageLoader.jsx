import React from 'react';
import { Alert, Spin } from 'antd';
const PageLoader = () => (
  <Spin tip="Loading..." className='s-page spin-loading'>
  </Spin>
);
export default PageLoader;