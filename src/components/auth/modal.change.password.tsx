'use client'
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Steps } from 'antd';
import { SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { sendRequest } from '@/utils/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface IProps {
    changePassword: boolean;
    setChangePassword: (changePassword: boolean) => void;
    userEmail: string | undefined
    setUserEmail: (userEmail: string) => void
}

const ModalChangePassword = (props: IProps) => {
    const { changePassword, setChangePassword, userEmail, setUserEmail } = props
    const [current, setCurrent] = useState(0);
    const [userId, setUserId] = useState<string | undefined>()

    const router = useRouter()


    useEffect(() => {
        if (current === 2) {
            setTimeout(() => {
                setChangePassword(false)
                setCurrent(0)
                router.push('/login')
            }, 1000)
        }
    }, [current])

    const onFinishStep0 = async (values: any) => {
        const { email } = values
        const reActive = await sendRequest<IBackendRes<IReactive>>({
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-active`,
            body: {
                email: email
            }
        })
        if (reActive.statusCode === 201) {
            setCurrent(current + 1)
            setUserId(reActive.data?.id)
        }
        else {
            toast.error("Email not found")
        }

    };

    const onFinishStep1 = async (values: any) => {
        const { code, newpass, confirmpass } = values
        if (newpass !== confirmpass) {
            toast.error("Password does not match")
            return
        }
        const res = await sendRequest<IBackendRes<IRegister>>({
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-password`,
            body: {
                id: userId,
                code: code,
                password: newpass
            }
        })
        if (res?.statusCode === 201) {
            message.info("Your password has been changed")
            setCurrent(current + 1)
        }
        else (
            toast.error(res?.message)
        )
    };

    const handleCloseModal = () => {
        setChangePassword(false)
        setUserEmail('')

    }
    const handleGotoLogin = () => {
        setChangePassword(false)
        router.push('/auth/login')
    }
    return (
        <>
            <Modal title="Forget password"
                open={changePassword}
                onOk={() => setChangePassword(false)}
                onCancel={() => handleCloseModal()}
                maskClosable={false}
                // closable={false}
                footer={null}>
                <Steps
                    current={current}
                    items={[
                        {
                            title: 'Email',
                            // status: 'finish',
                            icon: <UserOutlined />,
                        },
                        {
                            title: 'Verification',
                            // status: 'finish',
                            icon: <SolutionOutlined />,
                        },
                        {
                            title: 'Done',
                            // status: 'wait',
                            icon: <SmileOutlined />,
                        },
                    ]}
                />
                {current === 0 &&
                    <>
                        <Form
                            name="verify"
                            onFinish={onFinishStep0}
                            autoComplete="off"
                            layout='vertical'
                        >
                            <Form.Item
                                label="Enter your email"
                                name="email"
                                initialValue={userEmail}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                            >
                                <Button type="primary" htmlType="submit">
                                    Send code
                                </Button>
                            </Form.Item>
                        </Form>
                    </>}
                {current === 1 &&
                    <>
                        <div style={{ margin: "10px 0" }}>
                            Check your email
                        </div>
                        <Form
                            name="codeId"
                            onFinish={onFinishStep1}
                            autoComplete="off"
                            layout='vertical'
                        >
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
                                label="New password"
                                name="newpass"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                label="Confirm password"
                                name="confirmpass"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                            >
                                <Button type="primary" htmlType="submit">
                                    Confirm
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                }
                {current === 2 &&
                    <>
                        <div style={{ margin: "10px 0" }}>
                            You password has been changed!<br />
                        </div>
                    </>
                }
            </Modal>
        </>
    );
};

export default ModalChangePassword;