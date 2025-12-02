import React, {useState} from 'react';
import './TemplateCard.css';

interface TemplateCardProps {
  template: {
    id: number;
    title: string;
    description: string;
  };
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="template-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="template-preview">
        {/* Заглушка для превью шаблона */}
        <div className="preview-placeholder">
          <div className="preview-header"></div>
          <div className="preview-content">
            <div className="preview-line"></div>
            <div className="preview-line short"></div>
            <div className="preview-line"></div>
          </div>
        </div>
      </div>
      <div className="template-info">
        <h3 className="template-title">{template.title}</h3>
        <p className="template-description">{template.description}</p>
      </div>
      {isHovered && (
        <div className="template-overlay">
          <button className="select-btn">Выбрать шаблон</button>
        </div>
      )}
    </div>
  );
};

export default TemplateCard;