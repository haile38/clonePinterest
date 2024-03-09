import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './Option.module.scss';

const cx = classNames.bind(style);

function Options({ name, type, title = '', data = [], select, onChange }) {
    const options =
        type === 'country'
            ? ['Vietnam', 'United States', 'Canada', 'United Kingdom', 'Australia']
            : type === 'language'
                ? ['Tiếng Việt', 'English', 'Spanish', 'French', 'German', 'Chinese']
                : type === 'gender'
                    ? ['Nam', 'Nữ', 'Khác']
                    : data;

    const label =
        type === 'country'
            ? 'Quốc gia/khu vực'
            : type === 'language'
                ? 'Ngôn ngữ'
                : type === 'gender'
                    ? 'Giới tính'
                    : title;
    const [selectedValue, setSelectedValue] = React.useState(select);
    useEffect(() => {
        setSelectedValue(select);
    }, [select]);

    const handleSelectChange = (event) => {
        const newValue = event.target.value;
        setSelectedValue(newValue);
    };

    return (
        <div className={cx('Options')}>
            <label className={cx('OptionsLabel')}>{label}:</label>
            <select name={name} value={selectedValue} onChange={onChange ? onChange : handleSelectChange}>
                <option value="">Chọn {label.toLowerCase()}</option>
                {options.map((option, index) => {
                    return (
                        <option key={index} value={data.length !== 0 ? option.id : option}>
                            {data.length !== 0 ? option.typeName : option}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}

export default Options;
