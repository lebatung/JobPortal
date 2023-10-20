import React from 'react';


const footerStyle = {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    textAlign: 'center',
    position: 'absolute',
    bottom: '0',
    width: '100%',
}

function Footer() {
  return (
    <footer style={footerStyle}>
      <p>&copy; {new Date().getFullYear()} My Website. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
