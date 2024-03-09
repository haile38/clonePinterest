import classNames from 'classnames/bind';
import styles from './Statistic.module.scss';
import ItemStatistic from '../../../components/ItemStatistic';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import * as userServices from '../../../services/userServices';
import * as pinServices from '../../../services/pinServices';
import * as commentServices from '../../../services/commentServices';
import * as likeServices from '../../../services/likeServices';
import * as report_commentServices from '../../../services/report_commentServices';
import * as report_pinServices from '../../../services/report_pinServices';
import { CircularProgress } from '@mui/material';

const cx = classNames.bind(styles);

function Statistic() {
    const { theme } = useContext(ThemeContext);
    const [user, setUser] = useState({});
    const [pin, setPin] = useState({});
    const [comment, setComment] = useState({});
    const [like, setLike] = useState({});
    const [reportComment, setReportComment] = useState({});
    const [reportPin, setReportPin] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApi = async () => {
            const resultUser = await userServices.countUserByCreatedAt();
            setUser(resultUser);

            const resultPin = await pinServices.countPinByCreatedAt();
            setPin(resultPin);

            const resultComment = await commentServices.countCommentByCreatedAt();
            setComment(resultComment);

            const resultLike = await likeServices.countLikeByCreatedAt();
            setLike(resultLike);

            const resultReportComment = await report_commentServices.count();
            setReportComment(resultReportComment);

            const resultReportPin = await report_pinServices.count();
            setReportPin(resultReportPin);

            setLoading(false);
        };
        fetchApi();
    }, []);
    const DATA_STATISTIC = [
        {
            id: '1',
            title: 'Người dùng đăng ký',
            detail: [
                { title: 'Hôm nay', data: user.countDay },
                { title: 'Tuần này', data: user.countWeek },
                { title: 'Tháng này', data: user.countMonth },
                { title: 'Tổng cộng', data: user.countAll },
            ],
        },
        {
            id: '2',
            title: 'Số bài đăng',
            detail: [
                { title: 'Hôm nay', data: pin.countDay },
                { title: 'Tuần này', data: pin.countWeek },
                { title: 'Tháng này', data: pin.countMonth },
                { title: 'Tổng cộng', data: pin.countAll },
            ],
        },
        {
            id: '3',
            title: 'Số lượt yêu thích',
            detail: [
                { title: 'Hôm nay', data: like.countDay },
                { title: 'Tuần này', data: like.countWeek },
                { title: 'Tháng này', data: like.countMonth },
                { title: 'Tổng cộng', data: like.countAll },
            ],
        },
        {
            id: '4',
            title: 'Số lượt bình luận',
            detail: [
                { title: 'Hôm nay', data: comment.countDay },
                { title: 'Tuần này', data: comment.countWeek },
                { title: 'Tháng này', data: comment.countMonth },
                { title: 'Tổng cộng', data: comment.countAll },
            ],
        },
    ];
    const DATA_REPORT = [
        {
            id: '1',
            title: 'Báo cáo (Bài đăng và bình luận)',
            detail: [
                { title: 'Tổng số báo cáo', data: reportPin.countAll + reportComment.countAll },
                {
                    title: 'Báo cáo đang chờ xử lý',
                    data: reportPin.countNotApprovedYet + reportComment.countNotApprovedYet,
                },
                { title: 'Báo cáo đã duyệt', data: reportPin.countApprove + reportComment.countApprove },
            ],
        },
        {
            id: '2',
            title: 'Báo cáo bài đăng',
            detail: [
                { title: 'Tổng số báo cáo', data: reportPin.countAll },
                { title: 'Báo cáo đang chờ xử lý', data: reportPin.countNotApprovedYet },
                { title: 'Báo cáo đã duyệt', data: reportPin.countApprove },
            ],
        },
        {
            id: '3',
            title: 'Báo cáo bình luận',
            detail: [
                { title: 'Tổng số báo cáo', data: reportComment.countAll },
                { title: 'Báo cáo đang chờ xử lý', data: reportComment.countNotApprovedYet },
                { title: 'Báo cáo đã duyệt', data: reportComment.countApprove },
            ],
        },
    ];
    return (
        <div className={cx('wrapper', theme === 'dark' ? 'dark' : '')}>
            <h3 className={cx('title')}>Số liệu thống kê</h3>
            {loading ? (
                <CircularProgress sx={{ display: 'flex', margin: '0 auto' }} />
            ) : (
                <>
                    <ItemStatistic data={DATA_STATISTIC} line={true} />
                    <ItemStatistic data={DATA_REPORT} line={false} />
                </>
            )}
        </div>
    );
}

export default Statistic;
