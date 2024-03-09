import classNames from 'classnames/bind';
import styles from './InfoProfile.module.scss';
import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import ChangeAvatar from '../../../components/Popup/ChangeAvatar';
import Image from '../../../components/Image';
import LabelTextBox from '../../../components/LabelTextBox';
import Wrapper from '../Wrapper';
import Button from '../../../components/Button';
import { getUserById, changeUserInfo, ChangeUserAvatar } from '../../../services/userServices';
import axios from 'axios';
import ActionAlerts from '../../../components/Alert';
import { AccountLoginContext } from '../../../context/AccountLoginContext';
import { ThemeContext } from '../../../context/ThemeContext';

const cx = classNames.bind(styles);

function UserProfile({ admin = false }) {
    const { theme } = useContext(ThemeContext);

    const [changeName, setChangeName] = useState(false);
    const [changeIntroduce, setChangeIntroduce] = useState(false);
    const [changeWebsite, setChangeWebsite] = useState(false);
    const [changeUsername, setChangeUsername] = useState(false);

    const { userId } = useContext(AccountLoginContext);
    const [userData, setUserData] = useState({});
    const [saveSuccess, setSaveSuccess] = useState(false);
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

    useEffect(() => {
        // Gửi yêu cầu GET để lấy thông tin người dùng
        getUserById(userId)
            .then((response) => {
                setSaveSuccess(false);
                setUserData(response);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [saveSuccess, userId]);

    const [userFullname, setUserFullname] = useState('');
    useEffect(() => {
        setUserFullname(userData.fullname || '');
    }, [userData]);
    const handlGetUserFullname = (value) => {
        setUserFullname(value);
    };

    const [userIntroduce, setUserIntroduce] = useState('');
    useEffect(() => {
        setUserIntroduce(userData.introduce || '');
    }, [userData]);
    const handlGetUserIntroduce = (value) => {
        setUserIntroduce(value);
    };

    const [userWebsite, setUserWebsite] = useState('');
    useEffect(() => {
        setUserWebsite(userData.website || '');
    }, [userData]);
    const handleGetUserWebsite = (value) => {
        setUserWebsite(value);
    };

    const [username, setUsername] = useState('');
    useEffect(() => {
        setUsername(userData.username || '');
    }, [userData]);
    const handleGetUsername = (value) => {
        setUsername(value);
    };

    const [isPopupVisible, setPopupVisible] = useState(false);

    const [userPhoto, setUserPhoto] = useState(
        'https://i.pinimg.com/140x140_RS/4d/3f/94/4d3f944a16455e5ad198b76ded8be591.jpg',
    );
    const [base64, setBase64] = useState();

    const handleUserphoto = (selectedPhoto) => {
        if (selectedPhoto) {
            console.log(selectedPhoto);
            const imageURL = URL.createObjectURL(selectedPhoto);
            setUserPhoto(imageURL); // Set image URL to state
        }
    };
    const handlePopupClose = () => {
        setPopupVisible(false);
    };
    const handlePopupSave = (selectedPhoto) => {
        handleUserphoto(selectedPhoto);
        setPopupVisible(false);

        axios
            .get(userPhoto, { responseType: 'blob' })
            .then((response) => {
                const blob = response.data;
                const reader = new FileReader();
                reader.onload = () => {
                    const base64String = reader.result.split(',')[1];
                    setBase64(base64String);

                    ChangeUserAvatar(userId, base64String)
                        .then((response) => {
                            if (response) {
                                showAlert('editAvatar');
                                setSaveSuccess(true);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                };
                reader.readAsDataURL(blob);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleSave = () => {
        setChangeIntroduce(true);
        setChangeName(true);
        setChangeWebsite(true);
        setChangeUsername(true);

        let save = false;
        if (admin) {
            if (userFullname !== '' && username !== '') {
                save = true;
            }
        } else {
            if (userFullname !== '' && userIntroduce !== '' && userWebsite !== '' && username !== '') {
                save = true;
            }
        }

        if (save) {
            const updatedUser = {
                fullname: userFullname,
                introduce: userIntroduce,
                website: userWebsite,
                username: username,
            };

            changeUserInfo(userId, updatedUser)
                .then((response) => {
                    showAlert('editSuccess');
                })
                .catch((error) => console.log(error));
        }
    };
    return (
        // userData && (

        <Wrapper onSave={handleSave} admin={admin}>
            <div className={cx('wrapper')}>
                <div className={cx('container-infoProfile')}>
                    <h1 className={cx(theme === 'dark' ? 'dark' : '')}>Chỉnh sửa hồ sơ</h1>
                    <div className={cx('setUserProfilePhoto')}>
                        <div className={cx('UserPhoto')}>
                            <Image src={userData.avatar && `data:image/jpeg;base64,${userData.avatar}`} />
                        </div>
                        <div className={cx('setUserProfilePhoto-btn')}>
                            <Button primary className={cx('changeImageBtn')} onClick={() => setPopupVisible(true)}>
                                Thay đổi
                            </Button>
                            {isPopupVisible && (
                                <ChangeAvatar
                                    onClose={handlePopupClose}
                                    onSave={handlePopupSave}
                                    onSelectImage={handleUserphoto}
                                />
                            )}
                        </div>
                    </div>
                    <div className={cx('name-and-lastname')}>
                        <LabelTextBox
                            placeholder={'Họ và Tên'}
                            label={'Họ Tên'}
                            selectedSize={'medium'}
                            text={userFullname}
                            customGetValue={handlGetUserFullname}
                            change={changeName}
                            setChange={setChangeName}
                        />
                    </div>
                    {admin === false && (
                        <>
                            <LabelTextBox
                                placeholder={'Giới thiệu câu chuyện của bạn'}
                                label={'Giới thiệu'}
                                selectedSize={'large'}
                                text={userIntroduce}
                                customGetValue={handlGetUserIntroduce}
                                change={changeIntroduce}
                                setChange={setChangeIntroduce}
                                area
                            />
                            <LabelTextBox
                                placeholder={'Thêm liên kết để hướng lưu lượng vào trang web'}
                                label={'Trang web'}
                                selectedSize={'medium'}
                                text={userWebsite}
                                customGetValue={handleGetUserWebsite}
                                change={changeWebsite}
                                setChange={setChangeWebsite}
                            />
                        </>
                    )}

                    <LabelTextBox
                        placeholder={'Tên người dùng'}
                        label={'Tên người dùng'}
                        selectedSize={'medium'}
                        text={username}
                        customGetValue={handleGetUsername}
                        change={changeUsername}
                        setChange={setChangeUsername}
                    />
                </div>
                <div className={cx('image-container')}>
                    <img className={cx('image')} src="../../info-profile.png" alt="" />
                </div>
                {alertType === 'editAvatar' && <ActionAlerts severity="success" content={`Lưu ảnh thành công`} />}
                {alertType === 'editSuccess' && <ActionAlerts severity="success" content={`Lưu thành công`} />}
            </div>
        </Wrapper>

        // )
    );
}
export default UserProfile;
