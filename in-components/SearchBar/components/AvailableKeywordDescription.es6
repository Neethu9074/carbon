import React from 'react';

import './AvailableKeywordDescription.less';

const block = 'in-search-available-keyword-description';

export default function AvailableKeywordDescription({field}) {
  return (
    <div className={block}>
      <p className={`${block}__usage-hint`}>
        Click to copy keyword to search bar.
      </p>

      <p className={`${block}__description`}>
        {field.description}
      </p>
    </div>
  );
}
