import { faMagnifyingGlass, faArrowRightFromBracket, faChevronDown, faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Switch from '@mui/material/Switch';
import classNames from 'classnames/bind';
import { memo, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../../config';
import { AccountLoginContext } from '../../../context/AccountLoginContext';
import { ThemeContext } from '../../../context/ThemeContext';
import { getUserById } from '../../../services/userServices';
import Button from '../../Button';
import { MessageContext } from '../../../context/MessageContext';
import DialogConfirmLogin from '../../DialogConfirmLogin';
import { LogoPinterest, MessageIcon, NotificationIcon } from '../../Icons';
import Image from '../../Image';
import NavMenu from '../../NavMenu';
import Popper from '../../Popper';
import ConversationPopper from '../../Popper/ConversationPopper';
import NotificationPopper from '../../Popper/NotificationPopper';
import MenuSettingHeader from '../../Popup/MenuSettingHeader';
import Search from '../../Search';
import SearchPopup from '../../Popup/SearchPopup';
import styles from './HeaderDefault.module.scss';

const cx = classNames.bind(styles);
const label = { inputProps: { 'aria-label': 'Switch demo' } };

function HeaderDefault() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { userId } = useContext(AccountLoginContext);
    const [user, setUser] = useState({});
    const [userLoaded, setUserLoaded] = useState(false);
    const [openConfirmLogin, setOpenConfirmLogin] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);
    const { messageCount } = useContext(MessageContext);

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

    let MENU_ITEMS;
    // MENU KHI CHƯA ĐĂNG NHẬP
    if (screenWidth < 880) {
        MENU_ITEMS = [
            {
                icon: <FontAwesomeIcon icon={faMagnifyingGlass} />,
                title: 'Tìm kiếm',
                handleClickMenuItem: () => {
                    setOpenSearch(true);
                },
            },
            {
                icon: <FontAwesomeIcon icon={faMoon} />,
                switchToggle: <Switch checked={!!(theme === 'dark')} {...label} onChange={toggleTheme} />,
                title: 'Dark Mode',
            },
        ];
    } else {
        MENU_ITEMS = [
            {
                icon: <FontAwesomeIcon icon={faMoon} />,
                switchToggle: <Switch checked={!!(theme === 'dark')} {...label} onChange={toggleTheme} />,
                title: 'Dark Mode',
            },
        ];
    }

    useEffect(() => {
        // Gửi yêu cầu GET để lấy thông tin người dùng
        if (userId !== 0) {
            getUserById(userId)
                .then((response) => {
                    setUser(response);
                    // console.log(response);
                    setUserLoaded(true);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [userId]);

    const handleMenuChange = (menuItem) => {
        console.log(menuItem);
    };

    // LOGOUT
    function logout() {
        localStorage.removeItem('userLogin');
        navigate('/login');
    }
    // MENU SAU KHI ĐĂNG NHẬP
    const userMenu = [
        ...MENU_ITEMS,
        {
            icon: <FontAwesomeIcon icon={faArrowRightFromBracket} />,
            title: 'Log out',
            handleClickMenuItem: logout,
            separate: true,
        },
    ];

    const menuNavbarLeft = [
        {
            title: 'Home',
            to: config.routes.home,
        },
        {
            title: 'Create',
            to: config.routes.create,
            handleClick: userId !== 0 ? null : () => setOpenConfirmLogin(true),
        },
    ];

    return (
        <header className={cx('wrapper', theme === 'dark' ? 'dark' : '')}>
            <div className={cx('inner')}>
                {/* LOGO */}
                <div className={cx('container-left')}>
                    <Link to={config.routes.home} className={cx('logo-link')}>
                        <LogoPinterest className={cx('logo', theme === 'dark' ? 'dark' : '')} />
                    </Link>

                    <NavMenu className={cx('nav-menu')} menu={menuNavbarLeft} />
                </div>
                {/* THANH TÌM KIẾM */}
                <Search width={screenWidth < 1030 ? '500px' : '730px'} display={screenWidth < 880 ? 'none' : 'block'} />

                {/* ACTIONS */}
                <div className={cx('actions')}>
                    {userLoaded && (
                        <>
                            <Popper
                                news={0}
                                title={<NotificationIcon className={cx('action', theme === 'dark' ? 'dark' : '')} />}
                                body={<NotificationPopper />}
                                widthBody="maxContent"
                            />
                            <Popper
                                title={
                                    <MessageIcon
                                        newMessageCount={messageCount.state}
                                        className={cx('action', theme === 'dark' ? 'dark' : '')}
                                    />
                                }
                                body={<ConversationPopper />}
                                left="-48px"
                                widthBody="maxContent"
                            />
                            <Link className={cx('link-avatar')} to={`/${user.username}`}>
                                <Image
                                    src={user.avatar && `data:image/jpeg;base64,${user.avatar}`}
                                    className={cx('action', 'user-avatar', theme === 'dark' ? 'dark' : '')}
                                    alt={user.username}
                                />
                            </Link>
                        </>
                    )}

                    {userId === 0 && (
                        <Button style={{ marginRight: '10px' }} red to={config.routes.login}>
                            Login
                        </Button>
                    )}

                    <MenuSettingHeader
                        className={cx('action')}
                        items={userId === 0 ? MENU_ITEMS : userMenu}
                        onChange={handleMenuChange}
                    >
                        <button className={cx('more-btn', theme === 'dark' ? 'dark' : '')}>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </button>
                    </MenuSettingHeader>
                </div>
            </div>
            {openConfirmLogin && <DialogConfirmLogin open={openConfirmLogin} setOpen={setOpenConfirmLogin} />}
            {openSearch && (
                <SearchPopup
                    onClose={() => {
                        setOpenSearch(false);
                    }}
                />
            )}
        </header>
    );
}
export default memo(HeaderDefault);
