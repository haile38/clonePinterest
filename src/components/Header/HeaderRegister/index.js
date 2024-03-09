import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './HeaderRegister.module.scss';
import config from '../../../config';
import { LogoPinterest } from '../../Icons';
import Button from '../../Button';
import { useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

const cx = classNames.bind(styles);

function HeaderRegister() {
    const { theme } = useContext(ThemeContext);
    return (
        <header className={cx('wrapper', theme === 'dark' ? 'dark' : '')}>
            <div className={cx('inner')}>
                {/* LOGO */}
                <a href={config.routes.home} className={cx('logo-link')}>
                    <LogoPinterest className={cx('gUZ', 'GjR', 'kVc', theme === 'dark' ? 'dark' : '')} />
                    <h1 className={cx('name', theme === 'dark' ? 'dark' : '')}>DATH</h1>
                </a>
                <div className={cx('actions')}>
                    <Button red to={config.routes.login}>
                        Log in
                    </Button>
                    <Button
                        primary
                        className={cx('signUpBtn', theme === 'dark' ? 'dark' : '')}
                        to={config.routes.register}
                    >
                        Sign up
                    </Button>
                </div>
            </div>
        </header>
    );
}
export default HeaderRegister;
