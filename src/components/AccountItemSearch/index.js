import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './AccountItemSearch.module.scss';
import Image from '../Image';

const cx = classNames.bind(styles);

function AccountItemSearch({ data }) {
    return (
        <Link to={`/${data.username}`} className={cx('wrapper')}>
            <Image className={cx('avatar')} src={`data:image/jpeg;base64,${data.avatar}`} alt={data.fullname} />
            <div className={cx('info')}>
                <h4 className={cx('name')}>
                    <span>{data.fullname}</span>
                    {/* {data.tick && <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />} */}
                </h4>
                <span className={cx('username')}>{data.username}</span>
            </div>
        </Link>
    );
}

AccountItemSearch.propTypes = {
    data: PropTypes.object.isRequired,
};

export default AccountItemSearch;
