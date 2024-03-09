import classNames from 'classnames/bind';
import styles from './Settings.module.scss';
import SideBar from '../../components/SideBar';
import BottomBar from '../../components/BottomBar';
import { UserIcon, AccountSettingIcon, KeyIcon } from '../../components/Icons';
import { useContext, useEffect, useState } from 'react';
import { AccountLoginContext } from '../../context/AccountLoginContext';
import { getUserById } from '../../services/userServices';

const cx = classNames.bind(styles);

function Wrapper({ children, bottom = true, admin = false, onSave }) {
    const { userId } = useContext(AccountLoginContext);
    const [user, setUser] = useState({});

    useEffect(() => {
        // Gửi yêu cầu GET để lấy thông tin người dùng
        getUserById(userId)
            .then((response) => {
                setUser(response);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [userId]);

    const SideBarItems = [
        {
            title: 'Chỉnh sửa hồ sơ',
            to: admin ? `/admin/${user.username}/edit-profile` : `/${user.username}/edit-profile`,
            icon: <UserIcon />,
        },
        {
            title: 'Quản lý tài khoản',
            to: admin ? `/admin/${user.username}/account-setting` : `/${user.username}/account-setting`,
            icon: <AccountSettingIcon />,
        },
        {
            title: 'Đổi mật khẩu',
            to: admin ? `/admin/${user.username}/password` : `/${user.username}/password`,
            icon: <KeyIcon />,
        },
    ];

    return (
        <>
            <div className={cx('wrapper')}>
                <SideBar SideBarItems={SideBarItems} />
                {children}
            </div>
            {bottom && <BottomBar onSave={onSave} />}
        </>
    );
}
export default Wrapper;
