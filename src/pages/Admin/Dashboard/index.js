import classNames from 'classnames/bind';
import styles from './Dashboard.module.scss';
import { useContext, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import Card from '../../../components/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCommentDots,
    faUsers,
    faPenToSquare,
    faHeart,
    faArrowUp,
    faArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import * as userServices from '../../../services/userServices';
import * as commentServices from '../../../services/commentServices';
import * as likeServices from '../../../services/likeServices';
import * as pinServices from '../../../services/pinServices';
import { CountAccessContext } from '../../../context/CountAccessContext';
import { ThemeContext } from '../../../context/ThemeContext';

const cx = classNames.bind(styles);

function Dashboard() {
    const { theme } = useContext(ThemeContext);
    const countAccess = useContext(CountAccessContext);

    const [countUser, setCountUser] = useState(0);
    const [countPin, setCountPin] = useState(0);
    const [countComment, setCountComment] = useState(0);
    const [countLike, setCountLike] = useState(0);

    const [percentUser, setPercentUser] = useState(0);
    const [percentPin, setPercentPin] = useState(0);
    const [percentComment, setPercentComment] = useState(0);
    const [percentLike, setPercentLike] = useState(0);
    const [data, setData] = useState([null, null, null, null, null, null, null, null, null, null, null, null]);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const storedData = JSON.parse(localStorage.getItem('countData')) || {};
        const listMonthOfStored = Object.keys(storedData);
        const arrDataTmp = data;
        numbers.map((number) => {
            listMonthOfStored.map((month) => {
                if (number === parseInt(month)) {
                    arrDataTmp[number - 1] = storedData[month].count;
                }
            });
        });
        setData(arrDataTmp);
    }, [data]);
    useEffect(() => {
        setChart({
            series: [
                {
                    name: 'Lượt truy cập',
                    data: data,
                },
            ],
            options: {
                chart: {
                    height: 350,
                    type: 'line',
                    zoom: {
                        enabled: false,
                    },
                },

                colors: ['#cc0000'],
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    curve: 'straight',
                },
                title: {
                    text: 'Lượt truy cập theo tháng',
                    align: 'left',
                    style: {
                        color: theme === 'dark' ? 'white' : 'black',
                        fontSize: '14px',
                        fontFamily: 'Noto Sans',
                    },
                },
                grid: {
                    row: {
                        colors: ['transparent'],
                        opacity: 0.5,
                    },
                },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    labels: {
                        style: {
                            colors: theme === 'dark' ? '#ffffff' : '#000000',
                        },
                    },
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: theme === 'dark' ? '#ffffff' : '#000000',
                        },
                    },
                },
            },
        });
    }, [theme]);
    const [chart, setChart] = useState({
        series: [
            {
                name: 'Lượt truy cập',
                data: data,
            },
        ],
        options: {
            chart: {
                height: 350,
                type: 'line',
                zoom: {
                    enabled: false,
                },
            },

            colors: ['#cc0000'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'straight',
            },
            title: {
                text: 'Lượt truy cập theo tháng',
                align: 'left',
                style: {
                    color: theme === 'dark' ? 'white' : 'black',
                    fontSize: '14px',
                    fontFamily: 'Noto Sans',
                },
            },
            grid: {
                row: {
                    colors: ['transparent'],
                    opacity: 0.5,
                },
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                labels: {
                    style: {
                        colors: theme === 'dark' ? '#ffffff' : '#000000',
                    },
                },
            },
            yaxis: {
                labels: {
                    style: {
                        colors: theme === 'dark' ? '#ffffff' : '#000000',
                    },
                },
            },
        },
    });
    useEffect(() => {
        const fetchApi = async () => {
            // SET COUNT
            const resultUser = await userServices.countAll();
            setCountUser(resultUser);
            const resultPin = await pinServices.countAll();
            setCountPin(resultPin);
            const resultComment = await commentServices.countAll();
            setCountComment(resultComment);
            const resultLike = await likeServices.countAll();
            setCountLike(resultLike);

            //SET PERCENT
            const percentUser = await userServices.percent7days();
            setPercentUser(percentUser);
            const percentPin = await pinServices.percent7days();
            setPercentPin(percentPin);
            const percentComment = await commentServices.percent7days();
            setPercentComment(percentComment);
            const percentLike = await likeServices.percent7days();
            setPercentLike(percentLike);

            // SAU KHI LOAD API XONG
            setIsLoading(true);
        };
        fetchApi();
    }, [countUser, countLike, countPin, countComment]);

    return (
        isLoading && (
            <div className={cx('wrapper')}>
                <div className={cx('card-container')}>
                    {console.log(countAccess)}
                    <Card
                        icon={<FontAwesomeIcon className={cx('icon')} icon={faUsers} />}
                        title={'Lượt đăng ký'}
                        data={countUser}
                        percent={percentUser}
                        iconDescription={
                            percentUser <= 0.5 ? (
                                <FontAwesomeIcon className={cx('iconDescription')} icon={faArrowDown} />
                            ) : (
                                <FontAwesomeIcon className={cx('iconDescription')} icon={faArrowUp} />
                            )
                        }
                    />
                    <Card
                        icon={<FontAwesomeIcon className={cx('icon')} icon={faPenToSquare} />}
                        title={'Số bài đăng'}
                        data={countPin}
                        percent={percentPin}
                        iconDescription={
                            percentPin <= 0.5 ? (
                                <FontAwesomeIcon className={cx('iconDescription')} icon={faArrowDown} />
                            ) : (
                                <FontAwesomeIcon className={cx('iconDescription')} icon={faArrowUp} />
                            )
                        }
                    />
                    <Card
                        icon={<FontAwesomeIcon className={cx('icon')} icon={faCommentDots} />}
                        title={'Lượt bình luận'}
                        data={countComment}
                        percent={percentComment}
                        iconDescription={
                            percentComment <= 0.5 ? (
                                <FontAwesomeIcon className={cx('iconDescription')} icon={faArrowDown} />
                            ) : (
                                <FontAwesomeIcon className={cx('iconDescription')} icon={faArrowUp} />
                            )
                        }
                    />
                    <Card
                        icon={<FontAwesomeIcon className={cx('icon')} icon={faHeart} />}
                        title={'Lượt yêu thích'}
                        data={countLike}
                        percent={percentLike}
                        iconDescription={
                            percentLike <= 0.5 ? (
                                <FontAwesomeIcon className={cx('iconDescription')} icon={faArrowDown} />
                            ) : (
                                <FontAwesomeIcon className={cx('iconDescription')} icon={faArrowUp} />
                            )
                        }
                    />
                </div>
                <div className={cx('chart')}>
                    <Chart options={chart.options} series={chart.series} type="line" height={350} />
                </div>
            </div>
        )
    );
}

export default Dashboard;
