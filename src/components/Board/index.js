import classNames from 'classnames/bind';
import styles from './Board.module.scss';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { EditIcon } from '../Icons';
import Image from '../Image';
import images from '../../assets/images';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function Board({ id, title, detailBoard, accountOther, createdAt, handleEdit }) {
    const [date, setDate] = useState('');
    const handleEditClick = (event) => {
        event.preventDefault();
        handleEdit();
    };
    function calculateTimeDifference(specificDate) {
        const currentDate = new Date();
        specificDate = new Date(specificDate);
        const timeDifference = currentDate.getTime() - specificDate.getTime();

        // Chuyển đổi mili giây thành số ngày
        const daysDifference = timeDifference / (1000 * 3600 * 24);

        return daysDifference;
    }
    function displayTimeDifference(specificDate) {
        const daysDifference = calculateTimeDifference(specificDate);

        if (daysDifference >= 7 && daysDifference < 30) {
            const weeks = Math.floor(daysDifference / 7);
            setDate(`${weeks} tuần`);
            // console.log(`Số tuần kể từ ngày cụ thể là: ${weeks} tuần`);
        } else if (daysDifference >= 30) {
            const months = Math.floor(daysDifference / 30);
            setDate(`${months} tháng`);
            // console.log(`Số tháng kể từ ngày cụ thể là: ${months} tháng`);
        } else {
            setDate(`${daysDifference.toFixed(0)} ngày`);
            // console.log(`Số ngày kể từ ngày cụ thể là: ${daysDifference.toFixed(0)} ngày`);
        }
    }
    useEffect(() => {
        console.log('createdAt:' + createdAt);
        displayTimeDifference(createdAt);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createdAt]);

    return (
        detailBoard && (
            <Link to={`/thuyngocmaithyy/board/${id}`} className={cx('wrapper')}>
                <div className={cx('container-image')}>
                    <div className={cx('images')}>
                        <div className={cx('image-left')}>
                            <Image
                                fallback={images.backgroundGray}
                                className={cx('image-left')}
                                src={detailBoard[0] !== undefined ? `data:image/jpeg;base64,${detailBoard[0]}` : ''}
                                alt=""
                            />
                        </div>

                        <div className={cx('images-right')}>
                            <div className={cx('image-right')}>
                                <Image
                                    fallback={images.backgroundGray}
                                    src={detailBoard[1] !== undefined ? `data:image/jpeg;base64,${detailBoard[1]}` : ''}
                                    alt=""
                                />
                            </div>
                            <div className={cx('image-right')}>
                                <Image
                                    fallback={images.backgroundGray}
                                    src={detailBoard[2] !== undefined ? `data:image/jpeg;base64,${detailBoard[2]}` : ''}
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                    {accountOther ? null : (
                        <div className={cx('option')}>
                            <Tippy delay={[0, 100]} content="Chỉnh sửa" placement="bottom">
                                <button className={cx('editBtn')} onClick={handleEditClick}>
                                    <EditIcon className={cx('action', 'gUZ', 'R19', 'U9O', 'kVc')} />
                                </button>
                            </Tippy>
                        </div>
                    )}
                </div>
                <div className={cx('info-board')}>
                    <h2 className={cx('title')}>{title}</h2>
                    <span className={cx('quantity-pin')}>{detailBoard.length} ghim</span>

                    <span className={cx('time-created')}>{date}</span>
                </div>
            </Link>
        )
    );
}

export default Board;
