import styles from './Search.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ActionAlerts from '../../components/Alert';
import Pin from '../../components/Pin';
import * as pinServices from '../../services/pinServices';
import * as userServices from '../../services/userServices';
import * as userSavePin from '../../services/userSavePinServices';
import { CircularProgress } from '@mui/material';

const cx = classNames.bind(styles);

function DisplaySearch() {
    const location = useLocation();

    //RENDER LIST PIN
    const [LIST_PIN, setListPin] = useState([]);
    const [loading, setLoading] = useState(true);

    const searchType = location.pathname.split('=')[1];

    useEffect(() => {
        const searchUser = location.pathname.split(':')[1];
        const searchUserValue = location.pathname.split(':')[2];

        const fetchApi = async () => {
            const result = await pinServices.getAllPins();
            let temp = [];

            if (searchType) {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].type !== null && result[i].type.id === parseInt(searchType)) {
                        temp.push(result[i]);
                    }
                }
            } else {
                if (searchUser) {
                    const pinCreated = await pinServices.getPinsByUsername(searchUser);
                    const user = await userServices.getUserByUsername(searchUser);
                    const pinSaved = await userSavePin.getPinByUserId(user.id);
                    console.log(pinSaved);
                    for (let i = 0; i < pinCreated.length; i++) {
                        if (
                            (pinCreated[i].title && pinCreated[i].title.includes(searchUserValue)) ||
                            (pinCreated[i].description && pinCreated[i].description.includes(searchUserValue))
                        ) {
                            temp.push(pinCreated[i]);
                        }
                    }

                    for (let i = 0; i < pinSaved.length; i++) {
                        if (
                            (pinSaved[i].pin.title && pinSaved[i].pin.title.includes(searchUserValue)) ||
                            (pinSaved[i].pin.description && pinSaved[i].pin.description.includes(searchUserValue))
                        ) {
                            console.log('a');
                            temp.push(pinSaved[i].pin);
                        }
                    }
                } else {
                    const searchValue = location.pathname.split('/')[2];
                    if (searchValue) {
                        console.log('home');
                        for (let i = 0; i < result.length; i++) {
                            if (
                                (result[i].title && result[i].title.includes(searchValue)) ||
                                (result[i].descriptio && result[i].description.includes(searchValue))
                            ) {
                                temp.push(result[i]);
                            }
                        }
                        setListPin(temp);
                    }
                }
            }

            setListPin(temp);
            setLoading(false);
        };

        fetchApi();
    }, [searchType]);

    const [statusSave, setSatusSave] = useState(false);

    const handleSaveResult = (result) => {
        setSatusSave(result);

        // Nếu result là true, đặt một timeout để đặt lại statusSave sau một khoảng thời gian
        if (result) {
            setTimeout(() => {
                setSatusSave(false);
            }, 2500);
        }
    };

    return (
        <div className={cx('wrapper')} style={{ height: loading ? 'calc(100vh - 70px)' : 'auto' }}>
            {loading ? (
                <CircularProgress sx={{ display: 'flex', margin: 'auto' }} />
            ) : LIST_PIN.length > 0 ? (
                LIST_PIN.map((pin, index) => {
                    const user = pin.user;
                    return (
                        <Pin
                            key={index}
                            stt={index + 1}
                            id={pin.id}
                            image={pin.image}
                            // linkImage={pin.linkImage}
                            title={pin.title}
                            userImage={user.avatar}
                            username={user.username}
                            onSaveResult={handleSaveResult}
                        />
                    );
                })
            ) : (
                <p>Không thể tìm thấy Pin nào</p>
            )}

            {statusSave && <ActionAlerts content={`Đã lưu pin`} action="UNDO" />}
        </div>
    );
}

export default DisplaySearch;
