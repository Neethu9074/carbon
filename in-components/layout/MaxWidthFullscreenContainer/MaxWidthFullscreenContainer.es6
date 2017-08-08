import React from 'react';

import './MaxWidthFullscreenContainer.less';

const block = 'in-max-width-container';

export default function MaxWidthFullscreenContainer({ children }) {
  return (
    <div className={block}>
      {children}
    </div>
  );
}
