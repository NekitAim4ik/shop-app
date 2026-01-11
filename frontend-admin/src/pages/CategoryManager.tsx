import React, { useState } from 'react';
import type { Category } from './Protected';
import './CategoryManager.css';

interface CategoryManagerProps {
  categories: Category[];
  onUpdate: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onSelectCategory?: (categoryId: string) => void;
}

const CATEGORY_ICONS = ['📂', '🛍️', '👕', '👟', '💻', '📱', '🍕', '☕', '🎮', '📚', '🎨', '⚽', '🏠', '💄', '🔧', '📸'];

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onUpdate,
  onDelete,
  onSelectCategory,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: CATEGORY_ICONS[0],
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Введите название категории');
      return;
    }

    const category: Category = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      products: editingId 
        ? categories.find(c => c.id === editingId)?.products || []
        : [],
    };

    onUpdate(category);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', icon: CATEGORY_ICONS[0] });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon || CATEGORY_ICONS[0],
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleSelectCategory = (categoryId: string) => {
    onSelectCategory?.(categoryId);
  };

  return (
    <div className="category-manager">
      <div className="manager-section">
        <div className="manager-header">
          <h2>📂 Категории</h2>
          <button
            className="btn-add"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Добавить категорию
          </button>
        </div>

        {showForm && (
          <div className="form-section">
            <h3>{editingId ? 'Редактировать' : 'Новая'} категория</h3>
            <div className="form-group">
              <label>Название *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Например: Электроника"
              />
            </div>

            <div className="form-group">
              <label>Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Описание категории"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Иконка</label>
              <div className="icon-picker">
                {CATEGORY_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className={`icon-btn ${formData.icon === icon ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, icon })}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-save" onClick={handleSubmit}>
                {editingId ? 'Обновить' : 'Создать'}
              </button>
              <button className="btn-cancel" onClick={resetForm}>
                Отмена
              </button>
            </div>
          </div>
        )}

        {categories.length > 0 ? (
          <div className="categories-list">
            <h3>Существующие категории ({categories.length})</h3>
            <div className="list">
              {categories.map((category) => (
                <div key={category.id} className="category-item">
                  <div className="item-main" onClick={() => onSelectCategory?.(category.id)}>
                    <div className="item-icon">{category.icon || '📂'}</div>
                    <div className="item-content">
                      <h4>{category.name}</h4>
                      <p>{category.description || 'Нет описания'}</p>
                      <small className="product-count">
                        {category.products?.length || 0} товар{(category.products?.length || 0) % 10 === 1 ? '' : 'ов'}
                      </small>
                    </div>
                    {onSelectCategory && (
                      <span className="select-hint">→</span>
                    )}
                  </div>
                  <div className="item-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(category)}
                    >
                      Редактировать
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => {
                        if (window.confirm('Удалить категорию?')) {
                          onDelete(category.id);
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
        ) : (
          <div className="empty-state">
            <p>Категорий еще нет. Добавьте первую категорию!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;