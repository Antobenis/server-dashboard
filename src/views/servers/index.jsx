import React, { useState, useRef, useEffect } from 'react';
import { Table, Button, Input, Space, Switch, Tag, Dropdown } from 'antd';
import {
	SearchOutlined,
	EditFilled,
	DeleteFilled
} from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import AddEditServer from './add_edit_server';
import { useFetchServers } from 'hooks/WebHooks';
import DeleteComponents from 'components/DeleteComponents';

const Server = () => {
	const { data: ServerData, isLoading: ServerLoading } = useFetchServers()
	const [searchText, setSearchText] = useState("");
	const [serverData, setServerData] = useState(null);
	const [searchedColumn, setSearchedColumn] = useState("");
	const searchInput = useRef(null);
	const [page, setPage] = useState('')
	const [showModal, setShowModal] = useState(false);
	const [editData, setEditData] = useState({})
	const [deleteShow, setDeleteShow] = useState(false)
	const [deleteId, setDeleteId] = useState('');
	const [deletePage, setDeletePage] = useState('');
	console.log(serverData);
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
		console.log("Various parameters", pagination, filters, sorter);
		setFilteredInfo(filters);
		setSortedInfo(sorter);
	};

	const setAgeSort = () => {
		setSortedInfo({
			order: "descend",
			columnKey: "age",
		});
	};
	const columns = [
		{
			title: "Server",
			dataIndex: "server_name",
			key: "server_name",
			width: 100,
		},
		{
			title: "Category",
			dataIndex: "Category",
			key: "Category",
			width: 100,
			render: (_, record) => <span>{record.category.category_name}</span>

		},

		{
			title: "IP Address",
			dataIndex: "ip_address",
			key: "ip_address",
			width: 100,
		},
		{
			title: "Provider",
			dataIndex: "provider",
			key: "provider",
			width: 100,
		},
		{
			title: "Ram Size",
			width: 100,
			dataIndex: 'ram_size',
			key: "ram_size",
		},

		{
			title: "Region",
			dataIndex: "region",
			key: "region",
			width: 100,
		},
		{
			title: "Action",
			key: "action",
			width: 100,
			render: (_, record) => {
				return (
					<div className='s-action'>
						<EditFilled
							className='edit-icon'
							onClick={() => {
								setPage("edit")
								setShowModal(true)
								setEditData(record)
							}}
						/>
						<DeleteFilled
							className='edit-icon'
							onClick={() => {
								setDeletePage('server')
								setDeleteId(record._id)
								setDeleteShow(true)
							}}
						/>
					</div>
				)
			},
		},

	];


	useEffect(() => {
		if (ServerData) {
			setServerData(ServerData.data)
		}
	}, [ServerData])


	return (
		<section className="s-page s-category">
			{
				ServerLoading ? "Loading..." : (
					<>
						<Space
							style={{
								marginBottom: 16,
							}}
						>
							<Button type="primary" onClick={() => {
								setPage('add')
								setShowModal(true)
							}}>
								Add Server
							</Button>
							{
								showModal && <AddEditServer showModal={showModal} editData={editData} handleClose={() => setShowModal(false)} serverData={serverData} page={page} />
							}
							{
								deleteShow && <DeleteComponents deleteShow={deleteShow} handleClose={() => setDeleteShow(false)} deleteId={deleteId} deletePage={deletePage} />
							}



						</Space>
						<Table columns={columns} dataSource={serverData} scroll={{ x: 1300 }} onChange={handleChange} className="s-table" />
					</>
				)
			}

		</section>
	);
}

export default Server;
