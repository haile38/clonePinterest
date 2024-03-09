import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import Menu from './Menu';
import MenuItem from './Menu/MenuItem';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const cx = classNames.bind(styles);

function SideBar({ SideBarItems, style, className, children, onclickMenuItem }) {
    const { theme } = useContext(ThemeContext);
    return (
        <aside className={cx(className, 'wrapper', theme === 'dark' ? 'dark' : '')} style={style}>
            {children}
            <Menu>
                {SideBarItems.map((item, index) => {
                    return (
                        <MenuItem
                            key={index}
                            title={item.title}
                            to={item.to}
                            icon={item.icon}
                            activeIcon={item.activeIcon ? item.activeIcon : null}
                            onclickMenuItem={onclickMenuItem}
                        />
                    );
                })}
            </Menu>
        </aside>
    );
}
export default SideBar;
