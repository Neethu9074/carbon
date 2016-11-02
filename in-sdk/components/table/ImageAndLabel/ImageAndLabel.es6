import React from 'react';

import './ImageAndLabel.less';

const block = 'in-table-view-image-and-label';

export default function ImageAndLabel({imgSrc, imgAlt, children}) {
  return (
    <div className={block}>
      <img src={imgSrc}
           alt={imgAlt}
           className={`${block}__image`}/>

      {children}
    </div>
  );
}
