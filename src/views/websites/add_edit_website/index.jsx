import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Button, Modal, Form, Input, DatePicker, Row, Col, Select, message, Checkbox } from 'antd';
import { useAddWebsite, useEditWebsite, useFetchCategoryInclude, } from 'hooks/WebHooks';
import { useQueryClient } from 'react-query';

const AddEditWebsite = (props) => {
    const refetch = useQueryClient()
    const { showModal, handleClose } = props
    const [form] = Form.useForm();
    const [serverData, setServerData] = useState([])
    const [categoryData, setCategoryData] = useState([])
    const { mutate: addWebsite } = useAddWebsite();
    const { data: category, isLoading: categoryLoading } = useFetchCategoryInclude('');

    console.log(serverData);


    useEffect(() => {
        if (category !== undefined) {
            setCategoryData(category.data.serversarray)
        }
    }, [category])
    const handleSubmit = (formData) => {
            addWebsite(formData, {
                onSuccess: (datas) => {
                    message.success("Website Created Successfully")
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
    }

    const DateChange = (value) => {
        const nextDate = new Date(value);
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        form.setFieldsValue({
            nextdue_date: moment(nextDate)
        })
    };
    const handleChange = async (value) => {
        await serverData.filter((item) => {
            if (item._id === value._id) {
                form.setFieldsValue({
                    ip_address: item.ip_address,
                    ram_size: item.ram_size,
                    region: item.region,
                    provider: item.provider,
                })
            }
        })

    };

    return (
        <section className='s-page'>
            <Modal title={"Add Site"} open={showModal} onCancel={handleClose} footer={
                [
                    <Button onClick={handleClose}>Cancel</Button>,
                    <Button onClick={form.submit} type="primary">Submit</Button>,
                ]
            }>
                {
                    categoryLoading ? "Loading..." : (

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                        >
                            <Form.Item
                                label="Site Url"
                                name="site_url"
                                rules={[{
                                    required: true,
                                    message: "Site Url is Required"
                                },
                                {
                                    type: 'url',
                                    message: "Enter Valid Url"
                                }
                                ]}
                            >
                                <Input placeholder='Eg: www.demo.com' />
                            </Form.Item>
                            <Row justify={'space-between'}>
                                <Col span={11}>
                                    <Form.Item
                                        label="HostingStart Date"
                                        name="hostingstart_date"
                                        rules={[{
                                            required: true,
                                            message: "HostingStart Date is Required"
                                        }]}
                                    >
                                        <DatePicker onChange={DateChange} />
                                    </Form.Item>
                                </Col>
                                <Col span={11}>
                                    <Form.Item
                                        label="NextDue date"
                                        name="nextdue_date"
                                    >
                                        <DatePicker style={{ pointerEvents: "none" }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row justify={'space-between'}>
                                <Col span={11}>
                                    <Form.Item name='category_id' label='Category Name'
                                        rules={[{
                                            required: true,
                                            message: "Category Name is Required"
                                        }]}
                                    >
                                        <Select placeholder="Select Category">
                                            {
                                                categoryData.map((item) => {
                                                    return (
                                                        <Select.Option key={item._id} value={item.category_id} >
                                                            <div style={{ width: "100%" }} onClick={() => {
                                                                setServerData(item.categoryserver)
                                                            }}>{item.category_name}</div>
                                                        </Select.Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                {

                                }
                                <Col span={11}>
                                    <Form.Item name='categoryserver_id' label='Server Name'
                                        rules={[{
                                            required: true,
                                            message: "Server Name is Required"
                                        }]}
                                    >
                                        <Select placeholder="Select Server">

                                            {
                                                serverData.map((item) => {
                                                    return (
                                                        <Select.Option key={item._id} value={item._id}>
                                                            <div style={{ width: "100%" }} onClick={() => { handleChange(item) }}>
                                                                {item.server_name}
                                                            </div>
                                                        </Select.Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row justify={'space-between'}>
                                <Col span={11}>
                                    <Form.Item
                                        label="Ip Address"
                                        name="ip_address"
                                        rules={[{
                                            required: true,
                                            message: "Ip Address is Required"
                                        },
                                        {
                                            pattern: new RegExp(/^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm),
                                            message: "Enter Valid Ip Address"
                                        },
                                        ]}
                                    >
                                        <Input className='s-input' placeholder="Eg: 192.168.19.1" />
                                    </Form.Item>
                                </Col>
                                <Col span={11}>
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
                                </Col>
                            </Row>
                            <Row justify={'space-between'}>
                                <Col span={11}>
                                    <Form.Item
                                        label="Region"
                                        name="region"
                                        rules={[{
                                            required: true,
                                            message: "region is Required"
                                        }]}
                                    >
                                        <Input placeholder="Enter Region" />
                                    </Form.Item>
                                </Col>
                                <Col span={11}>
                                    <Form.Item
                                        label="Provider"
                                        name="provider"
                                        rules={[{
                                            required: true,
                                            message: "Provider is Required"
                                        }]}
                                    >
                                        <Select placeholder="Select Provider">
                                            <Select.Option value="LightSail">LightSail</Select.Option>
                                            <Select.Option value="Vultrn">Vultrn</Select.Option>
                                            <Select.Option value='EC2'>EC2</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                        </Form>

                    )
                }
            </Modal>
        </section >
    );
};
export default AddEditWebsite;
