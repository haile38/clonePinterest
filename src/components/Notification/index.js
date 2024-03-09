import classNames from 'classnames/bind';
import React from 'react';
import styles from './Notification.module.scss';

const cx = classNames.bind(styles);

function Notification() {
    return (
        <div className={cx('notification')}>
            <div className={cx('information')}>
                <p> Đã lưu vào </p>
                <p>
                    <b> Hồ sơ </b>
                </p>
            </div>
            {/* <button className={cx('click')}>Hoàn tác</button> */}
        </div>
    );
}
export default Notification; 
