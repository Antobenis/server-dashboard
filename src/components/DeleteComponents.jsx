import { Button, Form, message, Modal } from 'antd';
import { useDeleteCategory, useDeleteServer, useDeleteWebsite } from 'hooks/WebHooks';
import { useDeferredValue, useState } from 'react';
import { useQueryClient } from 'react-query';
const DeleteComponents = (props) => {
    const [form] = Form.useForm()
    const { deleteShow, handleClose, deleteId, deletePage } = props;
    const { mutate: deleteServer } = useDeleteServer();
    const refetch = useQueryClient()
    const { mutate: deleteWebsite } = useDeleteWebsite();
    const { mutate: deleteCategory } = useDeleteCategory();
    const handleSubmit = () => {
        if (deletePage === "server") {
            deleteServer(deleteId, {
                onSuccess: (datas) => {

                    message.success('Server Deleteted Successfully')
                    refetch.refetchQueries('ServerData')
                    handleClose()

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
        } else if (deletePage === 'website') {
            deleteWebsite(deleteId, {
                onSuccess: (datas) => {
                    message.success('Website Deleteted Successfully')
                    refetch.refetchQueries('WebsitesData')
                    handleClose()

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
        } else {
            deleteCategory(deleteId, {
                onSuccess: (datas) => {
                    message.success('Category Deleteted Successfully')
                    refetch.refetchQueries('CategoryData')
                    handleClose()
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
    }


    return (
        <section className="s-delete">
            <Modal
                title="Delete"
                centered
                open={deleteShow}
                onCancel={handleClose}
                footer={[
                    <Button onClick={handleClose}>Cancel</Button>,
                    <Button type='primary' onClick={form.submit}>Delete</Button>
                ]}
            >
                <Form form={form} onFinish={handleSubmit} onFinishFailed={(error) => { console.log(error) }} >
                    <Form.Item label={`Are You Sure to Delete ${deletePage}`}></Form.Item>
                </Form>
            </Modal>
        </section>
    )
}


export default DeleteComponents