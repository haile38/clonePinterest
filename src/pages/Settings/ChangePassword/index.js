import classNames from 'classnames/bind';
import styles from './ChangePassword.module.scss';
import LabelTextBox from '../../../components/LabelTextBox';
import Wrapper from '../Wrapper';
import Button from '../../../components/Button';
import { useState, useEffect, useContext } from 'react';
import { getUserById, changeUserPassword } from '../../../services/userServices';
import { AccountLoginContext } from '../../../context/AccountLoginContext';
import ActionAlerts from '../../../components/Alert';
import { ThemeContext } from '../../../context/ThemeContext';
import bcrypt from 'bcryptjs';

const cx = classNames.bind(styles);

function ChangePassword({ admin = false }) {
    const { theme } = useContext(ThemeContext);

    const [changeEmail, setChangeEmail] = useState(false);
    const [changeOldPassword, setChangeOldPassword] = useState(false);
    const [changeNewPassword, setChangeNewPassword] = useState(false);
    const [changeConfirmPassword, setChangeConfirmPassword] = useState(false);

    const [editSuccess, setEditSuccess] = useState(false);
    //Hiển thị hộp thoại thông báo
    const [alertType, setAlertType] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);

    const showAlert = (type) => {
        setAlertType(type);
        setAlertVisible(true);

        const timeoutId = setTimeout(() => {
            setAlertVisible(false);
            setAlertType(null); // Đặt alertType về null khi ẩn thông báo
        }, 2500);

        return timeoutId;
    };

    useEffect(() => {
        if (alertVisible) {
            const timeoutId = setTimeout(() => {
                setAlertVisible(false);
                setAlertType(null); // Đặt alertType về null khi ẩn thông báo
            }, 2500);

            return () => clearTimeout(timeoutId);
        }
    }, [alertVisible]);

    //
    const { userId } = useContext(AccountLoginContext);
    const [userData, setUserData] = useState({});
    const [errorPassword, setErrorPassword] = useState('');
    const [errorNewPassword, setErrorNewPassword] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const handlgetPassword = (value) => {
        setCurrentPassword(value);
    };

    const [newPassword, setNewPassword] = useState('');
    const handlGetnewPassword = (value) => {
        setNewPassword(value);
    };

    const [confirmPassword, setConfirmPassword] = useState('');
    const handlGetconfirmPassword = (value) => {
        setConfirmPassword(value);
    };

    useEffect(() => {
        // Gửi yêu cầu GET để lấy thông tin người dùng
        getUserById(userId)
            .then((response) => {
                setUserData(response);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [userId]);

    const handleErrorPassword = (event) => {
        const currentPasswordFromServer = userData.password;
        if (event.target.value === '') {
            setErrorPassword('');
        } else {
            bcrypt.compare(event.target.value, currentPasswordFromServer, function (err, result) {
                if (result) {
                    setErrorPassword('');
                } else {
                    setErrorPassword('Mật khẩu cũ không chính xác');
                }
            });

            // if (currentPasswordFromServer !== event.target.value) {

            // } else {

            // }
        }
    };

    const handleErrorNewPassword = (event) => {
        if (event.target.value === '') {
            setErrorNewPassword('');
        } else {
            if (event.target.value.length < 8) {
                setErrorNewPassword('Mật khẩu mới phải từ 8 ký tự trở lên');
            } else {
                setErrorNewPassword('');
            }
        }
    };

    const handleErrorConfirmPassword = (event) => {
        if (event.target.value === '') {
            setErrorConfirmPassword('');
        } else {
            if (newPassword !== event.target.value) {
                setErrorConfirmPassword('Mật khẩu nhập lại không chính xác');
            } else {
                setErrorConfirmPassword('');
            }
        }
    };
    const handlePasswordChange = () => {
        setChangeConfirmPassword(true);
        setChangeEmail(true);
        setChangeNewPassword(true);
        setChangeOldPassword(true);
        console.log(currentPassword);
        console.log(newPassword);
        try {
            if (
                errorPassword === '' &&
                errorNewPassword === '' &&
                errorConfirmPassword === '' &&
                currentPassword !== '' &&
                newPassword !== '' &&
                confirmPassword !== ''
            ) {
                changeUserPassword(userId, currentPassword, newPassword)
                    .then((response) => {
                        setEditSuccess(true);
                        showAlert('editSuccess');
                        setNewPassword('');
                        setCurrentPassword('');
                        setConfirmPassword('');
                        setChangeConfirmPassword(false);
                        setChangeNewPassword(false);
                        setChangeOldPassword(false);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        } catch (error) {
            alert(error.message);
            console.log(error);
        }
    };

    return (
        <Wrapper bottom={false} admin={admin}>
            <div className={cx('wrapper')}>
                <div className={cx('container-changepassword')}>
                    <h1 className={cx('Title', theme === 'dark' ? 'dark' : '')}>Đổi mật khẩu</h1>
                    <LabelTextBox
                        className={cx('EmailInfo')}
                        label={'Email'}
                        placeholder={'Email'}
                        selectedSize={'medium'}
                        text={userData.email}
                        change={changeEmail}
                        setChange={setChangeEmail}
                    />
                    <LabelTextBox
                        className={cx('Password')}
                        label={'Mật khẩu cũ'}
                        placeholder={'Mật khẩu cũ'}
                        selectedSize={'medium'}
                        editable={true}
                        type={'password'}
                        text={currentPassword}
                        customGetValue={handlgetPassword}
                        error={errorPassword}
                        onChange={handleErrorPassword}
                        change={changeOldPassword}
                        setChange={setChangeOldPassword}
                    />

                    <LabelTextBox
                        className={cx('Password')}
                        label={'Mật khẩu mới'}
                        placeholder={'Mật khẩu mới'}
                        selectedSize={'medium'}
                        type={'password'}
                        text={newPassword}
                        customGetValue={handlGetnewPassword}
                        error={errorNewPassword}
                        onChange={handleErrorNewPassword}
                        change={changeNewPassword}
                        setChange={setChangeNewPassword}
                    />
                    <LabelTextBox
                        className={cx('Password')}
                        label={'Xác nhận mật khẩu'}
                        placeholder={'Xác nhận mật khẩu'}
                        selectedSize={'medium'}
                        type={'password'}
                        text={confirmPassword}
                        customGetValue={handlGetconfirmPassword}
                        error={errorConfirmPassword}
                        onChange={handleErrorConfirmPassword}
                        change={changeConfirmPassword}
                        setChange={setChangeConfirmPassword}
                    />

                    <Button className={cx('changeBtn')} red onClick={handlePasswordChange}>
                        Đổi mật khẩu
                    </Button>
                </div>
                <div className={cx('image-container')}>
                    <img className={cx('image')} src="../../change-password.png" alt="" />
                </div>
                {alertType === 'editSuccess' && <ActionAlerts severity="success" content={`Thay đổi thành công`} />}
            </div>
        </Wrapper>
    );
}

export default ChangePassword;
