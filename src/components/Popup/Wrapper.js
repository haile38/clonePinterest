import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Popup.module.scss';
import { ThemeContext } from '../../context/ThemeContext';
import { useContext } from 'react';

const cx = classNames.bind(styles);

function Wrapper({ children, className }) {
    const { theme } = useContext(ThemeContext);
    return <div className={cx('wrapper', theme === 'dark' ? 'dark' : '', className)}>{children}</div>;
}

Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Wrapper;
