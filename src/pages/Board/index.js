import classNames from 'classnames/bind';
import styles from './Board.module.scss';
import Pin from '../../components/Pin';
import Popper from '../../components/Popper';
import { FilterIcon } from '../../components/Icons';
import OptionPopper from '../../components/Popper/OptionPopper';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import * as boardServices from '../../services/boardServices';
import * as userSavePinServices from '../../services/userSavePinServices';
import { ThemeContext } from '../../context/ThemeContext';
import { CircularProgress } from '@mui/material';
import ActionAlerts from '../../components/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/Button';

const cx = classNames.bind(styles);

function Board() {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const [boardName, setBoardName] = useState('');
    const [listPin, setListPin] = useState([]);
    const [countPin, setCountPin] = useState(0);
    const [typeSort, setTypeSort] = useState('default');
    const [active, setActive] = useState('2');
    const [loading, setLoading] = useState(true);
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

    const handleActive = (id) => {
        setActive(id === active ? null : id);
    };

    useEffect(() => {
        const fetchApi = async () => {
            const id = location.pathname.split('/')[3];
            const boardname = await boardServices.getBoardById(id);
            setBoardName(boardname.name);
            let resultPin = await userSavePinServices.getPinByBoardId(id);

            setCountPin(resultPin.length);

            if (typeSort === 'closest') {
                resultPin = [...resultPin].sort((a, b) => b.id - a.id);
            }
            setListPin(resultPin);
            setLoading(false);
        };
        fetchApi();
    }, [location.pathname, typeSort, alertType]);

    const filterBoardPopper = {
        title: 'Sắp xếp theo thời gian lưu',
        item: [
            {
                id: '1',
                content: 'Gần nhất',
                handleClick: () => setTypeSort('closest'),
                handleActive: () => handleActive('1'),
                active: active,
            },
            {
                id: '2',
                content: 'Xa nhất',
                handleClick: () => setTypeSort('default'),
                handleActive: () => handleActive('2'),
                active: active,
            },
        ],
        width: '270px',
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container-title')}>
                <Button
                    onClick={() => {
                        navigate(-1);
                    }}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--color-red)',
                        marginRight: '15px',
                        padding: '3px',
                        minWidth: '30px',
                    }}
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
                <h1 className={cx('title', theme === 'dark' ? 'dark' : '')}>{boardName}</h1>
            </div>

            <div className={cx('option')}>
                <Popper
                    title={<FilterIcon className={cx('action', 'icon', theme === 'dark' ? 'dark' : '')} />}
                    body={<OptionPopper data={filterBoardPopper} />}
                    widthBody="maxContent"
                    placement="bottom-start"
                />
                <h3 className={cx('count')}>{countPin} Ghim</h3>
            </div>

            <div className={cx('container-pins')}>
                {loading && <CircularProgress sx={{ display: 'flex', margin: 'auto' }} />}
                {listPin.map((pin, index) => {
                    return (
                        <Pin
                            key={index}
                            stt={index + 1}
                            id={pin.pin.id}
                            image={pin.pin.image}
                            linkImage={pin.pin.link}
                            title={pin.pin.title}
                            userImage={pin.pin.user.avatar}
                            username={pin.pin.user.username}
                            showAlert={showAlert}
                            pinSaved={true}
                        />
                    );
                })}
                {/* {listPin.length !== 0 &&
                    listPin.map((pin, index) => {
                        return (
                            <Pin
                                key={index}
                                image={pin.pin.image}
                                linkImage={pin.pin.link}
                                title={pin.pin.title}
                                userImage={pin.user.avatar}
                                username={pin.user.username}
                                
                            />
                        );
                    })} */}
            </div>
            {alertType === 'changeSuccess' && <ActionAlerts severity="success" content={`Đã thay đổi`} />}
            {alertType === 'deleteSuccess' && <ActionAlerts severity="success" content={`Đã xóa pin khỏi bảng`} />}
        </div>
    );
}

export default Board;
