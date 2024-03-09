import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import React, { useContext, useEffect, useState } from 'react';
import styles from './Create.module.scss';
import AccountInfo from '../../components/AccountInfo';
import Button from '../../components/Button';
import LoadImage from '../../components/LoadImage';
import Popper from '../../components/Popper';
import SelectTypePopper from '../../components/Popper/SelectTypePopper';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import ActionAlerts from '../../components/Alert';
import * as userServices from '../../services/userServices';
import * as pinServices from '../../services/pinServices';
import { AccountLoginContext } from '../../context/AccountLoginContext';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import LabelTextBox from '../../components/LabelTextBox';
import * as typeServices from '../../services/typeServices';
import { ThemeContext } from '../../context/ThemeContext';

const cx = classNames.bind(styles);

function Create() {
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

    const { theme } = useContext(ThemeContext);

    const [changeName, setChangeName] = useState(false);

    const { userId } = useContext(AccountLoginContext);
    //select board
    const [activeOptionTop, setActiveOptionTop] = useState(false);
    const [createSuccess, setCreateSuccess] = useState(false);

    const handleClickAway = () => {
        setActiveOptionTop(false);
    };
    const handleDisplay = () => {
        setActiveOptionTop(true);
    };

    // HandleChooseType
    const [currentType, setType] = useState({ typeName: 'Chọn Thể Loại' });
    const handleChooseType = (currentType) => {
        setType(currentType);
    };
    //submit create type
    const handleSubmitCreate = async (event) => {
        event.preventDefault();

        setChangeName(true);

        const typeName = event.target.elements.typeName.value !== '' ? event.target.elements.typeName.value : null;

        const type = {
            typeName,
        };

        if (typeName !== null) {
            const result = await typeServices.add(type);
            if (result) {
                setCreateSuccess(true);
                setShowCreateType(false);
                showAlert('createType');
            }
        } else {
            showAlert('errorInfo');
        }
    };
    //count length
    const [valContent, setValContent] = useState('');
    const handleCountContent = (e) => {
        setValContent(e.target.value);
    };

    const [valTitle, setValTitle] = useState('');
    const handleCountTitle = (e) => {
        setValTitle(e.target.value);
    };
    // Get IMG from LoadImage
    const [imagePin, setImagePin] = useState('');
    const [base64, setBase64] = useState('');

    const handleChangeImage = (selectedPhoto) => {
        if (selectedPhoto) {
            const imageURL = URL.createObjectURL(selectedPhoto);
            setImagePin(imageURL); // Set image URL to state
        }
    };

    //save pin
    const handleInsertPin = async () => {
        const user = await userServices.getUserById(userId);
        let base64String = '';
        if (imagePin !== '') {
            axios
                .get(imagePin, { responseType: 'blob' })
                .then((response) => {
                    const blob = response.data;
                    const reader = new FileReader();
                    reader.onload = async () => {
                        base64String = reader.result.split(',')[1];
                        setBase64(base64String);
                        const image = base64String;
                        setType(currentType);
                        const type = currentType;
                        const title = valTitle;
                        const description = valContent;
                        let createdAt = new Date();
                        createdAt = createdAt.toISOString();
                        const link = null;

                        if (image && type.typeName !== 'Chọn Thể Loại' && title && description) {
                            const pin = {
                                createdAt,
                                description,
                                image,
                                link,
                                title,
                                type,
                                user,
                            };
                            console.log(pin);
                            const result = await pinServices.save(pin);
                            if (result) {
                                showAlert('save');
                                setTimeout(() => {
                                    showAlert('save');
                                }, 4500);
                                window.location.reload(); //reload để xóa dữ liệu
                            }
                        } else {
                            showAlert('errorInfo');
                        }
                    };
                    reader.readAsDataURL(blob);
                })
                .catch((error) => {
                    showAlert('errorImage');
                });
        } else {
            showAlert('errorImage');
        }
    };
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

    // Turn on CreateType
    const [showCreateType, setShowCreateType] = React.useState(false);

    const handleTurnOnCreateType = (isShown) => {
        setShowCreateType(isShown);
    };
    const handleCloseCreate = () => {
        setShowCreateType(false);
    };

    //auto resize textarea
    const titleRef = React.useRef();
    const contentRef = React.useRef();
    const [value, setValue] = React.useState();
    const onChange = (event) => {
        setValue(event.target.value);
    };
    const autoResize = (ref) => {
        if (ref && ref.current) {
            ref.current.style.height = '0px';
            const taHeight = ref.current.scrollHeight;
            ref.current.style.height = taHeight + 'px';
        }
    };
    React.useEffect(() => {
        autoResize(titleRef);
        autoResize(contentRef);
    }, [value]);

    const [user, setUser] = React.useState();
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        // Gửi yêu cầu GET để lấy thông tin người dùng
        if (userId !== 0) {
            userServices
                .getUserById(userId)
                .then((response) => {
                    setUser(response);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [userId]);

    return (
        <div className={cx('wrapper-createPage')}>
            <div className={cx('createBox', theme === 'dark' ? 'dark' : '')}>
                <div className={cx('wrapperBtns')}>
                    <div className={cx('save-pin')}>
                        <Button className={cx('save-btn')} onClick={() => handleInsertPin()} red>
                            Lưu
                        </Button>
                    </div>
                </div>
                {/* end header  */}
                <div className={cx('mainContent')}>
                    <LoadImage
                        className={cx('loadimage')}
                        height={screenWidth < 500 ? '400px' : '565px'}
                        width={
                            screenWidth < 1015
                                ? screenWidth > 830
                                    ? '270px'
                                    : screenWidth < 500
                                    ? '240px'
                                    : '355px'
                                : '355px'
                        }
                        onSelectImage={handleChangeImage}
                    ></LoadImage>
                    {/* end upload IMG */}
                    <div className={cx('insertData')}>
                        <div className={cx('title')}>
                            <textarea
                                className={cx('inputTitle', theme === 'dark' ? 'dark' : '')}
                                type="text"
                                placeholder="Tạo tiêu đề"
                                maxLength="100"
                                rows="1"
                                ref={titleRef}
                                onChange={(e) => {
                                    handleCountTitle(e);
                                    onChange(e);
                                }}
                                value={valTitle}
                            ></textarea>
                            <div className={cx('line')}></div>
                            <div className={cx('hidden-length', 'hidenTitle')}>
                                <p className={cx('hiddenText-title')}>
                                    40 ký tự đầu tiên của bạn là nội dung thường xuất hiện trong bảng tin
                                </p>
                                <p className={cx('titleLength')}>{100 - valTitle.length}</p>
                            </div>
                        </div>
                        <div className={cx('container-user')}>
                            {loading === false && <AccountInfo userImage={user.avatar} username={user.username} />}
                        </div>

                        <div className={cx('content')}>
                            <textarea
                                className={cx('inputContent', theme === 'dark' ? 'dark' : '')}
                                type="text"
                                placeholder="Cho mọi người biết Ghim của bạn giới thiệu điều gì"
                                maxLength="500"
                                ref={contentRef}
                                rows="1"
                                onChange={(e) => {
                                    handleCountContent(e);
                                    onChange(e);
                                }}
                                value={valContent}
                            ></textarea>
                            <div className={cx('line')}></div>
                            <div className={cx('hidden-length', 'hidenContent')}>
                                <p className={cx('hiddenText-content')}>
                                    Mọi người thường sẽ thấy 50 ký tự đầu tiên khi họ nhấp vào Ghim của bạn
                                </p>
                                <p className={cx('titleLength')}>{500 - valContent.length}</p>
                            </div>
                        </div>
                        {/* select type */}
                        <div className={cx('selectType', { active: activeOptionTop })}>
                            <ClickAwayListener onClickAway={handleClickAway}>
                                <button
                                    className={cx('select-type-btn', theme === 'dark' ? 'dark' : '')}
                                    onClick={() => handleDisplay()}
                                >
                                    <Popper
                                        // idPopper={id}
                                        contentTitle={currentType.typeName}
                                        title={<FontAwesomeIcon icon={faChevronDown} />}
                                        className={cx('select-type')}
                                        body={
                                            <SelectTypePopper
                                                handleTurnOnCreateType={handleTurnOnCreateType}
                                                handleChooseType={handleChooseType}
                                            />
                                        }
                                        widthBody="maxContent"
                                    />
                                </button>
                            </ClickAwayListener>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog
                className={cx(theme === 'dark' ? 'dark' : '')}
                fullWidth={true}
                maxWidth="sm"
                open={showCreateType}
                onClose={handleCloseCreate}
            >
                <form onSubmit={handleSubmitCreate}>
                    <DialogTitle sx={{ marginTop: '10px', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}>
                        Thêm loại bài đăng
                    </DialogTitle>
                    <DialogContent>
                        <LabelTextBox
                            name={'typeName'}
                            placeholder={'Tên loại'}
                            label={'Tên loại'}
                            selectedSize={screenWidth < 650 ? 'medium' : 'medium2'}
                            change={changeName}
                            setChange={setChangeName}
                        />
                    </DialogContent>
                    <DialogActions sx={{ marginBottom: '10px' }}>
                        <Button style={{ fontSize: '14px' }} type="button" onClick={handleCloseCreate}>
                            Hủy
                        </Button>
                        <Button style={{ fontSize: '14px' }} red type="submit">
                            Tạo
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {alertType === 'save' && <ActionAlerts severity="success" content={`Tạo thành công`} />}
            {alertType === 'createType' && <ActionAlerts severity="success" content={`Đã thêm thể loại`} />}
            {alertType === 'errorImage' && <ActionAlerts severity="error" content={`Bạn chưa chọn hình ảnh`} />}
            {alertType === 'errorInfo' && <ActionAlerts severity="error" content={`Nhập đầy đủ thông tin`} />}
        </div>
    );
}

export default Create;
