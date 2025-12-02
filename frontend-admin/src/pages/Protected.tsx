import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import './Protected.css';
import Header from './Header';
import TemplateGrid from './TemplateGrid';

const Protected = () => {
    const accessToken = localStorage.getItem('accessToken');

    const [selectedCategory, setSelectedCategory] = useState('Все');

    const categories = [
    'Все', 'Образование', 'Услуги', 'Прием платежей', 'Товары', 'Универсальные'
  ];

    if (!accessToken) {
        return <Navigate to="/login" replace />
    }

    return (
        <div className="app">
      <Header />
      <main className="main-content">
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        <TemplateGrid selectedCategory={selectedCategory} />
      </main>
    </div>
    );
};

export default Protected;