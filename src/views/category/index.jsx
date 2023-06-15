
import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Tooltip } from 'antd';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import AddEditCategory from './add_edit_category';
import { useFetchCategory } from 'hooks/WebHooks';
import DeleteComponents from 'components/DeleteComponents';

const Category = () => {


	const { data: fetchcategory, isLoading: Loading } = useFetchCategory();
	const [category, setCategory] = useState(null);
	const [page, setPage] = useState('')
	const [showModal, setShowModal] = useState(false);
	const [deleteShow, setDeleteShow] = useState(false);
	const [deletePage, setDeletePage] = useState('');
	const [deleteId, setDeleteId] = useState('');
	const [editData, setEditData] = useState({});

	console.log(fetchcategory?.data.service);
	const columns = [
		{
			title: 'Category',
			dataIndex: 'category_name',
			key: 'name',
			width: "80%",
		},
		{
			title: 'Action',
			dataIndex: 'action',
			key: 'action',
			width: 10,
			render: (_, record) => (
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
							setDeleteId(record._id)
							setDeletePage("category")
							setDeleteShow(true)
						}} />
				</div>
			),
		},
	];

	useEffect(() => {
		if (fetchcategory !== undefined) {
			setCategory(fetchcategory.data.service)
		}

	}, [fetchcategory])


	return (
		<section className="s-page s-category">
			{
				Loading ? "Loading" : (
					<>
						<Space
							align='end'

							style={{
								marginBottom: 16,
								width: "100%"
							}}
						>
							<Button type="primary" onClick={() => {
								setPage('add')
								setShowModal(true)
							}}>
								Add Category
							</Button>
						</Space>
						{
							showModal && <AddEditCategory page={page} editData={editData} handleClose={() => { setShowModal(false) }} showModal={showModal} />
						}
						{
							deleteShow && <DeleteComponents deletePage={deletePage} deleteShow={deleteShow} handleClose={() => { setDeleteShow(false) }} deleteId={deleteId} />
						}
						<Table dataSource={category} columns={columns} />
					</>
				)
			}

		</section>
	);
}

export default Category;
