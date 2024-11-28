'use client'
import React, { useState } from 'react';
import { Form, Input, message, Modal } from 'antd';
import { actionCreateUser } from '@/utils/action';
import { toast } from 'react-toastify';

interface IProps {
    isModalCreateOpen: boolean,
    setIsModalCreateOpen: (isModalCreateOpen: boolean) => void
    handleCreateUserDone: () => void
}

const ModalCreateUser = (props: IProps) => {
    const { isModalCreateOpen, setIsModalCreateOpen, handleCreateUserDone } = props;
    const [userName, setUserName] = useState<string | ''>()
    const [userEmail, setUserEmail] = useState<string | ''>()
    const [userPassword, setUserPassword] = useState<string | ''>()
    const [confirmPassword, setConfirmPassword] = useState<string | ''>()
    const [form] = Form.useForm();

    const validateEmail = (email: any) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleConfirmEdit = async () => {
        if (!userEmail || !userPassword || !confirmPassword) {
            return
        }
        if (userPassword !== confirmPassword) {
            toast.error(`Password doesn't match`)
            return
        }

        let isValidEmail = validateEmail(userEmail)
        if (!isValidEmail) {
            toast.error('Invalid email')
            return
        }
        let res = await actionCreateUser(userName, userEmail, userPassword)
        if (res.errCode === 0) {
            message.info(res?.message)
            handleCreateUserDone()
        }
        else {
            toast.error(res?.message)
        }
    }

    const handleCancel = async () => {
        setIsModalCreateOpen(false)
        form.setFieldsValue({
            userEmail: '',
            userName: '',
            password: '',
            confirmPassword: '',
        });
        setUserEmail('')
        setUserName('')
        setUserPassword('')
        setConfirmPassword('')
    }

    return (
        <>
            <Modal title="Create user" open={isModalCreateOpen}
                onOk={() => handleConfirmEdit()}
                onCancel={() => handleCancel()}
                maskClosable={false}>
                <Form
                    form={form}
                    name="editUser"
                    autoComplete="off"
                    layout='vertical'

                >
                    <Form.Item
                        label="Email"
                        name="userEmail"
                        rules={[
                            {
                                required: true,
                                message: 'Invalid email',
                            },
                        ]}
                    >
                        <Input value={userEmail} onChange={(event) => setUserEmail(event?.target.value)} />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Invalid password',
                            },
                        ]}
                    >
                        <Input.Password value={userPassword} onChange={(event) => setUserPassword(event?.target.value)} />
                    </Form.Item>
                    <Form.Item
                        label="Confirm password"
                        name="confirmPassword"
                        rules={[
                            {
                                required: true,
                                message: 'Invalid confirm password',
                            },
                        ]}
                    >
                        <Input.Password value={confirmPassword} onChange={(event) => setConfirmPassword(event?.target.value)} />
                    </Form.Item>
                    <Form.Item
                        label="Name"
                        name="userName"
                        rules={[
                            {
                                message: 'Invalid name',
                            },
                        ]}
                    >
                        <Input value={userName} onChange={(event) => setUserName(event?.target.value)} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ModalCreateUser;