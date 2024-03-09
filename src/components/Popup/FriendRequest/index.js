import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { StompContext } from '../../../context/StompContext';
import { ThemeContext } from '../../../context/ThemeContext';
import * as friendshipServices from '../../../services/friendshipServices';
import AccountInfo from '../../AccountInfo';
import Button from '../../Button';
import styles from './FriendRequest.module.scss';

const cx = classNames.bind(styles);
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ padding: '24px 0' }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
function FriendRequest({ idUser, onClose, setUpdateFriend }) {
    const { stompClient } = useContext(StompContext);
    const { theme } = useContext(ThemeContext);
    const [listRequest, setListRequest] = useState([]);
    const [listSent, setListSent] = useState([]);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApi = async () => {
            const resultRequest = await friendshipServices.getListRequest(idUser);
            setListRequest(resultRequest);

            const resultSent = await friendshipServices.getListSent(idUser);
            setListSent(resultSent);

            setLoading(false);
            setUpdateSuccess(false);
            setDeleteSuccess(false);
        };
        fetchApi();
    }, [idUser, updateSuccess, deleteSuccess]);

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleAcceptFriend = async (id, user1, user2) => {
        const createdAt = null;

        const status = 'ACCEPTED';

        const data = JSON.stringify({
            notifications: { notificationType: 'Friend' },
            friendships: { status, user1: { id: user2.id }, user2: { id: user1.id } },
        });
        console.log('data.friendships:' + data);
        stompClient.send(`/app/sendNot/${user1.id}`, {}, data);
        setUpdateSuccess(true);
        setUpdateFriend(true);
    };

    const handleCancelFriend = async (item) => {
        console.log(item);
        const result = await friendshipServices.deleteFriendship(item);
        if (result) {
            setDeleteSuccess(true);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container', theme === 'dark' ? 'dark' : '')}>
                <div className={cx('header')}>
                    <h2 className={cx('title')}>Bạn bè</h2>
                    <button className={cx('closeBtn')} onClick={onClose}>
                        <span className={cx('icon')}>
                            <FontAwesomeIcon icon={faXmark} />
                        </span>
                    </button>
                </div>
                <div className={cx('option-container')}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} variant="fullWidth" aria-label="basic tabs example">
                            <Tab
                                sx={{ fontSize: '1.3rem', fontWeight: 600, color: theme === 'dark' ? '#ccc' : '#333' }}
                                label="Lời mời kết bạn"
                                {...a11yProps(0)}
                            />
                            <Tab
                                sx={{ fontSize: '1.3rem', fontWeight: 600, color: theme === 'dark' ? '#ccc' : '#333' }}
                                label="Lời mời đã gửi"
                                {...a11yProps(1)}
                            />
                        </Tabs>
                    </Box>
                </div>
                <CustomTabPanel value={value} index={0}>
                    <div className={cx('body')}>
                        {loading && <CircularProgress sx={{ display: 'flex', margin: '0 auto' }} />}
                        {listRequest &&
                            listRequest.map((item, index) => {
                                return (
                                    <div key={index} className={cx('item-friend')}>
                                        <AccountInfo
                                            userImage={item.user1.avatar}
                                            username={item.user1.username}
                                            width="45px"
                                            fontSize="1.5rem"
                                            fontWeight="500"
                                        />
                                        <div>
                                            <Button
                                                className={cx('deleteBtn')}
                                                primary
                                                onClick={() => handleCancelFriend(item)}
                                            >
                                                Xóa
                                            </Button>
                                            <Button
                                                className={cx('acceptBtn')}
                                                red
                                                onClick={() => handleAcceptFriend(item.id, item.user1, item.user2)}
                                            >
                                                Chấp nhận
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <div className={cx('body')}>
                        {listSent &&
                            listSent.map((item, index) => {
                                return (
                                    <div key={index} className={cx('item-friend')}>
                                        <AccountInfo
                                            userImage={item.user2.avatar}
                                            username={item.user2.username}
                                            width="45px"
                                            fontSize="1.5rem"
                                            fontWeight="500"
                                        />
                                        <Button primary onClick={() => handleCancelFriend(item.id)}>
                                            Xóa
                                        </Button>
                                    </div>
                                );
                            })}
                    </div>
                </CustomTabPanel>
            </div>
        </div>
    );
}

export default FriendRequest;
