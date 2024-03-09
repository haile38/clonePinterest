import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';

import { Wrapper as PopperWrapper } from '../../Popup';
import MenuItem from './MenuItem';
import styles from './MenuSettingHeader.module.scss';
import { ThemeContext } from '../../../context/ThemeContext';

const cx = classNames.bind(styles);

const defaultFn = () => {};

function MenuSettingHeader({ children, items = [], hideOnClick = false, onChange = defaultFn }) {
    const { theme } = useContext(ThemeContext);

    //render ra items
    const renderItems = () => {
        return items.map((item, index) => {
            return <MenuItem key={index} data={item} onClick={() => {}} />;
        });
    };

    const renderResult = (attrs) => (
        <div className={cx('menu-list')} tabIndex="-1" {...attrs}>
            <PopperWrapper className={cx('menu-popper', theme === 'dark' ? 'dark' : '')}>
                <div className={cx('menu-body')}>{renderItems()}</div>
            </PopperWrapper>
        </div>
    );

    return (
        <Tippy
            interactive
            delay={[0, 700]} //Khi show không bị delay
            // Khi ẩn bị delay 700ms'
            offset={[12, 8]}
            placement="bottom-end"
            hideOnClick={hideOnClick}
            render={renderResult}
        >
            {children}
        </Tippy>
    );
}

MenuSettingHeader.propTypes = {
    children: PropTypes.node.isRequired,
    items: PropTypes.array,
    hideOnClick: PropTypes.bool,
    onChange: PropTypes.func,
};

export default MenuSettingHeader;
