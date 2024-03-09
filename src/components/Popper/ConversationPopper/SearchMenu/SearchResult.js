import classNames from 'classnames/bind';
import styles from './SearchMenu.module.scss';
import Image from '../../../Image';
import { useContext } from 'react';
import { ThemeContext } from '../../../../context/ThemeContext';

const cx = classNames.bind(styles);
function SearchResult({ handleSelect, user }) {
    const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark' ? 'dark' : '';
    return (
        <div className={cx('search-card-container', isDarkMode)} onClick={() => handleSelect(user.id)}>
            <Image src={user.avatar && `data:image/jpeg;base64,${user.avatar}`} className={cx('user-avatar')}></Image>
            <div className={cx('user-names-container', isDarkMode)}>
                <h4 className={cx('user-fullname', isDarkMode)}>{user.fullname}</h4>
                <span className={cx('user-username', isDarkMode)}>{user.username}</span>
            </div>
        </div>
    );
}

export default SearchResult;
