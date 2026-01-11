import React from 'react';
import type { Site } from './Protected';
import './MySites.css';

interface MySitesProps {
  sites: Site[];
  onEdit: (siteId: string) => void;
  onDelete: (siteId: string) => void;
}

const MySites: React.FC<MySitesProps> = ({ sites, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTotalProducts = (site: Site) => {
    return site.data.categories.reduce((sum, cat) => sum + cat.products.length, 0);
  };

  if (sites.length === 0) {
    return (
      <div className="my-sites">
        <div className="empty-state-large">
          <div className="empty-icon">🌐</div>
          <h2>У вас еще нет сайтов</h2>
          <p>Начните с создания первого сайта</p>
          <a href="/protected" className="btn-primary">
            Создать сайт
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="my-sites">
      <div className="sites-header">
        <h1>Мои сайты</h1>
        <p>Всего сайтов: {sites.length}</p>
      </div>

      <div className="sites-grid">
        {sites.map((site) => (
          <div key={site.id} className="site-card">
            <div className="card-header">
              <h2>{site.name}</h2>
              <span className="template-tag">{site.template}</span>
            </div>

            <div className="card-content">
              <p className="description">
                {site.data.description || 'Нет описания'}
              </p>

              <div className="stats">
                <div className="stat">
                  <span className="stat-label">Категории</span>
                  <span className="stat-value">{site.data.categories.length}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Товары</span>
                  <span className="stat-value">{getTotalProducts(site)}</span>
                </div>
              </div>

              <div className="dates">
                <small>
                  Создан: {formatDate(site.createdAt)}
                </small>
                <small>
                  Обновлен: {formatDate(site.updatedAt)}
                </small>
              </div>
            </div>

            <div className="card-actions">
              <button
                className="btn-edit"
                onClick={() => onEdit(site.id)}
              >
                Редактировать
              </button>
              <button
                className="btn-delete"
                onClick={() => {
                  if (window.confirm(`Удалить сайт "${site.name}"?`)) {
                    onDelete(site.id);
                  }
                }}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySites;
