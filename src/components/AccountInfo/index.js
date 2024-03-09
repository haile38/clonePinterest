import 'tippy.js/dist/tippy.css';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import Image from '../../components/Image';
import styles from './AccountInfo.module.scss';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const cx = classNames.bind(styles);

function AccountInfo({ userImage, username, width = '32px', fontSize = '1.4rem', fontWeight = 'medium' }) {
    const { theme } = useContext(ThemeContext);
    return (
        username && (
            <div className={cx('info-user')}>
                <Link className={cx('link-avatar')} to={`/${username}`}>
                    <Image
                        style={{ width: width, height: width }}
                        src={userImage && `data:image/jpeg;base64,${userImage}`}
                        className={cx('user-avatar')}
                        alt={username}
                    />
                    <span
                        style={{ fontSize: fontSize, fontWeight: fontWeight }}
                        className={cx('username', theme === 'dark' ? 'dark' : '')}
                    >
                        {username}
                    </span>
                </Link>
            </div>
        )
    );
}

export default AccountInfo;
