import classNames from 'classnames/bind';
import 'tippy.js/dist/tippy.css';
import styles from './NotificationPopper.module.scss';
import Image from '../../Image';

const cx = classNames.bind(styles);

function Card({ detail, title }) {
    return (
        <div className={cx('card')}>
            <div>
                <Image
                    className={cx('avatar')}
                    src={detail.avatar && `data:image/jpeg;base64,${detail.avatar}`}
                    alt={detail.username}
                />
            </div>
            <span style={{ margin: '0px 8px' }}>
                <b>{detail.fullname}</b> {title}
            </span>
        </div>
    );
}
export default Card;
