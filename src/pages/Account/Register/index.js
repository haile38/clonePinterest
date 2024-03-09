import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../Account.module.scss';
import LabelTextBox from '../../../components/LabelTextBox';
import Wrapper from '../Wrapper';
import Button from '../../../components/Button';
import * as userServices from '../../../services/userServices';
import { ThemeContext } from '../../../context/ThemeContext';
import ActionAlerts from '../../../components/Alert';

// logout xử lý ở phần header
const cx = classNames.bind(styles);

function Register() {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    // Sử dụng useEffect để theo dõi thay đổi của screenWidth
    useEffect(() => {
        // Hàm xử lý khi screenWidth thay đổi
        function handleResize() {
            setScreenWidth(window.innerWidth);
        }

        // Thêm một sự kiện lắng nghe sự thay đổi của cửa sổ
        window.addEventListener('resize', handleResize);

        // Loại bỏ sự kiện lắng nghe khi component bị hủy
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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

    const { theme } = useContext(ThemeContext);
    const [changeFirstname, setChangeFirstname] = useState(false);
    const [changeLastname, setChangeLastname] = useState(false);
    const [changeEmail, setChangeEmail] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [changeConfirmPassword, setChangeConfirmPassword] = useState(false);

    //xử lý nhập email
    const [errorEmail, setErrorEmail] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');

    const handlgetEmail = (value) => {
        setCurrentEmail(value);
    };

    const handleErrorEmail = async (event) => {
        const checkEmail = await userServices.getAllUserByEmail(event.target.value);

        if (event.target.value === '') {
            setErrorEmail('');
        } else {
            if (checkEmail !== 0) {
                setErrorEmail('Email đã tồn tại');
            } else {
                setErrorEmail('');
            }
        }
    };

    //xử lý nhập mật khẩu
    const [errorPassword, setErrorPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    const handlgetPassword = (value) => {
        setCurrentPassword(value);
    };

    const handleErrorPassword = async (event) => {
        if (event.target.value === '') {
            setErrorPassword('');
        } else {
            if (event.target.value.length < 8) {
                setErrorPassword('Mật khẩu phải từ 8 ký tự trở lên');
            } else {
                setErrorPassword('');
            }
        }
    };

    //xử lý nhập mật khẩu mới
    const [errorConfirmPassword, setErrorConfirmPassword] = useState('');
    const [currentConfirmPassword, setCurrentConfirmPassword] = useState('');

    const handlgetConfirmPassword = (value) => {
        setCurrentConfirmPassword(value);
    };

    const handleErrorConfirmPassword = async (event) => {
        if (event.target.value === '') {
            setErrorConfirmPassword('');
        } else {
            if (currentPassword !== event.target.value) {
                setErrorConfirmPassword('Mật khẩu nhập lại không chính xác');
            } else {
                setErrorConfirmPassword('');
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setChangeFirstname(true);
        setChangeLastname(true);
        setChangeEmail(true);
        setChangePassword(true);
        setChangeConfirmPassword(true);

        const email = currentEmail !== '' ? currentEmail : null;
        const password = currentPassword !== '' ? currentPassword : null;
        const firstName = event.target.elements.firstName.value !== '' ? event.target.elements.firstName.value : null;
        const lastName = event.target.elements.lastName.value !== '' ? event.target.elements.lastName.value : null;
        const birthdate = event.target.elements.birthdate.value !== '' ? event.target.elements.birthdate.value : null;
        const fullname = firstName + ' ' + lastName;

        if (
            firstName !== null &&
            lastName !== null &&
            errorEmail === '' &&
            errorPassword === '' &&
            errorConfirmPassword === ''
        ) {
            // Tạo đối tượng người dùng từ thông tin nhập
            const userSave = {
                email: email,
                username: email.split('@')[0],
                fullname: fullname,
                birthdate: birthdate,
                password: password,
                introduce: null,
                avatar: '',
                website: null,
                gender: null,
                language: null,
                privateBool: false,
                createdAt: null,
            };

            // Gửi yêu cầu đăng ký đến máy chủ
            try {
                const response = await userServices.save(userSave);

                if (response) {
                    showAlert('registerSuccess');
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        }
    };

    return (
        <Wrapper style={{ display: screenWidth < 1145 ? 'none' : 'block' }}>
            <div className={cx('container-form', theme === 'dark' ? 'dark' : '')}>
                <h1 className={cx('title')}>Register account</h1>

                <form onSubmit={handleSubmit}>
                    <div className={cx('infomation')}>
                        <div className={cx('container-input')}>
                            <LabelTextBox
                                placeholder={'First Name'}
                                name={'firstName'}
                                label={'First Name'}
                                selectedSize={'small'}
                                change={changeFirstname}
                                setChange={setChangeFirstname}
                            />
                            <LabelTextBox
                                placeholder={'Last Name'}
                                name={'lastName'}
                                label={'Last Name'}
                                selectedSize={'small'}
                                change={changeLastname}
                                setChange={setChangeLastname}
                            />
                        </div>
                        <div className={cx('container-input')}>
                            <LabelTextBox
                                placeholder={'Email'}
                                name={'email'}
                                label={'Email'}
                                selectedSize={'small'}
                                error={errorEmail}
                                onChange={handleErrorEmail}
                                text={currentEmail}
                                customGetValue={handlgetEmail}
                                change={changeEmail}
                                setChange={setChangeEmail}
                            />
                            <LabelTextBox
                                placeholder={'Birthdate'}
                                name={'birthdate'}
                                label={'Birthdate'}
                                type={'date'}
                                selectedSize={'small'}
                            />
                        </div>
                        <div className={cx('container-input')}>
                            <LabelTextBox
                                placeholder={'Password'}
                                name={'password'}
                                type={'password'}
                                label={'Pasword'}
                                selectedSize={'small'}
                                error={errorPassword}
                                onChange={handleErrorPassword}
                                text={currentPassword}
                                customGetValue={handlgetPassword}
                                change={changePassword}
                                setChange={setChangePassword}
                            />
                            <LabelTextBox
                                placeholder={'Confirm pasword'}
                                name={'confirmPassword'}
                                type={'password'}
                                label={'Confirm password'}
                                selectedSize={'small'}
                                error={errorConfirmPassword}
                                onChange={handleErrorConfirmPassword}
                                text={currentConfirmPassword}
                                customGetValue={handlgetConfirmPassword}
                                change={changeConfirmPassword}
                                setChange={setChangeConfirmPassword}
                            />
                        </div>
                    </div>

                    <div className={cx('submit-btn')}>
                        <Button primary={theme === 'dark' ? true : false} red={theme === 'dark' ? false : true}>
                            Register
                        </Button>
                    </div>
                </form>
            </div>
            {alertType === 'registerSuccess' && (
                <ActionAlerts severity="success" content={'Đăng ký tài khoản thành công'} />
            )}
        </Wrapper>
    );
}

export default Register;
