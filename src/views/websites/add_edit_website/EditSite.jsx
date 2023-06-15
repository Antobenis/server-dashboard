import { Button, Checkbox, Col, DatePicker, Form, Input, message, Modal, Row, Select } from "antd";
import { useEditWebsite, useFetchCategoryInclude, useFetchServersByCategory } from "hooks/WebHooks";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import moment from 'moment'
import _ from 'lodash'

const EditSite = (props) => {
    const { editShow, handleClose, editData } = props
    const refetchQuery = useQueryClient()
    const [form] = Form.useForm();
    const [serverData, setServerData] = useState(null)
    const [categoryData, setCategoryData] = useState(null)
    const [defaultCategory, setDefaultCategory] = useState("categoryserver")
    const [categoryId, setCategoryId] = useState(null)
    const { mutate: editWebsite } = useEditWebsite();
    const { data: category, isLoading: categoryLoading } = useFetchCategoryInclude(defaultCategory);
    const { data: servers, refetch } = useFetchServersByCategory(categoryId);
    const [editEnable, setEditEnable] = useState(false)

    const categoryChangeHandler = (categoryId) =>{
        setCategoryId(categoryId)
    }
    const handleSubmit = (formData) => {
        const params = {
            formData: formData,
            id: editData._id
        }
        editWebsite(params, {
            onSuccess: (datas) => {
                message.success("Website Updated Successfully")
                refetchQuery.refetchQueries('WebsitesData')
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
        switch (nextDate) {
            case nextDate:
                form.setFieldsValue({
                    nextdue_date: moment(nextDate),
                });
        }
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

    // Set Category dropdown
    useEffect(() => {  
        if (category) {
            let tCategory = []
            let tServer = []
            _.forEach(category?.data?.serversarray, function (cat) {
                tCategory.push({
                    value: cat._id,
                    label: cat.category_name
                })
                tServer.push({
                    value: cat._id,
                    label: cat.category_name
                })
            });

            setCategoryData(tCategory)
        }
    }, [category])

    // Set server dropdown
    useEffect(() => {  
        if (servers) {
            let tServer = []
            _.forEach(servers?.data, function (ser) {
                tServer.push({
                    value: ser?.categoryserver._id,
                    label: ser?.categoryserver.server_name
                })
            });

            setServerData(tServer)
        }
    }, [servers])

    useEffect(() => {  
        if (editData) {
            setCategoryId(editData.category_id)
        }
    }, [editData])

    useEffect(() => {  
        if (categoryId) {
            refetch()
        }
    }, [categoryId])

    return (
        <section className='s-page'>
            {
                categoryLoading ? "Loading" : (
                    <Modal open={editShow}
                        title={"Edit Site"}
                        onCancel={handleClose}
                        footer={[
                            <Button onClick={handleClose}>Cancel</Button>,
                            <Button type="primary" onClick={form.submit}>Submit</Button>
                        ]}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{
                                site_url: editData.site_url,
                                hostingstart_date: moment(editData.hostingstart_date),
                                nextdue_date: moment(editData.nextdue_date),
                                category_id: editData.category_id,
                                categoryserver_id: editData.categoryserver_id,
                                ip_address: editData.ip_address,
                                ram_size: editData.ram_size,
                                region: editData.region,
                                provider: editData.provider
                            }}>
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
                                        <DatePicker onChange={DateChange} name="hostingstart_date" />
                                    </Form.Item>
                                </Col>
                                <Col span={11}>
                                    <Form.Item
                                        label="NextDue date"
                                        name="nextdue_date"
                                    >
                                        <DatePicker />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item onChange={() => { setEditEnable(!editEnable) }}>
                                <Checkbox >Enable Edit</Checkbox>
                            </Form.Item>
                            {
                                editEnable ?
                                    <>
                                        <Row justify={'space-between'}>
                                            <Col span={11}>
                                                <Form.Item name='category_id' label='Category Name'
                                                    rules={[{
                                                        required: true,
                                                        message: "Category Name is Required"
                                                    }]}>
                                                    <Select 
                                                        placeholder="Select Category"
                                                        onChange={categoryChangeHandler} 
                                                        options={categoryData}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={11}>
                                                <Form.Item name='categoryserver_id' label='Server Name'
                                                    rules={[{
                                                        required: true,
                                                        message: "Server Name is Required"
                                                    }]}
                                                >   
                                                    <Select 
                                                        placeholder="Select Server" 
                                                        options={serverData} />
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
                                    </>
                                    : <>
                                        <Row justify={'space-between'}>
                                            <Col span={11}>
                                                <Form.Item name='category_id' label='Category Name'
                                                    rules={[{
                                                        required: true,
                                                        message: "Category Name is Required"
                                                    }]}
                                                >
                                                    <Select className="s-input" defaultValue={editData.category._id}>
                                                        <Select.Option value={editData.category._id}>{editData.category.category_name}</Select.Option>
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
                                                    <Select className="s-input" defaultValue={editData.categoryserver._id}>
                                                        <Select.Option value={editData.categoryserver._id}>{editData.categoryserver.server_name}</Select.Option>
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
                                                    <Input className="s-input" placeholder="Eg: 192.168.19.1" />
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
                                                    <Input className="s-input" placeholder='Eg : 1024MB' />
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
                                                    <Input className="s-input" placeholder="Enter Region" />
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
                                                    <Select className="s-input" placeholder="Select Provider">
                                                        <Select.Option value="LightSail">LightSail</Select.Option>
                                                        <Select.Option value="Vultrn">Vultrn</Select.Option>
                                                        <Select.Option value='EC2'>EC2</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </>
                            }
                        </Form>
                    </Modal>
                )
            }
        </section>
    )
}

export default EditSite;