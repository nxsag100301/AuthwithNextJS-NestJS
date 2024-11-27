'use client'
import React, { useState } from 'react';
import { Button, Col, Divider, Form, Input, message, notification, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { sendRequest } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ModalReactive from './modal.reactive';
import ModalCodeExpired from './modal.code.expired';

interface IProps {
    id: string
}

const Verify = (props: IProps) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userEmail, setUserEmail] = useState<string>()
    const { id } = props
    const router = useRouter()
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        console.log('check values:', values)
        const res = await sendRequest<IBackendRes<IRegister>>({
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify-account`,
            body: {
                id: values._id,
                code: values.code,
            }
        })
        if (res?.statusCode === 201) {
            message.info("Account activated")
            router.push('/auth/login')
        }
        else if (res?.statusCode === 400 && res?.message === "Code expired") {
            toast.error(res?.message)
            form.resetFields()
            setIsModalOpen(true)
        }
        else {
            toast.error(res?.message)
        }
    };

    return (
        <>
            <ModalCodeExpired
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                userEmail={userEmail}
                setUserEmail={setUserEmail}
            />
            <Row justify={"center"} style={{ marginTop: "30px" }}>
                <Col xs={24} md={16} lg={8}>
                    <fieldset style={{
                        padding: "15px",
                        margin: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "5px"
                    }}>
                        <legend>Kích hoạt tài khoản</legend>
                        <Form
                            name="basic"
                            onFinish={onFinish}
                            autoComplete="off"
                            layout='vertical'
                            form={form}
                        >
                            <Form.Item
                                label="Id"
                                name="_id"
                                initialValue={id}
                                hidden
                            >
                                <Input disabled />
                            </Form.Item>
                            <div style={{ margin: "15px 0" }}>Mã kích hoạt đã gửi, kiểm tra email của bạn</div>
                            <Form.Item
                                label="Code"
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your code!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                            >
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                        <Link href={"/"}><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                        <Divider />
                        <div style={{ textAlign: "center" }}>
                            Đã có tài khoản? <Link href={"/auth/login"}>Đăng nhập</Link>
                        </div>

                    </fieldset>
                </Col>
            </Row>
        </>
    )
}

export default Verify;