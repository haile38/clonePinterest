import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Pin from '../../components/Pin';
import { useEffect, useState } from 'react';
import ActionAlerts from '../../components/Alert';
import { useCountAccess } from '../../context/CountAccessContext';
import * as pinServices from '../../services/pinServices';
import * as userServices from '../../services/userServices';
import { CircularProgress } from '@mui/material';

const cx = classNames.bind(styles);

function Home() {
    const [loading, setLoading] = useState(true);
    // COUNT ACCESS
    const { updateCounter, countData } = useCountAccess();
    const [hasExecuted, setHasExecuted] = useState(false);
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
        if (!hasExecuted) {
            const today = new Date();
            const currentMonth = today.getMonth() + 1;

            // Lấy countData từ localStorage
            const storedData = JSON.parse(localStorage.getItem('countData')) || {};

            // Kiểm tra xem có dữ liệu cho tháng hiện tại không
            const currentMonthData = storedData[currentMonth] || { count: 0 }; // Ensure it's an object with a 'count' property

            // Increment the counter for the current month
            const newCounter = currentMonthData.count + 1;

            // Update countData in context
            updateCounter(newCounter, currentMonth);

            // Update localStorage
            storedData[currentMonth] = { count: newCounter }; // Store an object with 'count' property
            localStorage.setItem('countData', JSON.stringify(storedData));

            // Đánh dấu rằng hàm đã thực thi
            setHasExecuted(true);
        }
    }, [updateCounter, countData.currentMonth, hasExecuted]);

    //RENDER LIST PIN
    const [LIST_PIN, setListPin] = useState([]);
    useEffect(() => {
        const fetchApi = async () => {
            let result = await pinServices.getAllPins();
            result = result.filter((item) => item.user.privateBool === false);
            result = [...result].sort((a, b) => {
                const nameA = a.createdAt;
                const nameB = b.createdAt;
                return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
            });
            setListPin(result);
            setLoading(false);
        };

        fetchApi();
    }, []);

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
        <div className={cx('wrapper')} style={{ height: loading && 'calc(100vh - 70px)' }}>
            {loading && <CircularProgress sx={{ display: 'flex', margin: 'auto' }} />}

            {LIST_PIN.map((pin, index) => {
                const user = pin.user;

                return (
                    <Pin
                        key={index}
                        stt={index + 1}
                        id={pin.id}
                        image={pin.image}
                        linkImage={pin.link}
                        title={pin.title}
                        userImage={user.avatar}
                        username={user.username}
                        onSaveResult={handleSaveResult}
                        showAlert={showAlert}
                    />
                );
            })}
            {statusSave && <ActionAlerts severity="success" content={`Đã lưu pin`} />}
            {alertType === 'warning' && <ActionAlerts severity="warning" content={`Chọn bảng bạn muốn lưu vào`} />}
            {alertType === 'errorSave' && (
                <ActionAlerts severity="error" content={`Không thể lưu bài đăng của chính bạn`} />
            )}
            {alertType === 'errorInfo' && <ActionAlerts severity="error" content={`Nhập đầy đủ thông tin`} />}
            {alertType === 'create' && <ActionAlerts severity="success" content={`Đã thêm thành công`} />}
            {alertType === 'errorAdmin' && (
                <ActionAlerts severity="error" content={`Hãy đăng nhập tài khoản user để lưu pin`} />
            )}
            {alertType === 'errorSavePinSaved' && <ActionAlerts severity="error" content={`Bạn đã lưu bài đăng này`} />}
        </div>
    );
}

export default Home;
