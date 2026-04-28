import React from "react";
import { opsetteShareConfig } from "./config";
import "./share.css";

const OpsetteFooterLogo: React.FC = () => {
  const { logoSrc } = opsetteShareConfig;
  return (
    <div className="ops-footer-logo">
      <a href="https://opsette.io" target="_blank" rel="noopener noreferrer" className="ops-footer-logo-link" aria-label="Opsette home">
        {logoSrc ? <img src={logoSrc} alt="Opsette" className="ops-footer-logo-img" /> : <span className="ops-footer-logo-text">Opsette</span>}
      </a>
      <div className="ops-footer-logo-links">
        <a href="https://opsette.io" target="_blank" rel="noopener noreferrer">opsette.io</a>
        <span className="ops-footer-dot">·</span>
        <a href="https://tools.opsette.io" target="_blank" rel="noopener noreferrer">More free tools</a>
      </div>
    </div>
  );
};

export default OpsetteFooterLogo;
