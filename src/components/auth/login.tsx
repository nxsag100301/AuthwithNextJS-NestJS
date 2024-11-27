'use client'
import { Button, Col, Divider, Form, Input, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { authenticate } from '@/utils/action';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ModalReactive from './modal.reactive';
import ModalChangePassword from './modal.change.password';

const Login = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [userEmail, setUserEmail] = useState<string>()
    const router = useRouter()
    const [form] = Form.useForm();
    const onFinish = async (values: any) => {
        const { username, password } = values
        setUserEmail('')
        const login = await authenticate(username, password)
        if (login.code === 1) {
            toast.error("Invalid Email/Password")
        }
        else if (login.code === 2) {
            // toast.error("Account has not been activated")
            setUserEmail(username)
            form.resetFields()
            setIsModalOpen(true)
        }
        else if (login.code === 3) {
            toast.error("Internal server error")
        }
        else {
            router.push('/dashboard')
        }
    };

    return (
        <>
            <ModalReactive
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                userEmail={userEmail}
                setUserEmail={setUserEmail}
            />
            <ModalChangePassword
                changePassword={changePassword}
                setChangePassword={setChangePassword}
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
                        <legend>Đăng Nhập</legend>
                        <Form
                            name="login"
                            onFinish={onFinish}
                            autoComplete="off"
                            layout='vertical'
                            form={form}
                        >
                            <Form.Item
                                label="Email"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your email!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>



                            <Form.Item>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <Button type="primary" htmlType="submit">
                                        Login
                                    </Button>
                                    <Button type="link" onClick={() => setChangePassword(true)}>Forget password?</Button>
                                </div>
                            </Form.Item>
                        </Form>
                        <Link href={"/"}><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                        <Divider />
                        <div style={{ textAlign: "center" }}>
                            Chưa có tài khoản? <Link href={"/auth/register"}>Đăng ký tại đây</Link>
                        </div>
                    </fieldset>
                </Col>
            </Row >
        </>
    )
}

export default Login;