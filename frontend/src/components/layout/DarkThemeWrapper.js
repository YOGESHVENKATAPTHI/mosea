import React from 'react';

const DarkThemeWrapper = ({ children }) => {
  const wrapperStyle = {
    minHeight: '100vh',
    backgroundColor: '#121212',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  return <div style={wrapperStyle}>{children}</div>;
};

export default DarkThemeWrapper;