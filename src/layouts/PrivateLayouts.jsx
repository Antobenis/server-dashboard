import React, { Fragment, useState } from 'react'
import Cookies from "js-cookie"
import { Layout} from 'antd'
import { Navigate, Outlet } from 'react-router-dom'
import PerfectScrollbar from "react-perfect-scrollbar";

import SideBar from './SideBar'
import TopHeader from './TopHeader'

const { Content } = Layout;
const perfectScrollbarOptions = {
    wheelSpeed: 0.5,
    wheelPropagation: false,
};

const PrivateLayouts = () => {
    const [collapsed, setCollapsed] = useState(false);
    const token = Cookies.get("server_token") === undefined ? false : true
    return (
        token ? <Fragment>
                    <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
                    <Layout className='site-layout'>
                        <TopHeader collapsed={collapsed} setCollapsed={setCollapsed} />
                        <Content className="site-layout-background page-layout s-content">
                            {/* <PerfectScrollbar
                                options={perfectScrollbarOptions}
                                className="scroll"
                                style={{ maxHeight: "100%", position: "relative" }}> */}
                                <Outlet />
                            {/* </PerfectScrollbar>                             */}
                        </Content>                        
                    </Layout>
                </Fragment> : <Navigate to="/login" />
    );
};

export default PrivateLayouts;
