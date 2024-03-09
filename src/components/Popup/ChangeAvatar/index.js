import React, { useState, useRef, useContext, createContext } from 'react';
import styles from './ChangeAvatar.module.scss';
import classNames from 'classnames/bind';
import Button from '../../Button';
import LoadImage from '../../LoadImage';
import { ThemeContext } from '../../../context/ThemeContext';
function PopupForm({ onClose, onSave, onSelectImage }) {
    const { theme } = useContext(ThemeContext);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleSaveImage = () => {
        onSave(selectedImage); // Close the popup
    };

    const cx = classNames.bind(styles);
    return (
        <div className={cx('popup-background')}>
            <div className={cx('popup-container', theme === 'dark' ? 'dark' : '')}>
                <div className={cx('popup-top', theme === 'dark' ? 'dark' : '')}>
                    <h2>Thay đổi ảnh của bạn</h2>
                </div>

                <div className={cx('choose-image')}>
                    <LoadImage onSelectImage={onSelectImage} />
                </div>
                <div className={cx('optionBtn')}>
                    <Button onClick={onClose} primary>
                        Hủy
                    </Button>
                    <Button className={cx('saveBtn')} onClick={handleSaveImage} red>
                        Lưu
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PopupForm;
