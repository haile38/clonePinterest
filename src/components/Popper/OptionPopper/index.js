import classNames from 'classnames/bind';
import styles from './OptionPopper.module.scss';
import Button from '../../Button';
import { SelectedIcon } from '../../Icons';
import { ThemeContext } from '../../../context/ThemeContext';
import { useContext } from 'react';

const cx = classNames.bind(styles);

function OptionPopper({ data }) {
    const { theme } = useContext(ThemeContext);
    return (
        <div className={cx('wrapper', theme === 'dark' ? 'dark' : '')} style={{ width: data.width }}>
            <p className={cx('title', theme === 'dark' ? 'dark' : '')}>{data.title}</p>
            {data.item &&
                data.item.map((item) => {
                    return (
                        <Button
                            key={item.id}
                            className={cx(
                                item.active === item.id ? 'active' : undefined,
                                theme === 'dark' ? 'dark' : '',
                            )}
                            onClick={() => {
                                item.handleActive && item.handleActive();
                                item.handleClick && item.handleClick();
                            }}
                            activeIcon={item.active === item.id ? <SelectedIcon /> : null}
                            contentLeft
                        >
                            {item.content}
                        </Button>
                    );
                })}
        </div>
    );
}

export default OptionPopper;
