'use client'
import React, { useState } from 'react';
import { Button, Modal } from 'antd';

interface IProps {
    isModalEditOpen: boolean,
    setIsModalEditOpen: (isModalEditOpen: boolean) => void
    user: any
}

const ModalEditUser = (props: IProps) => {
    const { isModalEditOpen, setIsModalEditOpen, user } = props;
    return (
        <>
            <Modal title="Edit user" open={isModalEditOpen}
                onOk={() => setIsModalEditOpen(false)}
                onCancel={() => setIsModalEditOpen(false)}
                maskClosable={false}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </>
    );
};

export default ModalEditUser;