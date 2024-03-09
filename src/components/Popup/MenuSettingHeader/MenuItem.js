import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './MenuSettingHeader.module.scss';
import Button from '../../Button';
import { useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

const cx = classNames.bind(styles);

function MenuItem({ data, onClick }) {
    const { theme } = useContext(ThemeContext);
    const classes = cx('menu-item', { separate: data.separate }, theme === 'dark' ? 'dark' : '');
    return (
        <Button
            className={classes}
            switchToggle={data.switchToggle}
            leftIcon={data.icon}
            to={data.to}
            onClick={() => {
                onClick();
                data.handleClickMenuItem && data.handleClickMenuItem();
            }}
        >
            {data.title}
        </Button>
    );
}

MenuItem.propTypes = {
    data: PropTypes.object.isRequired,
    onClick: PropTypes.func,
};

export default MenuItem;
