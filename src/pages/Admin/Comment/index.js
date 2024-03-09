import EnhancedTable from '../../../components/Table';
import classNames from 'classnames/bind';
import styles from './Comment.module.scss';
import * as report_commentServices from '../../../services/report_commentServices';
import { useState, useEffect, useContext } from 'react';
import { AccountLoginContext } from '../../../context/AccountLoginContext';
import { getUserById } from '../../../services/userServices';
const cx = classNames.bind(styles);

function Comment() {
    const { userId } = useContext(AccountLoginContext);
    const [listComment, setListComment] = useState([]);
    const [approveState, setApproveState] = useState(true);
    const headCells = [
        {
            id: 'id',
            numeric: false,
            disablePadding: true,
            label: 'ID',
        },
        {
            id: 'content_post',
            numeric: true,
            disablePadding: false,
            label: 'Nội dung bình luận',
        },
        {
            id: 'content_report',
            numeric: true,
            disablePadding: false,
            label: 'Nội dung báo cáo',
        },
        {
            id: 'username_approve',
            numeric: true,
            disablePadding: false,
            label: 'Tài khoản phê duyệt',
        },
        {
            id: 'reject',
            numeric: false,
            disablePadding: false,
            label: 'Duyệt',
        },
        {
            id: 'approve',
            numeric: false,
            disablePadding: false,
            label: 'Không duyệt',
        },
    ];

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await report_commentServices.getComment();
                setListComment(
                    result.map((row) => ({
                        id: row[0],
                        content_post: row[1],
                        content_report: row[2],
                        username_approve: row[3],
                        approve: row[4],
                        reject: row[5],
                    })),
                );
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
        fetchApi();
    }, []);

    const handleApproval = async (id, approveState) => {
        try {
            if (userId !== 0) {
                const userLogin = await getUserById(userId);
                await report_commentServices.changeApprove(id, userLogin, approveState);
                // Cập nhật lại danh sách sau khi thay đổi trạng thái
                const result = await report_commentServices.getComment();
                setListComment(
                    result.map((row) => ({
                        id: row[0],
                        content_post: row[1],
                        content_report: row[2],
                        username_approve: row[3],
                        approve: row[4],
                        reject: row[5],
                    })),
                );
            }
        } catch (error) {
            console.error('Error updating approval status:', error);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <EnhancedTable
                report={true}
                headCells={headCells}
                rows={listComment || []}
                noedit={true}
                title="Quản lý báo cáo bình luận"
                // selectFunction={true}
                handleSelectFunction={handleApproval}
            />
        </div>
    );
}

export default Comment;
