import ConversationList from './ConversationList';
import styles from './ConversationMenu.module.scss';
import classNames from 'classnames/bind';
import { CreateMessageIcon } from '../../../Icons';
import { useContext } from 'react';
import { ThemeContext } from '../../../../context/ThemeContext';

const cx = classNames.bind(styles);
function ConversationMenu({ handleChange, conversationList }) {
    const { theme } = useContext(ThemeContext);
    return (
        <div className={cx('wrapper-conservation-menu')}>
            <div className={cx('mini-menu', theme === 'dark' ? 'dark' : '')}>
                <h2 className={cx('title')}>Inbox</h2>
                <div 
                    className={cx('wrapper-create-conversation', theme === 'dark' ? 'dark' : '')}
                    onClick={() => handleChange('', true, 0)}
                >
                    <div className={cx('wrapper-icon')}>
                        <CreateMessageIcon className={cx('gUZ', 'NUb', 'kVc', 'U90')} />
                    </div>
                    <button className={cx('create-conversation-button', theme === 'dark' ? 'dark' : '')}>
                        Tạo cuộc trò chuyện
                    </button>
                </div>
            </div>
            <ConversationList handleChange={handleChange} conversationList={conversationList}></ConversationList>
        </div>
    );
}

export default ConversationMenu;
