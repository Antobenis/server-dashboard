import React, { useState, useEffect } from 'react'
import { useFetchWebsites } from "hooks/WebHooks"
import { Avatar, Card, Col, Row, Statistic, Switch, Table, Tag } from 'antd'
import { LikeOutlined, ClockCircleOutlined } from '@ant-design/icons';

import moment from 'moment';
const Dashboard = () => {

	const [data, setData] = useState(null)
	const[invoice,setInvoice] =useState('');
	const { data: WebsiteData, isLoading: dashboardLoader } = useFetchWebsites()


	const columns = [
		{
			title: "Server",
			dataIndex: "server_name",
			key: "server_name",
			width: 100,
			render: (_, record) => <span>{record.categoryserver.server_name}</span>
		},
		{
			title: "Site",
			dataIndex: "site_url",
			key: "site_url",
			width: 100,

		},

		{
			title: "Hosting Starts",
			dataIndex: "hostingstart_date",
			key: "hostingstart_date",
			width: 100,
			render: (_, record) => <span>{moment(record.hostingstart_date).format('DD-MM-YYYY')}</span>
		},
		{
			title: "Next Due",
			dataIndex: "nextdue_date",
			key: "nextdue_date",
			width: 100,
			render: (_, record) => <span>{moment(record.nextdue_date).format('DD-MM-YYYY')}</span>
		},
		{
			title: "Action",
			width: 100,
			key: "",
			render: (_, record) => {
				if(record.status === "pay") {
					return (<Tag  color="blue">Pay</Tag>)
				}else if(record.status === "paid") {
					return (<Tag  color='success'>Paid</Tag>)
				}else{
					return (<Tag  color='error'>Send Invoice</Tag>)
				}
			},
		},
	
		{
			title: "Down/Up",
			dataIndex: "up_down",
			key: "up_down",
			width: 100,
			render: (_, record) => <Switch className='s-input' checked={record.up_down} style={{ minWidth: '30px' }} />,

		}
	];

		// Call api on page ready
		useEffect(() => {
			if (WebsiteData) {
				const datas = WebsiteData?.data.filter((item) => {
					if (item.status === "invoice") {
						return item
					}
				})
				setInvoice(datas)
			}
		}, [WebsiteData]);
	
		// process api returned data
		useEffect(() => {
			if (WebsiteData) {
				const datas = WebsiteData?.data.filter((item) => {
					if (item.status === "pay") {
						return item
					}
				})
				setData(datas)
			}
		}, [WebsiteData]);

	return (
		<section className="s-page s-dashboard">
			{dashboardLoader ? 'Loading ....' : (
				<Row gutter={[14, 14]} >
					<Col xs={24} md={12}>
						<Card className='s-dashboard-card' >
							<Avatar shape="square" size={64} icon={<ClockCircleOutlined />} className='icon-bg' style={{ marginBottom: "5px" }} />
							<Statistic title="Pending Invoice" value={invoice.length} prefix={<LikeOutlined />} />
						</Card>
					</Col>
					<Col xs={24} md={12}>
						<Card className='s-dashboard-card'>
							<Avatar shape="square" size={64} icon={<ClockCircleOutlined />} className='icon-bg'  style={{ marginBottom: "5px" }} />
							<Statistic title="Pending Payment" value={data?.length} prefix={<LikeOutlined />} />
						</Card>
					</Col>
					<Col span={24}>
						<Table dataSource={data} columns={columns} scroll={{
							x: 1300,
						}} pagination={{
							pageSize : 4
						}

						} />
					</Col>
				</ Row>
			)
			}
		</section>
	);
}

export default Dashboard;
