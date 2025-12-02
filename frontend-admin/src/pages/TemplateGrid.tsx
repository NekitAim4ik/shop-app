import React from 'react';
import TemplateCard from './TemplateCard';
import './TemplateGrid.css';

interface Template {
  id: number;
  title: string;
  category: string;
  description: string;
}

const TemplateGrid: React.FC<{ selectedCategory: string }> = ({ selectedCategory }) => {
  const templates: Template[] = [
    { id: 1, title: 'Пустой шаблон', category: 'Универсальные', description: 'Начните с чистого листа' },
    { id: 2, title: 'Менеджер по работе с маркетплейсами с нуля', category: 'Образование', description: 'Для онлайн-курсов' },
    { id: 3, title: 'Менеджер по работе с маркетплейсами', category: 'Услуги', description: 'Для специалистов' },
    { id: 4, title: 'Страница оплаты', category: 'Прием платежей', description: 'Прием онлайн-платежей' },
    { id: 5, title: 'Фитнес студия', category: 'Услуги', description: 'Для фитнес-клубов' },
    { id: 6, title: 'НЕ ПРОСТО ФИТНЕС', category: 'Товары', description: 'Фитнес-продукция' },
    { id: 7, title: 'Клинический психолог Анна Иванова', category: 'Услуги', description: 'Персональный сайт' },
    { id: 8, title: 'Ключевые слова', category: 'Универсальные', description: 'SEO-оптимизация' },
    { id: 9, title: 'Моделирование будущего', category: 'Образование', description: 'Онлайн-тренинг' },
  ];

  const filteredTemplates = selectedCategory === 'Все' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  return (<div className="template-grid">
      {filteredTemplates.map(template => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
};

export default TemplateGrid;