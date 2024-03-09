import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import 'tippy.js/dist/tippy.css';
import { notificationDeleted } from '../../../services/notificationService';
import Cards from './Card';
import styles from './NotificationPopper.module.scss';

const cx = classNames.bind(styles);

function NotificationCard({ time, detail, id, type }) {
    const [appear, setAppear] = useState(true);
    const contents = [
        {
            content: <Cards detail={detail.user} title="đã thích bài đăng của bạn" />,
            link: '/pin/' + (detail !== undefined) ? detail.id : '',
        },
        { content: <Cards detail={detail.user} title="đã bình luận về bài đăng của bạn" /> },
        {
            content: (
                <Cards
                    detail={detail.user1}
                    title={
                        detail.status === 'ACCEPTED'
                            ? ' đã chấp nhận lời mời kết bạn của bạn'
                            : 'đã gửi cho bạn lời mời kết bạn'
                    }
                />
            ),
            link: '/friendship/' + detail.id,
        },
    ];

    // Xóa thông báo
    const handleDelete = (e) => {
        e.preventDefault();
        setAppear(false);
        console.log('===========================:' + id);
        notificationDeleted(id);
    };
    const renderResult = (attrs) => {
        return (
            <div className={cx('menu-list')} tabIndex="-1" {...attrs}>
                {/* <Popper className={cx('menu-popper')}> */}
                <div className={cx('menu-body')}>
                    <button className={cx('button-action')} onClick={handleDelete}>
                        Xóa
                    </button>
                </div>
                {/* </Popper> */}
            </div>
        );
    };

    switch (type) {
        // Tùy thuộc theo loại mà detail sẽ mang theo những biến detail tương ứng
        case 'Like':
            type = { ...contents[0], link: '/pin/' + detail.pin.id || '' };
            break;
        case 'Comment':
            type = { ...contents[1], link: '/pin/' + detail.pin.id || '' };
            break;
        case 'Friend':
            type = contents[2];
            break;
        default:
            type = {
                content: (
                    <div className={cx('images')}>
                        {detail.slice(0, 3).map((detail, key) => (
                            <img src={detail.image && `data:image/jpeg;base64,${detail.image}`} key={key} alt="" />
                        ))}
                    </div>
                ),
                title: 'Ghim lấy cảm hứng từ bạn',
                link: '/news_hub/' + id,
            };
    }
    return (
        appear && (
            <div className={cx('wrapper-card')}>
                <Link to={type.link}>
                    <div className={cx('info')}>
                        <div>
                            {type.title} <div className={cx('time')}>{time}</div>
                        </div>
                        <Tippy
                            interactive
                            delay={[0, 200]}
                            offset={[0, 5]}
                            placement="bottom-end"
                            render={renderResult}
                            animation={false}
                        >
                            <button
                                className={cx('action')}
                                onClick={(event) => {
                                    event.preventDefault();
                                }}
                            >
                                <FontAwesomeIcon icon={faEllipsis} />
                            </button>
                        </Tippy>
                    </div>
                    <div className={cx('content')}>{type.content}</div>
                </Link>
            </div>
        )
    );
}

NotificationCard.propTypes = {
    id: PropTypes.number,
};
export default NotificationCard;
