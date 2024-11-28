'use client'
import { Button, Modal, Table } from "antd"
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import ModalEditUser from "./modal.edit.user";
import { actionDeleteUser } from "@/utils/action";
import { toast } from "react-toastify";
import ModalCreateUser from "./modal.create.user";

const UserTable = () => {

    const [dataUser, setDataUser] = useState<any[]>()
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState<number>(4)
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
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
            nextOption: {
                next: { tags: ['list-users'] }
            }
        })
        setDataUser(res.data?.results)
        setTotalPages(res.data?.totalPages || 0)
        setTotalItems(res.data?.totalItems || 0)
    }

    const handleEditUser = (record: any) => {
        setIsModalEditOpen(true)
        setUser(record)
    }

    const handleEditUserDone = () => {
        fetchUser(currentPage, pageSize)
        setIsModalEditOpen(false)
    }

    const handleCreateUser = () => {
        setIsModalCreateOpen(true)
    }

    const handleCreateUserDone = () => {
        fetchUser(currentPage, pageSize)
        setIsModalCreateOpen(false)
    }

    const handleDeleteUser = (record: any) => {
        Modal.confirm({
            title: `${record.email}`,
            content: `Are you sure to delete this user`, okText: 'Confirm',
            okType: 'danger', cancelText: 'Cancel',
            async onOk() {
                let res = await actionDeleteUser(record._id)
                if (res.errCode === 0) {
                    toast.success(res?.message)
                    fetchUser(currentPage, pageSize)
                }
                else (
                    toast.error(res?.message)
                )
            }, onCancel() { },
        })
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
                handleEditUserDone={handleEditUserDone}
            />
            <ModalCreateUser
                isModalCreateOpen={isModalCreateOpen}
                setIsModalCreateOpen={setIsModalCreateOpen}
                handleCreateUserDone={handleCreateUserDone}
            />
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20
            }}>
                <span>Manager Users</span>
                <Button onClick={() => handleCreateUser()}>Create User</Button>
            </div>
            <Table
                bordered
                dataSource={dataUser?.map(user => ({ ...user, key: user._id }))}
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