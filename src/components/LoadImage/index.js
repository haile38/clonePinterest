import classNames from 'classnames/bind';
import styles from './LoadImage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowUp } from '@fortawesome/free-solid-svg-icons';
import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const cx = classNames.bind(styles);
function LoadImage({ height = '300px', width = '292px', onSelectImage }) {
    const { theme } = useContext(ThemeContext);
    //preview img
    const [img, setIMG] = useState();
    const [showDiv, setShowDiv] = useState(true);

    useEffect(() => {
        return () => {
            img && URL.revokeObjectURL(img.preview);
        };
    }, [img]);
    const sendtoParent = (file) => {
        if (onSelectImage) {
            onSelectImage(file);
        }
    };
    const handlePreviewIMG = (e) => {
        const file = e.target.files[0];
        file.preview = URL.createObjectURL(file);
        setIMG(file);
        setShowDiv(false);
        sendtoParent(file);
    };
    return (
        <div className={cx('imgFrame')} onClick={() => document.querySelector('.inputIMG').click()}>
            {showDiv && (
                <div
                    style={{ height: height, width: width }}
                    className={cx('upload-text', theme === 'dark' ? 'dark' : '')}
                >
                    <button className={cx('upload-btn')}>
                        <FontAwesomeIcon icon={faCircleArrowUp} />
                    </button>
                    <p className={cx('text')}>Kéo và thả hoặc nhấp vào</p>
                    <p className={cx('text')}>để tải file lên</p>
                </div>
            )}
            <input
                className={cx('inputIMG', 'uploadText')}
                hidden
                name="uploadPhoto"
                type="file"
                accept="image/gif, image/jpeg, image/png"
                onChange={handlePreviewIMG}
            />
            {img && (
                <img src={img.preview} style={{ borderRadius: '12px', height: height, width: width }} alt="userPhoto" />
            )}
        </div>
    );
}

export default LoadImage;
