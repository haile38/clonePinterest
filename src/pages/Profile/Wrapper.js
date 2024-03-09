import { CircularProgress } from '@mui/material';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { memo, useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Image from '../../components/Image';
import NavMenu from '../../components/NavMenu';
import SharePopper from '../../components/Popper/SharePopper';
import Popper from '../../components/Popper';
import FriendRequest from '../../components/Popup/FriendRequest';
import ListFriend from '../../components/Popup/ListFriend';
import { AccountLoginContext } from '../../context/AccountLoginContext';
import { AccountOtherContext } from '../../context/AccountOtherContext';
import { StompContext } from '../../context/StompContext';
import { ThemeContext } from '../../context/ThemeContext';
import * as friendshipServices from '../../services/friendshipServices';
import * as userServices from '../../services/userServices';
import styles from './Profile.module.scss';

const cx = classNames.bind(styles);

function Wrapper({ children, className }) {
    const navigate = useNavigate();
    const { stompClient } = useContext(StompContext);
    const { theme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState({});
    const [countFriend, setCountFriend] = useState(null);
    const [countRequest, setCountRequest] = useState(null);
    const [renderFriend, setRenderFriend] = useState(false);
    const [renderFriendRequest, setRenderFriendRequest] = useState(false);
    const [statusFriend, setSatusFriend] = useState('');
    const [frienshipCurrent, setFriendshipCurrent] = useState(false);
    const [updateFriend, setUpdateFriend] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const { userId } = useContext(AccountLoginContext);

    const { accountOther, handleAccount } = useContext(AccountOtherContext);

    const location = useLocation();
    const pathname = location.pathname.split('/')[1];

    handleAccount();
    useEffect(() => {
        const fetchApi = async () => {
            const resultInfo = await userServices.getUserByUsername(pathname);
            //check status friend
            if (resultInfo !== '') {
                if (accountOther) {
                    // console.log('resultInfo.privateBool:::' + resultInfo);
                    if (resultInfo.privateBool === true) {
                        navigate(-1);
                    } else {
                        const id2 = resultInfo.id;
                        const id1 = userId;
                        const checkFriend = await friendshipServices.checkFriend(id1, id2);

                        if (checkFriend !== undefined && checkFriend !== '') {
                            setSatusFriend(checkFriend.status);
                            setFriendshipCurrent(checkFriend);
                        }
                    }
                }
                //set info user

                const resultFriend = await friendshipServices.getCountFriend(resultInfo.id);
                const resultRequest = await friendshipServices.getListRequest(resultInfo.id);

                setInfo(resultInfo);
                setCountFriend(resultFriend);
                setCountRequest(resultRequest.length);
                setLoading(false);
                setUpdateFriend(false);
            } else {
                navigate(-1);
            }
        };

        fetchApi();
    }, [pathname, accountOther, userId, handleAccount, updateFriend, updateSuccess, renderFriend, renderFriendRequest]);

    const handleRenderFriend = () => {
        setRenderFriend(true);
    };

    const handleClose = () => {
        setRenderFriend(false);
    };
    const handleRenderFriendRequest = () => {
        setRenderFriendRequest(true);
    };

    const handleCloseRequest = () => {
        setRenderFriendRequest(false);
    };

    const handleAcceptFriend = async () => {
        const status = 'ACCEPTED';
        const user1 = await userServices.getUserById(userId); //User đang login
        const user2 = await userServices.getUserByUsername(pathname); //User nhận lời mời

        setSatusFriend('ACCEPTED');
        const data = JSON.stringify({
            notifications: { notificationType: 'Friend' },
            friendships: { status, user1: { id: user1.id }, user2: { id: user2.id } },
        });
        setFriendshipCurrent(data.friendships);
        console.log('data.friendships:' + data);
        stompClient.send(`/app/sendNot/${user2.id}`, {}, data);
        setUpdateSuccess(true);
        setUpdateFriend(true);
    };

    const menuPins = [
        {
            title: 'Đã tạo',
            to: `/${info.username}/_created`,
        },
        {
            title: 'Đã lưu',
            to: `/${info.username}/_saved`,
        },
    ];
    //add friend
    const handleAddFriend = async () => {
        const status = 'PENDING';
        const user1 = await userServices.getUserById(userId); //User đang login
        const user2 = await userServices.getUserByUsername(pathname); //User nhận lời mời

        setSatusFriend('PENDING');
        const data = JSON.stringify({
            notifications: { notificationType: 'Friend' },
            friendships: { status, user1: { id: user1.id }, user2: { id: user2.id } },
        });
        setFriendshipCurrent(data.friendships);
        console.log('data.friendships:' + data);
        stompClient.send(`/app/sendNot/${user2.id}`, {}, data);
    };
    // stompClient.send(console.log(22222222222222));
    //cancel friend
    const handleCancelFriend = async () => {
        const result = await friendshipServices.deleteFriendship(frienshipCurrent);
        if (result) {
            setSatusFriend('REJECT');
        }
    };

    return (
        <div className={cx('wrapper', className)}>
            {loading && <CircularProgress sx={{ display: 'flex', margin: '0 auto' }} />}
            {Object.keys(info).length !== 0 && countFriend !== null && (
                <>
                    <div className={cx('info')}>
                        <Image
                            src={info.avatar && `data:image/jpeg;base64,${info.avatar}`}
                            className={cx('user-avatar')}
                            alt={info.username}
                        />
                        <h1 className={cx('fullname', theme === 'dark' ? 'dark' : '')}>{info.fullname}</h1>
                        <p className={cx('username', theme === 'dark' ? 'dark' : '')}>@{info.username}</p>
                        <div className={cx('container-info')}>
                            <p className={cx('website', theme === 'dark' ? 'dark' : '')}>
                                <a href={`${info.website}`}>{info.website}</a>
                            </p>
                            {info.introduce && (
                                <>
                                    <p className={cx('dash')}>-</p>
                                    <p className={cx('introduce', theme === 'dark' ? 'dark' : '')}>{info.introduce}</p>
                                </>
                            )}
                        </div>
                        <div className={cx('container-friend')}>
                            <h4
                                className={cx('count-friend', theme === 'dark' ? 'dark' : '')}
                                onClick={() => handleRenderFriend()}
                            >
                                {countFriend} Bạn bè
                            </h4>

                            {accountOther === false && (
                                <>
                                    <h4 className={cx('dash')}>-</h4>
                                    <h4
                                        className={cx('count-friend-request', theme === 'dark' ? 'dark' : '')}
                                        onClick={() => handleRenderFriendRequest()}
                                    >
                                        {countRequest} Lời mời kết bạn
                                    </h4>
                                </>
                            )}
                        </div>
                        {renderFriend && <ListFriend onClose={handleClose} idUser={info.id} />}
                        {renderFriendRequest && (
                            <FriendRequest
                                setUpdateFriend={setUpdateFriend}
                                onClose={handleCloseRequest}
                                idUser={info.id}
                            />
                        )}

                        <Button className={cx('shareBtn')} primary>
                            <Popper
                                idPopper={`share${info.id}`}
                                contentTitle={'Chia sẻ'}
                                className={cx('share-menu')}
                                body={<SharePopper user_id={info.id} />}
                                widthBody="maxContent"
                            />
                        </Button>
                        {accountOther ? (
                            statusFriend !== 'ACCEPTED' && statusFriend !== 'PENDING' ? (
                                <Button className={cx('addFriendBtn')} primary onClick={handleAddFriend}>
                                    Kết bạn
                                </Button>
                            ) : statusFriend === 'ACCEPTED' ? (
                                <Button className={cx('addFriendBtn')} primary onClick={handleCancelFriend}>
                                    Hủy kết bạn
                                </Button>
                            ) : statusFriend === 'PENDING' ? (
                                <Button className={cx('addFriendBtn')} primary onClick={handleCancelFriend}>
                                    Hủy lời mời
                                </Button>
                            ) : (
                                <Button className={cx('addFriendBtn')} primary onClick={handleAcceptFriend}>
                                    Chấp nhận
                                </Button>
                            )
                        ) : (
                            <Link to={`/${info.username}/edit-profile`}>
                                <Button className={cx('editBtn')} primary>
                                    Chỉnh sửa hồ sơ
                                </Button>
                            </Link>
                        )}
                    </div>
                    <div className={cx('pins-of-user')}>
                        <div className={cx('wrapper-menu-pin', theme === 'dark' ? 'dark' : '')}>
                            <NavMenu
                                className={cx('menu-pin', theme === 'dark' ? 'dark' : '')}
                                menu={menuPins}
                                activeUnderline
                            />
                        </div>
                        {children}
                    </div>
                </>
            )}
        </div>
    );
}

Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default memo(Wrapper);
