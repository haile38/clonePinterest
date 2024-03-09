import classNames from 'classnames/bind';
import styles from './ItemStatistic.module.scss';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const cx = classNames.bind(styles);

function ItemStatistic({ data, line = true }) {
    const { theme } = useContext(ThemeContext);
    return (
        <div className={cx('wrapper')}>
            {data.map((item, indexData) => {
                return (
                    <div key={indexData} className={cx('wrapper-item', theme === 'dark' ? 'dark' : '')}>
                        <h3 className={cx(theme === 'dark' ? 'dark' : '')}>{item.title}</h3>
                        <div
                            className={cx('container-item')}
                            style={{
                                boxShadow: line
                                    ? theme === 'dark'
                                        ? 'rgba(255, 255, 255, 0.6) 0px 1px 0px'
                                        : 'rgba(17, 17, 26, 0.1) 0px 1px 0px'
                                    : 'none',
                            }}
                        >
                            {item.detail.map((detail, indexDetail) => {
                                return (
                                    <div key={indexDetail} className={cx('container-detail')}>
                                        <p className={cx(theme === 'dark' ? 'dark' : '')}>{detail.title}</p>
                                        <h4 className={cx(theme === 'dark' ? 'dark' : '')}>{detail.data}</h4>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default ItemStatistic;
