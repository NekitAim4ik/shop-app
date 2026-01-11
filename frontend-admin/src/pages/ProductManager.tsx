import React, { useState } from 'react';
import type { Product } from './Protected';
import './ProductManager.css';

interface ProductManagerProps {
  products: Product[];
  categoryId?: string;
  onUpdate: (product: Product) => void;
  onDelete: (productId: string) => void;
  onBack?: () => void;
  categoryName?: string;
}

const ProductManager: React.FC<ProductManagerProps> = ({
  products,
  categoryId,
  onUpdate,
  onDelete,
  onBack,
  categoryName,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
  });

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.price || !formData.stock) {
      alert('Заполните все обязательные поля');
      return;
    }

    const product: Product = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      stock: parseInt(formData.stock),
    };

    onUpdate(product);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      stock: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      stock: product.stock.toString(),
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  return (
    <div className="product-manager">
      <div className="manager-section">
        <div className="manager-header">
          <div className="header-title">
            {onBack && <button className="back-btn" onClick={onBack}>← Назад</button>}
            <h2>🛍️ Товары {categoryName && `в "${categoryName}"`}</h2>
          </div>
          <button
            className="btn-add"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Добавить товар
          </button>
        </div>

        {showForm && (
          <div className="form-section">
            <h3>{editingId ? 'Редактировать' : 'Новый'} товар</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Название товара *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Например: MacBook Pro"
                />
              </div>

              <div className="form-group">
                <label>Цена *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="99999"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Количество на складе *</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  placeholder="10"
                  min="0"
                />
              </div>

              <div className="form-group full-width">
                <label>Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Описание товара"
                  rows={3}
                />
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

        {products.length > 0 ? (
          <div className="products-table">
            <h3>Товары ({products.length})</h3>
            <table>
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Цена</th>
                  <th>На складе</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>
                      <p className="description">{product.description}</p>
                    </td>
                    <td className="price">{product.price}₽</td>
                    <td className="stock">{product.stock} шт</td>
                    <td>
                      <span
                        className={`badge ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}`}
                      >
                        {product.stock > 10
                          ? '✓ В наличии'
                          : product.stock > 0
                          ? '⚠ Мало'
                          : '✗ Нет'}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(product)}
                      >
                        Редактировать
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => {
                          if (window.confirm('Удалить товар?')) {
                            onDelete(product.id);
                          }
                        }}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>Товаров еще нет. Добавьте первый товар!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManager;