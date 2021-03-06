import React from 'react';

const Footer = () => (
  <footer className="opacity-50 flex justify-around text-primary p-4 mt-16 border-t border-primary items-center">
    <div className="text-2xl space-x-4">
      <a
        className="link-off"
        href="https://discord.gg/ujvNJcr"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-discord" />
      </a>
      <a
        className="link-off"
        href="https://github.com/quorth0n/artify"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-github" />
      </a>
      <a
        className="link-off"
        href="https://www.instagram.com/galla.app/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-instagram" />
      </a>
    </div>
    <div>
      <p>Galla Closed Beta v1.0</p>
      By{' '}
      <a
        href="https://github.com/quorth0n/"
        target="_blank"
        rel="noopener noreferrer"
      >
        quorth0n
      </a>
    </div>
  </footer>
);
export default React.memo(Footer);
