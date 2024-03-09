import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { HeaderRegister } from '../../components/Header';
import styles from './RegisterLayout.module.scss';

const cx = classNames.bind(styles);

function RegisterLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <HeaderRegister />
            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

PropTypes.propTypes = {
    children: PropTypes.node.isRequired,
};

export default RegisterLayout;
