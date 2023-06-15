import { Form, Input, Modal } from 'antd'
import React from 'react'

const PayModal = () => {
    return (
        <section>
            <Modal>
                <Form layout='vertical' >
                    <Form.Item>
                        <Input placeholder='Pay Duration' />
                    </Form.Item>
                    <Form.Item>

                    </Form.Item>
                </Form>
            </Modal>
            PayModal
        </section>
    )
}

export default PayModal