import React from 'react';

import PluginIcon from 'in-components/PluginIcon';

import './ImageAndLabel.less';

const block = 'in-table-view-image-and-label';

export default function ImageAndLabel({ snapshot, children }) {
  return (
    <div className={block}>
      <PluginIcon className={`${block}__image`} color="#000" snapshot={snapshot} size="xs" />
      {children}
    </div>
  );
}
