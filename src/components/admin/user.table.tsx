'use client'
import { Button, Table } from "antd"
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import ModalEditUser from "./modal.edit.user";
import ModalDeleteUser from "./modal.delete.user";

const UserTable = () => {

    const [dataUser, setDataUser] = useState<any[]>()
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState<number>(4)
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [user, setUser] = useState()

    useEffect(() => {
        fetchUser(currentPage, pageSize)
    }, [])

    const fetchUser = async (current: number, pageSize: number) => {
        const sort = "-createdAt"
        const res = await sendRequest<IBackendRes<IRequest>>({
            method: "GET",
            queryParams: {
                current,
                pageSize,
                sort
            },
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        })
        setDataUser(res.data?.results)
        setTotalPages(res.data?.totalPages || 0)
        setTotalItems(res.data?.totalItems || 0)
    }

    const handleDeleteUser = (record: any) => {
        setIsModalDeleteOpen(true)
        setUser(record)
    }

    const handleEditUser = (record: any) => {
        setIsModalEditOpen(true)
        setUser(record)
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            key: 'id',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: any) => (
                <div style={{ display: "flex", gap: "10px" }}>
                    <span style={{ cursor: 'pointer' }}
                        onClick={() => handleEditUser(record)}>
                        <EditOutlined style={{ color: 'blue', marginRight: 16 }} />
                    </span>
                    <span style={{ cursor: 'pointer' }}
                        onClick={() => handleDeleteUser(record)}
                    >
                        <DeleteOutlined style={{ color: 'red' }} />
                    </span>
                </div>
            ),
        },
    ];

    return (
        <>
            <ModalEditUser
                isModalEditOpen={isModalEditOpen}
                setIsModalEditOpen={setIsModalEditOpen}
                user={user}
            />
            <ModalDeleteUser
                isModalDeleteOpen={isModalDeleteOpen}
                setIsModalDeleteOpen={setIsModalDeleteOpen}
                user={user}
            />
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20
            }}>
                <span>Manager Users</span>
                <Button>Create User</Button>
            </div>
            <Table
                bordered
                dataSource={dataUser}
                columns={columns}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalItems,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                        fetchUser(page, pageSize);
                    },
                }}
            />
        </>
    )
}

export default UserTable;