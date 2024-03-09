import PropTypes from 'prop-types';
import { useState, forwardRef } from 'react';
import classNames from 'classnames/bind';
import images from '../../assets/images';
import styles from './Image.module.scss';

const Image = forwardRef(
    ({ src, alt, className, style, onChange, fallback: customFallback = images.noImage, ...props }, ref) => {
        //Nhận tất cả props ở bên ngoài

        const [fallback, setFallback] = useState('');

        const handleError = () => {
            setFallback(customFallback);
        };

        return (
            <img
                ref={ref}
                className={classNames(styles.wrapper, className)}
                style={style}
                // Mặc định sẽ có className wrapper
                // className có khi truyền từ bên ngoài vào
                src={fallback || src}
                alt={alt}
                {...props}
                onError={handleError}
                onChange={onChange}
            />
        ); ///truyền tất cả props vào
        // fallback || src
        // Nếu có fallback (lỗi)=> dùng fallback; còn không sẽ dùng src
    },
);

Image.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    className: PropTypes.string,
    fallback: PropTypes.string,
    onChange: PropTypes.func,   
};

export default Image;
