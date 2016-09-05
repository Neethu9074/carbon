import React from 'react';

import spanCategoryColors from 'in-stores/colorCoding/spanCategories';
import {getCategoryIcon} from 'in-sdk/tracing';

import './CategoryIcon.less';


const block = 'in-trace-category-icon';

export default function CategoryIcon({category, className}) {
  const categoryColor = spanCategoryColors[category];

  return (
    <div className={`${block} ${className}`}
         style={{
           background: categoryColor
         }}>
      <img src={getCategoryIcon(category)}
           alt={`Icon for the span category ${category}`}
           className={block + '__icon'} />
    </div>
  );
}
