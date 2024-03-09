import classNames from 'classnames/bind';
import styles from './ItemCheckbox.module.scss';
import { Checkbox } from '@mui/material';

const cx = classNames.bind(styles);

function ItemCheckbox({ name }) {
    return (
        <div className={cx('wrapper')}>
            <Checkbox color="primary" aria-label={name} />
        </div>
    );
}

export default ItemCheckbox;
