import React from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { useAddCategory, useEditCategory } from 'hooks/WebHooks';
import { useQueryClient } from 'react-query';
const AddEditCategory = (props) => {
    const refetch = useQueryClient();
    const { handleClose, page, showModal, editData } = props
    const { mutate: addcategory } = useAddCategory();
    const { mutate: editCategory } = useEditCategory();



    const [form] = Form.useForm()

    const onFinish = (formData) => {
        if (page === "add") {
            addcategory(formData, {
                onSuccess: (datas) => {
                    message.success('Category Created Successfully');
                    refetch.refetchQueries('CategoryData')
                    handleClose();
                },
                onError: (error) => {
                    if (!error.response) {
                        message.error(error.message)
                    }
                    else if (error.response.data.error) {
                        message.error(error.response.data.error)
                    } else {
                        message.error("Something Went Wrong!")
                    }
                }
            })
        }
        else {
            const params = { formData: formData, id: editData._id }
            editCategory(params, {
                onSuccess: (datas) => {
                    message.success('Category Updated Successfully');
                    refetch.refetchQueries('CategoryData')
                    handleClose();
                },
                onError: (error) => {
                    if (!error.response) {
                        message.error(error.message)
                    }
                    else if (error.response.data.error) {
                        message.error(error.response.data.error)
                    } else {
                        message.error("Something Went Wrong!")
                    }
                }
            })
        }


    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <>
            <Modal
                centered
                title={page === 'add' ? "Add Category" : "Edit Category"}
                onCancel={handleClose}
                open={showModal}
                footer={[
                    <Button onClick={handleClose}>Cancel</Button>,
                    <Button type='primary' onClick={form.submit}>Submit</Button>
                ]}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={page === 'add' ? null : ({
                        category_name: editData.category_name,
                    })}

                >
                    <Form.Item
                        label="Category"
                        name="category_name"
                        rules={[
                            {
                                required: true,
                                message: 'Category Name is required',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>


                </Form>

            </Modal>
        </>
    );
};
export default AddEditCategory;
