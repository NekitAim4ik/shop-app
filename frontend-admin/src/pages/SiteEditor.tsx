import React, { useState } from 'react';
import type { Site, Category, Product } from './Protected';
import ProductManager from './ProductManager';
import CategoryManager from './CategoryManager';
import './SiteEditor.css';

interface SiteEditorProps {
  site: Site;
  onSave: (data: Site['data']) => void;
  onClose: () => void;
}

type Tab = 'general' | 'categories' | 'preview';

const SiteEditor: React.FC<SiteEditorProps> = ({ site, onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [data, setData] = useState(site.data);
  const [saved, setSaved] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const handleSave = () => {
    onSave(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateCategory = (category: Category) => {
    setData({
      ...data,
      categories: data.categories.some(c => c.id === category.id)
        ? data.categories.map(c => (c.id === category.id ? category : c))
        : [...data.categories, category],
    });
  };

  const deleteCategory = (categoryId: string) => {
    setData({
      ...data,
      categories: data.categories.filter(c => c.id !== categoryId),
    });
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
    }
  };

  const updateProduct = (categoryId: string, product: Product) => {
    setData({
      ...data,
      categories: data.categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              products: cat.products.some(p => p.id === product.id)
                ? cat.products.map(p => (p.id === product.id ? product : p))
                : [...cat.products, product],
            }
          : cat
      ),
    });
  };

  const deleteProduct = (categoryId: string, productId: string) => {
    setData({
      ...data,
      categories: data.categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, products: cat.products.filter(p => p.id !== productId) }
          : cat
      ),
    });
  };

  const getTotalProducts = () => {
    return data.categories.reduce((sum, cat) => sum + cat.products.length, 0);
  };

  return (
    <div className="site-editor">
      <div className="editor-header">
        <div className="editor-title">
          <button className="back-btn" onClick={onClose}>
            ← Назад
          </button>
          <div>
            <h1>{site.name}</h1>
            <p className="template-badge">Шаблон: {site.template}</p>
          </div>
        </div>
        <div className="editor-actions">
          {saved && <span className="save-indicator">✓ Сохранено</span>}
          <button className="btn-save" onClick={handleSave}>
            Сохранить
          </button>
        </div>
      </div>

      <div className="editor-tabs">
        <button
          className={`tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          ⚙️ Общие
        </button>
        <button
          className={`tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          📂 Категории ({data.categories.length})
        </button>
        <button
          className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          👁️ Предпросмотр ({getTotalProducts()})
        </button>
      </div>

      <div className="editor-content">
        {activeTab === 'general' && (
          <div className="tab-content">
            <div className="section">
              <h2>Основная информация</h2>
              <div className="form-group">
                <label>Название сайта</label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) =>
                    setData({ ...data, title: e.target.value })
                  }
                  placeholder="Введите название"
                />
              </div>
              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={data.description}
                  onChange={(e) =>
                    setData({ ...data, description: e.target.value })
                  }
                  placeholder="Введите описание сайта"
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="tab-content">
            <div className="categories-editor">
              <CategoryManager
                categories={data.categories}
                onUpdate={updateCategory}
                onDelete={deleteCategory}
                onSelectCategory={setSelectedCategoryId}
              />

              {selectedCategoryId && (
                <div className="products-editor-section">
                  <ProductManager
                    products={data.categories.find(c => c.id === selectedCategoryId)?.products || []}
                    categoryId={selectedCategoryId}
                    onUpdate={(product) => updateProduct(selectedCategoryId, product)}
                    onDelete={(productId) => deleteProduct(selectedCategoryId, productId)}
                    onBack={() => setSelectedCategoryId(null)}
                    categoryName={data.categories.find(c => c.id === selectedCategoryId)?.name || ''}
                  />
                </div>
              )}

              {!selectedCategoryId && data.categories.length > 0 && (
                <div className="products-select-hint">
                  <p>👆 Нажмите на категорию чтобы добавить товары</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="tab-content">
            <SitePreview site={site} data={data} />
          </div>
        )}
      </div>
    </div>
  );
};

interface SitePreviewProps {
  site: Site;
  data: Site['data'];
}

const SitePreview: React.FC<SitePreviewProps> = ({ site, data }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const selectedCategory = data.categories.find(c => c.id === selectedCategoryId);

  return (
    <div className="site-preview-wrapper">
      <div className="site-preview-container">
        <div className="preview-hero">
          <svg className="hero-bg" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 0.9 }} />
                <stop offset="100%" style={{ stopColor: '#1e40af', stopOpacity: 0.9 }} />
              </linearGradient>
              <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)" />
              </pattern>
            </defs>
            <rect width="1200" height="400" fill="url(#heroGradient)" />
            <rect width="1200" height="400" fill="url(#dots)" />
            <circle cx="0" cy="0" r="200" fill="rgba(255,255,255,0.05)" />
            <circle cx="1200" cy="400" r="300" fill="rgba(255,255,255,0.05)" />
          </svg>
          <div className="hero-content">
            <h1>{data.title}</h1>
            <p>{data.description || 'Добро пожаловать на наш сайт'}</p>
          </div>
        </div>

        <div className="preview-section">
          {data.categories.length === 0 ? (
            <div className="empty-preview">
              <div className="empty-icon">🛒</div>
              <p>Добавьте категории товаров для предпросмотра</p>
            </div>
          ) : (
            <>
              <div className="categories-container">
                <h2 className="section-title">Наши категории</h2>
                <div className="categories-grid">
                  {data.categories.map((cat) => (
                    <button
                      key={cat.id}
                      className={`category-card ${selectedCategoryId === cat.id ? 'selected' : ''}`}
                      onClick={() => setSelectedCategoryId(cat.id)}
                    >
                      <div className="category-card-bg"></div>
                      <div className="category-card-icon">{cat.icon || '📂'}</div>
                      <h3>{cat.name}</h3>
                      <p className="product-count">{cat.products.length} товар{cat.products.length % 10 === 1 ? '' : 'ов'}</p>
                    </button>
                  ))}
                </div>
              </div>

              {selectedCategory && selectedCategory.products.length > 0 && (
                <div className="products-display">
                  <div className="section-header">
                    <h2>{selectedCategory.icon} {selectedCategory.name}</h2>
                    <p className="section-description">{selectedCategory.description}</p>
                  </div>

                  <div className="products-showcase">
                    {selectedCategory.products.map((product) => (
                      <div key={product.id} className="product-card">
                        <div className="product-image">
                          {product.image ? (
                            <img src={product.image} alt={product.name} />
                          ) : (
                            <div className="product-placeholder">📦</div>
                          )}
                          {product.stock <= 0 && <div className="out-of-stock">Нет в наличии</div>}
                        </div>
                        <div className="product-content">
                          <h4>{product.name}</h4>
                          <p className="product-description">{product.description}</p>
                          <div className="product-meta">
                            <span className="price">{product.price}₽</span>
                            <span className={`stock-badge ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out'}`}>
                              {product.stock > 0 ? `${product.stock} шт` : 'Нет'}
                            </span>
                          </div>
                          <button className="btn-buy" disabled={product.stock <= 0}>
                            {product.stock > 0 ? 'В корзину' : 'Недоступно'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCategory && selectedCategory.products.length === 0 && (
                <div className="empty-category">
                  <p>В этой категории пока нет товаров</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteEditor;