'use client'
import { Layout } from 'antd';

const AdminFooter = () => {
    const { Footer } = Layout;

    return (
        <>
            <Footer style={{ textAlign: 'center' }}>
                Nxsag ©{new Date().getFullYear()} Created by @nxsag
            </Footer>
        </>
    )
}

export default AdminFooter;