'use client'
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Steps } from 'antd';
import { SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { sendRequest } from '@/utils/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: (isModalOpen: boolean) => void;
    userEmail: string | undefined
    setUserEmail: (userEmail: string) => void
}

const ModalReactive = (props: IProps) => {
    const { isModalOpen, setIsModalOpen, userEmail, setUserEmail } = props
    const [current, setCurrent] = useState(0);
    const [userId, setUserId] = useState<string | undefined>()

    const router = useRouter()


    useEffect(() => {
        if (current === 2) {
            setTimeout(() => {
                setIsModalOpen(false)
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
        console.log('check reactive:', reActive.data?.id)
        if (reActive.statusCode === 201) {
            setCurrent(current + 1)
            setUserId(reActive.data?.id)
        }
        else {
            toast.error("Email not found")
        }

    };

    const onFinishStep1 = async (values: any) => {
        const res = await sendRequest<IBackendRes<IRegister>>({
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify-account`,
            body: {
                id: userId,
                code: values.code,
            }
        })
        if (res?.statusCode === 201) {
            message.info("Account activated")
            setCurrent(current + 1)
        }
        else (
            toast.error(res?.message)
        )
    };

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setUserEmail('')

    }
    const handleGotoLogin = () => {
        setIsModalOpen(false)
        router.push('/auth/login')
    }
    return (
        <>
            <Modal title="Active your account"
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                // onCancel={() => handleCloseModal()}
                maskClosable={false}
                closable={false}
                footer={null}>
                <Steps
                    current={current}
                    items={[
                        {
                            title: 'Register',
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
                        <div style={{ margin: "20px 0" }}>
                            Your account has not been activated
                        </div>
                        <Form
                            name="verify"
                            onFinish={onFinishStep0}
                            autoComplete="off"
                            layout='vertical'
                        >
                            <Form.Item
                                name="email"
                                initialValue={userEmail}
                            >
                                <Input readOnly />
                            </Form.Item>
                            <Form.Item
                            >
                                <Button type="primary" htmlType="submit">
                                    Resend code
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
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your code!',
                                    },
                                ]}
                            >
                                <Input placeholder="Your code" />
                            </Form.Item>
                            <Form.Item
                            >
                                <Button type="primary" htmlType="submit">
                                    Send
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                }
                {current === 2 &&
                    <>
                        <div style={{ margin: "10px 0" }}>
                            You account has been activated!<br />
                        </div>
                    </>
                }
            </Modal>
        </>
    );
};

export default ModalReactive;