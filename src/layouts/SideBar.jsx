import React from "react";
import {
	HomeOutlined,
	UserAddOutlined,
	DatabaseOutlined,
	CloudServerOutlined
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { Layout, Menu } from "antd";
import logo from "assets/logo.png";
import clogo from "assets/trigerlogo.png";

const { Sider } = Layout;
const SideBar = (props) => {
	const { collapsed, setCollapsed } = props;
	const Logo = () => {
		return collapsed ? (
			<img className="c-logo" src={clogo} alt="img" />
		) : (
			<img className="c-responsive-logo" src={logo} alt="img" />
		);
	};

	return (
		<section className="s-page s-sidebar">
			<Sider
				collapsible
				breakpoint="lg"
				collapsed={collapsed}
				onCollapse={(value) => setCollapsed(value)}
			>
				<div className="logo-wrapper">
					<Logo />
				</div>
				<Menu className="s-menu">
					<Menu.Item>
						<HomeOutlined />
						<span>
							<NavLink to="/dashboard">Dashbaord</NavLink>
						</span>
					</Menu.Item>
					<Menu.Item>
						<UserAddOutlined />
						<span>
							<NavLink to="/category">Category</NavLink>
						</span>
					</Menu.Item>
					<Menu.Item >
						<CloudServerOutlined />
						<span>
							<NavLink to="/servers">Servers</NavLink>
						</span>
					</Menu.Item>
					<Menu.Item  >
						<DatabaseOutlined />
						<span>
							<NavLink to="/websites">Websites</NavLink>
						</span>
					</Menu.Item>
				</Menu>
			</Sider>
		</section>
	);
};

export default SideBar;

