import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import styles from './Comment.module.scss';
import CommentCard from './CommentCard';

const cx = classNames.bind(styles);

function CommentApp({ handleTurnOnSelectReport, scroll, comments, currentUser, setScroll }) {
    //scroll to bottom CommentApp
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        if (scroll) {
            console.log(scroll);
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            setScroll(false);
        }
    };
    useEffect(scrollToBottom, [scroll]);

    return (
        <div className={cx('comment-content')}>
            <div className={cx('comment-panel')}>
                <div className={cx('wrapper')}>
                    {comments.current.map((comment, index) => (
                        <CommentCard
                            key={index}
                            handleTurnOnSelectReport={handleTurnOnSelectReport}
                            comment={comment}
                            currentUser={currentUser}
                        ></CommentCard>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
        </div>
    );
}

export default CommentApp;
