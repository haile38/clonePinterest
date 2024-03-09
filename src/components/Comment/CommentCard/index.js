import { faTrash, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import React, { useContext, useEffect, useState } from 'react';
import AccountInfo from '../../../components/AccountInfo';
import { ThemeContext } from '../../../context/ThemeContext';
import * as commentServices from '../../../services/commentServices';
import { notificationDeleted } from '../../../services/notificationService';
import Button from '../../Button';
import styles from '../Comment.module.scss';

const cx = classNames.bind(styles);

function CommentCard({ handleTurnOnSelectReport, comment, currentUser }) {
    const [del, setDelComment] = useState(false);
    const { theme } = useContext(ThemeContext);
    const [commentDelete, setCommentDelete] = useState({});
    const [confirmDelete, setConfirmDelete] = useState(false); //Mở dialog xóa
    useEffect(() => {
        if (comment.user.id === currentUser.id) {
            setDelComment(true);
        }
    }, []);

    const confirmDeleteComment = (comment) => {
        console.log(comment);
        setCommentDelete(comment);
        setConfirmDelete(true);
    };

    const deleteComment = () => {
        const fetchApi = async () => {
            const rs = await commentServices.del(commentDelete);
            if (rs) {
                notificationDeleted(commentDelete.notification.id);
                setConfirmDelete(false);
                window.location.reload();
            }
        };
        fetchApi();
    };

    const handleCloseConfirm = () => {
        setConfirmDelete(false);
    };

    return (
        <div className={cx('comment-wrapper')}>
            <div className={cx('comment-info')}>
                <div className={cx('user-infor')}>
                    <AccountInfo userImage={comment.user.avatar} username={comment.user.fullname}></AccountInfo>
                </div>
                <div className={cx('comment-body')}>
                    <p>{comment.content}</p>
                </div>
            </div>
            <div className={cx('comment-option')}>
                {del ? (
                    <Tippy delay={[0, 100]} content="Xóa nhận xét" placement="bottom">
                        <div className={cx('action-comment')}>
                            <button
                                className={cx('action-button', 'delete-button', theme === 'dark' ? 'dark' : '')}
                                onClick={() => confirmDeleteComment(comment)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    </Tippy>
                ) : (
                    <Tippy delay={[0, 100]} content="Báo cáo nhận xét" placement="bottom">
                        <div className={cx('action-comment')}>
                            <button
                                className={cx('action-button', 'report-button', theme === 'dark' ? 'dark' : '')}
                                onClick={() => handleTurnOnSelectReport(true, comment)}
                                // onClick={() => turnOnReportComment(comment)}
                            >
                                <FontAwesomeIcon icon={faTriangleExclamation} />
                            </button>
                        </div>
                    </Tippy>
                )}
            </div>
            {confirmDelete && (
                <Dialog className={theme === 'dark' ? 'dark' : ''} fullWidth={true} maxWidth="sm" open={confirmDelete}>
                    <DialogTitle sx={{ marginTop: '10px', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}>
                        Xóa nhận xét?
                    </DialogTitle>
                    <form>
                        <DialogContent>Nhận xét bạn đã gửi cho ghim này sẽ bị xóa.</DialogContent>
                        <DialogActions sx={{ marginBottom: '10px' }}>
                            <div>
                                <Button style={{ fontSize: '14px' }} type="button" onClick={handleCloseConfirm}>
                                    Hủy
                                </Button>
                                <Button
                                    style={{ fontSize: '14px', marginLeft: '8px' }}
                                    red
                                    type="button"
                                    onClick={deleteComment}
                                >
                                    Xóa
                                </Button>
                            </div>
                        </DialogActions>
                    </form>
                </Dialog>
            )}
        </div>
    );
}

export default CommentCard;
