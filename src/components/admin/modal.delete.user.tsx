'use client'
import React, { useState } from 'react';
import { Button, Modal } from 'antd';

interface IProps {
    isModalDeleteOpen: boolean,
    setIsModalDeleteOpen: (isModalDeleteOpen: boolean) => void
    user: any
}

const ModalEditUser = (props: IProps) => {
    const { isModalDeleteOpen, setIsModalDeleteOpen, user } = props;
    return (
        <>
            <Modal title="Delete user" open={isModalDeleteOpen}
                onOk={() => setIsModalDeleteOpen(false)}
                onCancel={() => setIsModalDeleteOpen(false)}
                maskClosable={false}>
                {user &&
                    <div>Are you sure to delete: <b>{user.email}</b></div>
                }
            </Modal>
        </>
    );
};

export default ModalEditUser;