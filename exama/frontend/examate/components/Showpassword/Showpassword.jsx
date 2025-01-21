import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordToggle = ({ showPassword, setShowPassword, showConfirmPassword,isConfirmPassword, setShowConfirmPassword }) => {
    const buttonStyle = {
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        color:'#0094FF',
    };

    const handleClick = () => {
        if (isConfirmPassword) {
            setShowConfirmPassword(!showConfirmPassword);
        } else {
            setShowPassword(!showPassword);
        }
    };
    let iconToShow;
    if (isConfirmPassword) {
        iconToShow = showConfirmPassword ? <FaEye /> : <FaEyeSlash />;
    } else {
        iconToShow = showPassword ? <FaEye /> : <FaEyeSlash />;
    }
    


    return (
      <button
      style={buttonStyle}
      className="password-toggle showpassword"
      type="button"
      onClick={handleClick}
  >
        {iconToShow}
  </button>

    );
};

export default PasswordToggle;
