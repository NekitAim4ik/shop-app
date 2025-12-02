import React, { useRef, useState } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState<string>('Конструктор сайтов');

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <div 
          className="logo-container" 
          onClick={handleLogoClick}
          title="Кликните для загрузки логотипа"
        >
          {logo && typeof logo === 'string' && logo.startsWith('data:image') ? (
            <img src={logo} alt="Логотип" className="logo-image" />
          ) : (
            <div className="logo-text">{logo}</div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
      </div>
      
      <div className="header-right">
        <button className="header-btn">Заказы</button>
        <button className="header-btn">Корзина</button>
        <div className="profile">Профиль</div>
      </div>
    </header>
  );
};

export default Header;