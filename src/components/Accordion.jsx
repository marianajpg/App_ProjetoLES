import React, { useState } from 'react';
import '../styles/Accordion.css';

const Accordion = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleItemClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div key={index} className="accordion-item" data-cy={`delivery-address-accordion-${item.id}`}>
          <div className="accordion-header" onClick={() => handleItemClick(index)}>
            {item.title}
            <span className={`accordion-icon ${activeIndex === index ? 'open' : ''}`}>&#9660;</span>
          </div>
          {activeIndex === index && (
            <div className="accordion-content">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;