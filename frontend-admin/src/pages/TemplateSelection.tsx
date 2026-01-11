import React, { useState } from 'react';
import './TemplateSelection.css';

interface TemplateSelectionProps {
  onSelectTemplate: (name: string, template: string) => void;
  sitesCount: number;
}

const TEMPLATES = [
  {
    id: 'shop',
    name: 'Магазин',
    description: 'Онлайн магазин с категориями и товарами',
    icon: '🛍️',
  },
];

const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  onSelectTemplate,
  sitesCount,
}) => {
  const [siteName, setSiteName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('shop');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!siteName.trim()) {
      setError('Введите название сайта');
      return;
    }

    onSelectTemplate(siteName, selectedTemplate);
    setSiteName('');
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  return (
    <div className="template-selection-wrapper">
      <div className="template-selection">
        <div className="selection-header">
          <h1>Создайте новый сайт</h1>
          <p>Выберите шаблон и начните создавать</p>
        </div>

        <div className="selection-container">
          <div className="templates-section">
            <h2>Выберите шаблон</h2>
            <div className="templates-grid">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  className={`template-card ${
                    selectedTemplate === template.id ? 'selected' : ''
                  }`}
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setError('');
                  }}
                >
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                  {selectedTemplate === template.id && (
                    <div className="selected-badge">✓ Выбран</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h2>Название сайта</h2>
            <div className="form-group">
              <input
                type="text"
                value={siteName}
                onChange={(e) => {
                  setSiteName(e.target.value);
                  if (error) setError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder="Например: Мой интернет-магазин"
                className={error ? 'error' : ''}
              />
              {error && <span className="error-text">{error}</span>}
            </div>

            <button
              className="btn-create"
              onClick={handleCreate}
              disabled={!siteName.trim()}
            >
              Создать сайт
            </button>

            <div className="stats">
              <p>Всего сайтов: <strong>{sitesCount}</strong></p>
            </div>
          </div>
        </div>

        <div className="selection-footer">
          <p>💡 Совет: Вы можете создать несколько сайтов и сравнить их</p>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;
