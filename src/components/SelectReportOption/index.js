import React, { useState, useEffect, useContext } from 'react';
import classNames from 'classnames/bind';
import styles from './SelectReportOption.module.scss';
import Button from '../Button';
import * as contentReportServices from '../../services/contentReportServices';
import * as report_pinServices from '../../services/report_pinServices';
import * as report_commentServices from '../../services/report_commentServices';
import ActionAlerts from '../Alert';
import { ThemeContext } from '../../context/ThemeContext';

const cx = classNames.bind(styles);

function SelectReportOption({ handleTurnOnSelectReport, pin, user, comment }) {
    const { theme } = useContext(ThemeContext);

    const [listReport, setListReport] = useState([]);
    useEffect(() => {
        const fetchApi = async () => {
            const result = await contentReportServices.getAllContent_Report();
            setListReport(result);
        };
        fetchApi();
    }, []);

    const [statusSave, setStatusSave] = useState(false);

    const handleSaveResult = (result) => {
        console.log(result);
        setStatusSave(result);
        if (result) {
            setTimeout(() => {
                setStatusSave(false);
                handleTurnOnSelectReport(false);
            }, 2500);
        }
        // window.location.reload();
    };

    const [red, setRedButton] = React.useState(false);
    const [reported, setReportOption] = useState([]);

    const handleReport = () => {
        const fetchApi = async () => {
            let result = false;
            if (Object.keys(comment).length === 0) {
                const report = {
                    approve: false,
                    reject: true,
                    content: reported,
                    pin: pin,
                    userRatify: null,
                    userReport: user,
                };
                result = await report_pinServices.save(report);
            } else {
                const report = {
                    approve: false,
                    reject: true,
                    content: reported,
                    comment: comment,
                    userRatify: null,
                    userReport: user,
                };
                result = await report_commentServices.save(report);
            }
            handleSaveResult(result);
        };
        fetchApi();
    };

    return (
        <div className={cx('popup-background')}>
            <div className={cx('gray-background')} onClick={() => handleTurnOnSelectReport(false)}></div>
            <div className={cx('popup-container', theme === 'dark' ? 'dark' : '')}>
                <div className={cx('popup-top')}>
                    {Object.keys(comment).length === 0 ? (
                        <h2 className={cx(theme === 'dark' ? 'dark' : '')}>Báo cáo bài đăng</h2>
                    ) : (
                        <h2 className={cx(theme === 'dark' ? 'dark' : '')}>Báo cáo nhận xét</h2>
                    )}
                </div>
                <div className={cx('list-report')}>
                    {listReport.map((item, index) => {
                        return (
                            <div className={cx('item-report', theme === 'dark' ? 'dark' : '')} key={index}>
                                <div className={cx('wrapper')}>
                                    <input
                                        className={cx('radioBTN')}
                                        type="radio"
                                        name="reportOption"
                                        onChange={(e) => (setRedButton(true), setReportOption(item))}
                                    />
                                    <label className={cx('content')}>{item.content}</label>
                                </div>
                                <p className={cx('description')}>{item.description}</p>
                            </div>
                        );
                    })}
                </div>
                <div className={cx('optionBtn')}>
                    <Button className={cx('saveBtn')} primary onClick={() => handleTurnOnSelectReport(false)}>
                        Hủy
                    </Button>
                    {red ? (
                        <Button className={cx('saveBtn')} red onClick={() => handleReport()}>
                            Báo cáo
                        </Button>
                    ) : (
                        <Button className={cx('saveBtn')} primary>
                            Báo cáo
                        </Button>
                    )}
                </div>
                {statusSave && <ActionAlerts content={`Đã báo cáo`} />}
            </div>
        </div>
    );
}

export default SelectReportOption;
