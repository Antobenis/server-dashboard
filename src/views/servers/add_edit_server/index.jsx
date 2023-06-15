
import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Select, message } from 'antd';
import { useAddServer, useEditServer, useFetchCategory } from 'hooks/WebHooks';
import { useQueryClient } from 'react-query';


const AddEditServer = (props) => {
    const refetch = useQueryClient();
    const [form] = Form.useForm()
    const [category, setCategory] = useState(null)
    const { showModal, handleClose, serverData, page, editData } = props;
    const { data: categoryData, isLoading: categoryLoading } = useFetchCategory();
    const { mutate: addServer } = useAddServer()
    const { mutate: editServer } = useEditServer();

    
    const onFinish = (formData) => {
        if (page === 'add') {
            addServer(formData, {
                onSuccess: (datas) => {
                    message.success('Server Created Successfully');
                    refetch.fetchQuery('ServerData')
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
        } else {
            const params = {
                formData: formData,
                id: editData._id
            }
            editServer(params, {
                onSuccess: (datas) => {
                    message.success('Server Updated Successfully');
                    refetch.refetchQueries('ServerData')
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




    useEffect(() => {
        if (categoryData !== undefined) {
            setCategory(categoryData.data.service)
        }
    }, [categoryData])

    return (
        <>

            <Modal title={page === 'add' ? "Add Server" : "Edit Server"} open={showModal} onCancel={handleClose} footer={[
                <Button onClick={handleClose}>Cancel</Button>,
                <Button type='primary' onClick={form.submit}>Submit</Button>
            ]} >
                <Form
                    layout='vertical'
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{
                        category_id: page === 'add' ? "" : editData.category_id,
                        server_name: page === 'add' ? "" : editData.server_name,
                        ip_address: page === 'add' ? "" : editData.ip_address,
                        ram_size: page === 'add' ? "" : editData.ram_size,
                        region: page === 'add' ? "" : editData.region,
                        provider: page === 'add' ? "" : editData.provider
                    }}
                >
                    <Form.Item
                        label="Category"
                        name="category_id"
                        rules={[{
                            required: true,
                            message: "Category Name is  required"
                        }

                        ]}
                    >
                        <Select placeholder="Please Select Category Name"  >
                            { 
                                categoryLoading ? "" : (
                                category?.map((item) => {
                                        return (
                                            <Select.Option value={item._id} >{item.category_name}</Select.Option>
                                        )
                                    }))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Server Name"
                        name="server_name"

                        rules={[
                            {
                                required: "true",
                                message: "Server Name is Required"
                            },
                            {
                                whitespace: true,
                            }
                        ]}
                    >
                        <Input placeholder="Please Enter Server Name" />
                    </Form.Item>
                    <Form.Item
                        label="Ip Address"
                        name="ip_address"
                        rules={[
                            {
                                required: "true",
                                message: "IP Address is Required"
                            },
                            {
                                pattern: new RegExp(/^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm),
                                message: "Enter Valid Ip Address"
                            },
                        ]}
                    >
                        <Input placeholder='Eg: 192.168.19.1' />
                    </Form.Item>
                    <Form.Item
                        label="Ram"
                        name="ram_size"
                        rules={[{
                            required: true,
                            message: "Ram Size is required"
                        },
                        {
                            pattern: new RegExp(/^[0-9\a-z]+$/),
                            message: "Enter valid Ram Size"
                        },

                        ]}
                    >
                        <Input placeholder='Eg : 1024MB' />
                    </Form.Item>
                    <Form.Item
                        label="Region"
                        name="region"
                        rules={[
                            {
                                required: true,
                                message: 'Region is Required'
                            }
                        ]}
                    >
                        <Input placeholder='Region' />
                    </Form.Item>
                    <Form.Item
                        label="Provider"
                        name="provider"
                        rules={[{
                            required: true,
                            message: "Provider is Required"
                        }]}
                    >
                        <Select placeholder="Please Select Provider">
                            <Select.Option value="LightSail">LightSail</Select.Option>
                            <Select.Option value="Vultrn">Vultrn</Select.Option>
                            <Select.Option value='EC2'>EC2</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
export default AddEditServer;
