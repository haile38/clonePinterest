import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import MenuItem from './MenuItem';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

function NavMenu({ menu, activeUnderline = false, className }) {
    const location = useLocation();
    const currentPath = location.pathname;

    // Tìm username từ đường dẫn hiện tại
    const username = currentPath.split('/')[1]; // Lấy phần tử đầu tiên trong mảng chia tách bởi "/"

    return (
        <nav className={cx('wrapper', className)}>
            {menu.map((data, index) => {
                return (
                    <MenuItem
                        id={index}
                        key={index}
                        title={data.title}
                        to={data.to}
                        handleClick={data.handleClick}
                        activeUnderline={activeUnderline}
                        activeDefault={location.pathname === data.to || (index === 0 && currentPath === `/${username}`)}
                    />
                );
            })}
        </nav>
    );
}

NavMenu.propTypes = {
    menu: PropTypes.array.isRequired,
};

export default NavMenu;
