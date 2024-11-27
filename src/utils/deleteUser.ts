import { NextApiRequest, NextApiResponse } from 'next';
import { sendRequest } from '@/utils/api';
import { auth } from '@/auth';

interface DeleteUserRequestBody {
    userId: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Chỉ xử lý các yêu cầu POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userId }: DeleteUserRequestBody = req.body;

    // Lấy thông tin phiên
    const session = await auth();

    if (!session || !userId) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    try {
        const response = await sendRequest({
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${session?.user?.access_token}`,
            },
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${userId}`,
        });
        console.log('check response:', response)
        // if (response.data) {
        //     return res.status(200).json({ message: 'User deleted successfully' });
        // } else {
        //     return res.status(500).json({ message: 'Failed to delete user' });
        // }
    } catch (error) {
        return res.status(500).json({ message: 'Error occurred while deleting user' });
    }
}
