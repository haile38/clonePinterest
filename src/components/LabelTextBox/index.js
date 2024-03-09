import React, { useState, useEffect, useContext } from 'react';
import classNames from 'classnames/bind';
import style from './LabelTextBox.module.scss';
import PropTypes from 'prop-types';
import { ThemeContext } from '../../context/ThemeContext';

function LabelTextBox({
    name,
    placeholder,
    label,
    type, //type input
    text = '', //value
    error = '', // lỗi
    customGetValue, //getValue của input khi không submit qua form
    editable = true, //cho phép chỉnh sửa
    hoverable = true,
    onChange, //sự kiện onChange
    selectedSize, //chọn size
    area = false, //area thay cho input
    setChange, //thay đổi khi nhập vào input lần đầu => dùng để hiển thị error rỗng
    change, //nếu change là true => hiển thị error rỗng
    ...passProps
}) {
    const cx = classNames.bind(style);
    const { theme } = useContext(ThemeContext);
    const [inputValue, setInputValue] = useState(text); // Sử dụng giá trị text từ prop

    const handleChange = (event) => {
        if (editable) {
            setInputValue(event.target.value);
            setChange && setChange(true);
            if (customGetValue) {
                customGetValue(event.target.value);
            }
        }
    };

    useEffect(() => {
        // Update giá trị inputValue khi prop text thay đổi
        setInputValue(text);
    }, [text]);

    let inputClassname = '';
    switch (selectedSize) {
        case 'small':
            inputClassname = 'small';
            break;
        case 'medium':
            inputClassname = 'medium';
            break;
        case 'medium2':
            inputClassname = 'medium2';
            break;

        case 'large':
            inputClassname = 'large';
            break;

        case 'sizeTextAreaMedium':
            inputClassname = 'sizeTextAreaMedium';
            break;

        case 'sizeTextAreaMedium2':
            inputClassname = 'sizeTextAreaMedium2';
            break;
        default:
            // Nếu không có selectedSize hoặc không khớp, sử dụng một class mặc định hoặc không có class
            break;
    }

    const wrapperClasses = cx('wrapper', theme === 'dark' ? 'dark' : '');
    return (
        <div className={wrapperClasses}>
            <label>{label}</label>
            {area ? (
                <>
                    <textarea
                        name={name}
                        alt=""
                        className={cx(inputClassname)}
                        placeholder={placeholder}
                        value={inputValue}
                        disabled={!editable}
                        onChange={(event) => {
                            onChange && onChange(event);
                            handleChange(event);
                        }}
                    ></textarea>
                    <span className={cx('error')}>
                        {error === '' && inputValue === '' && change ? `${label} rỗng` : error !== '' ? error : ''}
                    </span>
                </>
            ) : (
                <>
                    <input
                        name={name}
                        type={type}
                        placeholder={placeholder}
                        value={inputValue}
                        disabled={!editable}
                        onChange={(event) => {
                            onChange && onChange(event);
                            handleChange(event);
                        }}
                        className={cx(inputClassname)}
                    />
                    <span className={cx('error')}>
                        {error === '' && inputValue === '' && change ? `${label} rỗng` : error !== '' ? error : ''}
                    </span>
                </>
            )}
        </div>
    );
}

LabelTextBox.propTypes = {
    name: PropTypes.string,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.oneOf(['text', 'date', 'password', 'radio']),
    text: PropTypes.string,
    editable: PropTypes.bool,
    hoverable: PropTypes.bool,
    onChange: PropTypes.func,
    selectedSize: PropTypes.oneOf(['small', 'medium', 'medium2', 'large', 'sizeTextAreaMedium', 'sizeTextAreaMedium2']),
};

export default LabelTextBox;
