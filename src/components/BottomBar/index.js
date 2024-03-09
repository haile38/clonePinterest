import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import styles from './BottomBar.module.scss';
import Button from '../Button';
import { ThemeContext } from '../../context/ThemeContext';

const cx = classNames.bind(styles);

function BottomBar({ onSave }) {
    const { theme } = useContext(ThemeContext);
    const refreshPage = () => {
        window.location.reload();
    };

    return (
        <div className={cx('bot-bar', theme === 'dark' ? 'dark' : '')}>
            <Button primary onClick={refreshPage}>
                Thiết lập lại
            </Button>
            <Button className={cx('saveBtn')} red onClick={onSave}>
                Lưu
            </Button>
        </div>
    );
}

export default BottomBar;
