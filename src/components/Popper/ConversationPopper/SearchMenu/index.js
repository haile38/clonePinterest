import classNames from 'classnames/bind';
import styles from './SearchMenu.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { CircularProgress } from '@mui/material';
import SearchResult from './SearchResult';
import { useContext, useEffect, useRef, useState } from 'react';
import * as friendshipServices from '../../../../services/friendshipServices';
import { ConversationContext } from '../../../../context/ConversationContext';
import { AccountLoginContext } from '../../../../context/AccountLoginContext';
import { StompContext } from '../../../../context/StompContext';
import { ThemeContext } from '../../../../context/ThemeContext';
import { useDebounce } from '../../../../hooks';
import * as userServices from '../../../../services/userServices';
import * as conversationServices from '../../../../services/conversationServices';
import * as participantServices from '../../../../services/participantServices';

const cx = classNames.bind(styles);

function SearchMenu({ handleChange }) {
    const { theme } = useContext(ThemeContext);
    const { conversationList } = useContext(ConversationContext);
    const { stompClient } = useContext(StompContext);
    const { userId } = useContext(AccountLoginContext);
    const [searchResult, setSearchResult] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const debouncedValue = useDebounce(searchValue, 500);
    const inputRef = useRef();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchFriendList = async () => {
            const temp = await friendshipServices.getListFriend(userId);
            temp.forEach((item) => {
                setSearchResult((prev) => [...prev, item.user2]);
            });
            inputRef.current.focus();
            setLoading(false);
        };
        if (fetchFriendList.length === 0) {
            fetchFriendList();
        }
    }, []);

    useEffect(() => {
        if (!debouncedValue.trim()) {
            //trim() xóa khoảng trắng ở đầu và cuối
            setSearchResult([]);
            return;
        }
        fetch(`http://localhost:8080/users/getAll`)
            .then((res) => res.json())
            .then((res) => {
                let temp = [];
                for (let i = 0; i < res.length; i++) {
                    if (res[i].username.includes(debouncedValue) && res[i].id !== userId) {
                        temp.push(res[i]);
                    }
                }
                setSearchResult(temp);
                setLoading(false); //bỏ loading sau khi gọi api
            })
            .catch(() => {
                setLoading(false); //bỏ loading khi bị lỗi
            });
    }, [debouncedValue]); //Khi người dùng gõ vào input => chạy lại useEffect

    const handleChangeInput = (e) => {
        const searchValue = e.target.value;

        if (!searchValue.startsWith(' ')) {
            // Không cho người dùng gõ dấu cách đầu tiên
            setSearchValue(searchValue);
            setLoading(true);
        }
        if (searchValue === '') {
            setLoading(false);
        }
    };

    const handleSelect = async (user_id) => {
        const currentUser = await userServices.getUserById(user_id);
        let conversation_id = 0;
        let createdConversation = false;
        conversationList.current.forEach((item) => {
            if (item.user.id === user_id) {
                conversation_id = item.conversation.id;
                createdConversation = true;
            }
        });
        if (createdConversation) {
            handleChange(currentUser, false, conversation_id);
        } else {
            let lastID = 0;
            const convs = await conversationServices.getAllConversations();
            convs.forEach((item) => {
                if (item.id > lastID) {
                    lastID = item.id;
                }
            });
            ++lastID;
            const createdConv = await conversationServices.save({
                id: lastID + 1,
                name: null,
                create_at: new Date(),
            });
            const temp = [await userServices.getUserById(userId), await userServices.getUserById(user_id)];
            const conv = await conversationServices.getById(createdConv.id);
            temp.forEach(async (user) => {
                await participantServices.save({
                    conversation: conv,
                    user: user,
                });
            });
            forceReloadConversationList();
            setTimeout(() => {
                handleChange(currentUser, false, createdConv.id);
            }, 500);
        }
    };

    const forceReloadConversationList = () => {
        stompClient.send('/app/reload', {}, '');
    };

    return (
        <div className={cx('search-menu-container')}>
            <div className={cx('header-container')}>
                <div className={cx('title-container')}>
                    <span>Tin nhắn mới</span>
                </div>
                <button
                    className={cx('cancel-search-btn', theme === 'dark' ? 'dark' : '')}
                    onClick={() => handleChange('', false, 0)}
                >
                    Huỷ
                </button>
            </div>
            <div className={cx('search-bar')}>
                <input
                    className={cx('search-input', theme === 'dark' ? 'dark' : '')}
                    placeholder="Nhập tên hoặc username"
                    value={searchValue}
                    onChange={handleChangeInput}
                    spellCheck={false}
                    ref={inputRef}
                />
                <div className={cx('search-icon', theme === 'dark' ? 'dark' : '')}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
            </div>
            <div className={cx('search-result-container')}>
                {loading && <CircularProgress sx={{ display: 'flex', margin: 'auto' }} />}
                {!loading &&
                    searchResult.map((user) => {
                        return <SearchResult handleSelect={handleSelect} key={user.id} user={user}></SearchResult>;
                    })}
            </div>
        </div>
    );
}

export default SearchMenu;
