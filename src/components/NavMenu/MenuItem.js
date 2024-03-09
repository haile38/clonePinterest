import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styles from './Menu.module.scss';
import { ThemeContext } from '../../context/ThemeContext';
import { useContext } from 'react';

const cx = classNames.bind(styles);

function MenuItem({ title, to, activeUnderline = false, activeDefault, handleClick }) {
    const { theme } = useContext(ThemeContext);
    return (
        <>
            <NavLink
                className={(nav) =>
                    cx(
                        'menu-item',
                        { activeUnderline },
                        { activeDefault },
                        { active: nav.isActive },
                        theme === 'dark' ? 'dark' : '',
                    )
                }
                to={to}
                onClick={(event) => {
                    handleClick && event.preventDefault();
                    handleClick && handleClick();
                }}
            >
                <span className={cx('title')}>{title}</span>
                <div className={cx('underline-wrapper')}>
                    <div className={cx('underline')}></div>
                </div>
            </NavLink>
        </>
    );
}

MenuItem.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.node,
    to: PropTypes.string.isRequired,
};

export default MenuItem;
