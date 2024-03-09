import Image from '../../Image';
import classNames from 'classnames/bind';
import styles from './SharePopper.module.scss';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
function ShareResult({user, handleSelect}) {
    const [isSelected, setIsSelected] = useState(false);
    const [cursor, setCursor] = useState('pointer');
    useEffect(() => {
        if(isSelected) {
            setCursor('auto');
        }
        else {
            setCursor('pointer');
        }
    }, [isSelected]);
    return ( 
        <>
            <div 
                className={cx('people-option')}
                value={user.id}
                onClick={(e) => {
                    if(!isSelected) {
                        handleSelect(e);
                        setTimeout(() => {
                            setIsSelected(true);
                        }, 1300);
                    }
                }}
                style={{
                    cursor: cursor 
                }}
            >
                <Image
                    src={user.avatar && `data:image/jpeg;base64,${user.avatar}`}
                    className={cx('user-avatar')}
                    alt={user.username}
                    value={user.id}
                />
                <span
                    value={user.id}
                >
                    {user.username}
                </span>
                {isSelected &&
                    <div className={cx('overlay')}>
                        <FontAwesomeIcon size='xl' className={cx('check-icon')} icon={faCheck}/>
                    </div>
                }
            </div>
        </>
    );
}

export default ShareResult;