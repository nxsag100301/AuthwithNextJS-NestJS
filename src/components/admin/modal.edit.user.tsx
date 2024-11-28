'use client'
import React, { useEffect, useState } from 'react';
import { Form, Input, message, Modal, Select } from 'antd';
import { actionUpdateUser } from '@/utils/action';

interface IProps {
    isModalEditOpen: boolean,
    setIsModalEditOpen: (isModalEditOpen: boolean) => void
    handleEditUserDone: () => void
    user: any
}

const ModalEditUser = (props: IProps) => {
    const { isModalEditOpen, setIsModalEditOpen, user, handleEditUserDone } = props;
    const [userId, setUserId] = useState()
    const [userName, setUserName] = useState<string>()
    const [userEmail, setUserEmail] = useState()
    const [userActive, setUserActive] = useState<boolean>()
    const [form] = Form.useForm();

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                userEmail: user.email,
                userName: user.name,
                userActive: user.isActive,
            });
            setUserId(user._id)
            setUserEmail(user.email)
            setUserName(user.name)
            setUserActive(user.isActive)
        }
    }, [user])

    const handleConfirmEdit = async () => {
        let res = await actionUpdateUser(userId, userName, userActive)
        if (res.errCode === 0) {
            message.info(res?.message)
            handleEditUserDone()
        }
        else {
            message.info(res?.message)
        }
    }

    const handleCancel = async () => {
        setIsModalEditOpen(false)
        form.setFieldsValue({
            userEmail: user.email,
            userName: user.name,
            userActive: user.isActive,
        });
        setUserEmail(user.email)
        setUserName(user.name)
        setUserActive(user.isActive)
    }

    const handleChangeSelect = (value: boolean) => {
        setUserActive(value)
    };

    return (
        <>
            <Modal title="Edit user" open={isModalEditOpen}
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
                    >
                        <Input readOnly disabled value={userEmail} />
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
                    <Form.Item
                        label="Active"
                        name="userActive" // Trường này phải đồng nhất với key trong `form.setFieldsValue`
                    >
                        <Select
                            defaultValue={user?.isActive}
                            style={{ width: 120 }}
                            onChange={handleChangeSelect}
                            options={[
                                { key: 'true', value: true, label: 'True' },
                                { key: 'false', value: false, label: 'False' },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ModalEditUser;