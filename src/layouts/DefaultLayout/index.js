import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { HeaderDefault } from '../../components/Header';
import styles from './DefaultLayout.module.scss';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <HeaderDefault />
            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

PropTypes.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
