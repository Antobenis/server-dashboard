import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Button, Space, Table, Input, Switch, Tag, Dropdown } from "antd";
import AddEditWebsite from './add_edit_website/'
import { useFetchWebsites, useSendInvoicePay } from "hooks/WebHooks";
import DeleteComponents from "components/DeleteComponents";
import EditSite from "./add_edit_website/EditSite";
import PaymentHistory from "components/PaymentHistory";


const Website = () => {
	const { data: fetchwebsite, isLoading: websiteLoading } = useFetchWebsites()
	const { mutate: sendInvoicePay } = useSendInvoicePay()
	const searchInput = useRef(null);
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const [websitedata, setWebsitedata] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [editShow, setEditShow] = useState(false);
	const [deleteShow, setDeleteShow] = useState(false)
	const [deletePage, setDeletePage] = useState("");
	const [editData, setEditData] = useState(null);
	const [deleteId, setDeleteId] = useState("");
	const [payHistoryShow, setPayHistoryShow] = useState(false)
	const [sendPay, setSendPay] = useState(false);

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};
	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText("");
	};
	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
			<div
				style={{
					padding: 8,
				}}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{
						marginBottom: 8,
						display: "block",
					}}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{
							width: 90,
						}}
					>
						Search
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined
				style={{
					color: filtered ? "#1890ff" : undefined,
				}}
			/>
		),
		onFilter: (value, record) =>
			record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
		onFilterDropdownOpenChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		},
		render: (text) =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{
						backgroundColor: "#ffc069",
						padding: 0,
					}}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ""}
				/>
			) : (
				text
			),
	});
	const [filteredInfo, setFilteredInfo] = useState({});
	const [sortedInfo, setSortedInfo] = useState({});
	const handleChange = (pagination, filters, sorter) => {
		setFilteredInfo(filters);
		setSortedInfo(sorter);
	};

	const setAgeSort = () => {
		setSortedInfo({
			order: "descend",
			columnKey: "age",
		});
	};
	const handleSend = async (record) => {
		const params = {
			formData: { status: `${record.status === "invoice" ? "pay" : "paid"}` },
			id: record._id
		}
		await sendInvoicePay(params)
	}
	const pay = () => {

	}
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
				if (record.status === "pay") {
					return (<div onClick={() => handleSend(record)}><Tag color='success' >Pay</Tag></div>)
				} else if (record.status === "invoice") {
					return (<div onClick={() => setSendPay(true)}><Tag color='error'>Send Invoice</Tag></div>)
				} else {
					return (<Tag color='success' >Paid</Tag>)
				}
			},
		},

		{
			title: "Down/Up",
			dataIndex: "up_down",
			key: "up_down",
			width: 100,
			render: (_, record) => <Switch className='s-input' style={{ minWidth: '30px' }} checked={record.up_down} />,
		},
		{
			title: "More",
			width: 100,
			render: (_, record) => {
				const items = [
					{
						label: 'Edit',
						key: '1',
						onClick: () => {
							console.log("record", record)
							setEditShow(true)
							setEditData(record)
						}
					},
					{
						label: 'Delete',
						key: '2',
						onClick: () => {
							setDeletePage('website')
							setDeleteId(record._id)
							setDeleteShow(true);
						}
					},
					{
						label: 'Payment History',
						key: '3',
						onClick: () => {
							setPayHistoryShow(true)
						}
					},
				];
				return (
					<Dropdown
						placement="bottom"
						menu={{
							items,
						}}
					>
						<a onClick={(e) => e.preventDefault()}>
							<Space>
								...
							</Space>
						</a>
					</Dropdown>
				)
			},
		},
	];

	useEffect(() => {
		if (fetchwebsite !== undefined) {
			setWebsitedata(fetchwebsite.data)
		}
	}, [fetchwebsite])

	return (
		<>
			<section className="s-page s-website">
				<>
					{
						websiteLoading ? "Loading" : (
							<>
								<Space
									style={{
										marginBottom: 16,
									}}
								>
									<Button type="primary" onClick={() => {
										setShowModal(true)
									}}>
										Add Site
									</Button>
									{showModal && <AddEditWebsite showModal={showModal} handleClose={() => setShowModal(false)} />}
									{editShow && <EditSite editShow={editShow} handleClose={() => setEditShow(false)} editData={editData} />}
									{deleteShow && <DeleteComponents deleteShow={deleteShow} deletePage={deletePage} handleClose={() => { setDeleteShow(false) }} deleteId={deleteId} />}
									{setPayHistoryShow && <PaymentHistory payHistoryShow={payHistoryShow} handleClose={() => { setPayHistoryShow(false) }} />}
								</Space>
								<Table columns={columns} dataSource={websitedata} onChange={handleChange} scroll={{
									x: 1300
								}} />
							</>)
					}
				</>

			</section >
		</>
	);
};
export default Website;
