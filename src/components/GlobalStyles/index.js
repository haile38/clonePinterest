import PropTypes from 'prop-types';
import './GlobalStyles.scss';
import { ThemeContext } from '../../context/ThemeContext';
import { useContext } from 'react';

function GlobalStyles({ children }) {
    const { theme } = useContext(ThemeContext);
    const bodyClass = theme === 'dark' ? 'dark' : '';
    document.body.className = bodyClass;

    return children;
}

GlobalStyles.propTypes = {
    children: PropTypes.node.isRequired,
};

export default GlobalStyles;
