import classNames from 'classnames/bind';
import styles from './ListFriend.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import AccountInfo from '../../AccountInfo';
import Button from '../../Button';
import * as friendshipServices from '../../../services/friendshipServices';
import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';
import { AccountOtherContext } from '../../../context/AccountOtherContext';
import { ThemeContext } from '../../../context/ThemeContext';

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

function ListFriend({ idUser, onClose }) {
    const { accountOther } = useContext(AccountOtherContext);
    const { theme } = useContext(ThemeContext);
    const [listFriend, setListFriend] = useState([]);
    const [listRequest, setListRequest] = useState([]);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [frienshipCurrent, setFriendshipCurrent] = useState(false);
    const [statusFriend, setSatusFriend] = useState('');

    useEffect(() => {
        const fetchApi = async () => {
            const resultFriend = await friendshipServices.getListFriend(idUser);
            setListFriend(resultFriend);

            const resultRequest = await friendshipServices.getListRequest(idUser);
            setListRequest(resultRequest);

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

        const friendship = { id, user1, user2, status, createdAt };
        const result = await friendshipServices.update(id, friendship);
        if (result) {
            setUpdateSuccess(true);
        }
    };

    const handleCancelFriend = async (item) => {
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
                    {loading && <CircularProgress sx={{ display: 'flex', margin: '0 auto' }} />}
                    <div className={cx('body')}>
                        {listFriend &&
                            listFriend.map((item, index) => {
                                return (
                                    <div key={index} className={cx('item-friend')}>
                                        <AccountInfo
                                            userImage={idUser === item.user1.id ? item.user2.avatar : item.user1.avatar}
                                            username={
                                                idUser === item.user1.id ? item.user2.username : item.user1.username
                                            }
                                            width="45px"
                                            fontSize="1.5rem"
                                            fontWeight="500"
                                        />
                                        {accountOther ? null : (
                                            <Button primary onClick={() => handleCancelFriend(item)}>
                                                Hủy kết bạn
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                </div>
                <CustomTabPanel value={value} index={0}></CustomTabPanel>
            </div>
        </div>
    );
}

export default ListFriend;
