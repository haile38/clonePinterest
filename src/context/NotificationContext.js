import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getCommentByNotification } from '../services/commentServices';
import { getFriendByNotification } from '../services/friendshipServices';
import { getLikeByNotification } from '../services/likeServices';
import { getAllNotifications, getNewsHub } from '../services/notificationService';
import { AccountLoginContext } from './AccountLoginContext';
import { StompContext } from './StompContext';
const NotificationContext = createContext({});

function NotificationProvider({ children }) {
    const { userId } = useContext(AccountLoginContext);
    const { stompClient } = useContext(StompContext);
    const nots = useRef([]);
    const [res, setRes] = useState([]);
    const [pinCount, setPinCount] = useState([]);
    const notType = { pin: 'Pin', like: 'Like', comment: 'Comment', friend: 'Friend' };

    const updatePinCount = (value) => {
        setPinCount(value);
    };
    useEffect(() => {
        stompClient.connect({}, () => {
            stompClient.subscribe(`/room/updateNots/${userId}`, (result) => {
                nots.current = [...nots.current, JSON.parse(result.body).notifications];
                fetch2();
                console.log(result.body);
            });
        });
        const fetch1 = async () => {
            if (pinCount.length === 4) {
                try {
                    setTimeout(() => {
                        const data = JSON.stringify({ notifications: { notificationType: 'Pin' }, listPins: pinCount });
                        console.log(JSON.parse(data).listPins);
                        stompClient.send(`/app/sendNot/${userId}`, {}, data);
                    }, 5000);
                } catch (error) {
                    console.log('Error in stomp: ', error);
                }
                localStorage.setItem('pinCount', []);
            }
        };
        // Load bảng thông báo
        const fetch2 = async () => {
            nots.current = await getAllNotifications(userId);
            console.log(nots.current);
            let result = [];
            const promise = nots.current.map(async (not, index) => {
                let related = [];
                if (not.notificationType === notType.friend) {
                    related = await getFriendByNotification(not.id);
                } else if (not.notificationType === notType.like) {
                    related = await getLikeByNotification(not.id);
                } else if (not.notificationType === notType.comment) {
                    related = await getCommentByNotification(not.id);
                } else {
                    related = await getNewsHub(not.id);
                }
                return (result = [...result, { not, related }]);
            });
            Promise.all(promise).then((e) => {
                let sortedArray = [...result].sort((a, b) => {
                    const nameA = a.not.notificationAt;
                    const nameB = b.not.notificationAt;
                    return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
                });
                let filterSort = sortedArray.filter(
                    (item) =>
                        (item.not.notificationType === notType.like || item.not.notificationType === notType.comment) &&
                        item.related.pin.user.id === userId &&
                        item.related.user.id === userId,
                );

                sortedArray = sortedArray.filter((item) => !filterSort.includes(item));

                setRes(sortedArray);
            });
        };
        if (userId !== 0) {
            fetch1().then(() => {
                fetch2();
            });
        }
    }, [userId, notType.comment, notType.friend, notType.like, pinCount, stompClient]);
    return <NotificationContext.Provider value={{ updatePinCount, res }}> {children} </NotificationContext.Provider>;
}
export { NotificationContext, NotificationProvider };
