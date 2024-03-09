import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styles from './Menu.module.scss';
import { useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

const cx = classNames.bind(styles);

function MenuItem({ title, to, icon, onclickMenuItem }) {
    const { theme } = useContext(ThemeContext);
    return (
        <NavLink
            className={(nav) => cx('menu-item', { active: nav.isActive }, theme === 'dark' ? 'dark' : '')}
            to={to}
            onClick={onclickMenuItem}
        >
            <span className={cx('icon')}>{icon}</span>
            <span className={cx('title')}>{title}</span>
        </NavLink>
    );
}

MenuItem.propTypes = {
    title: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
};

export default MenuItem;
