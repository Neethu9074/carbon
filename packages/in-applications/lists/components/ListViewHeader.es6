import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';

import locals from './ListViewHeader.mless';

export default function ListViewHeader() {
  return (
    <div className={locals.listViewHeader}>
      <MaxWidthFullscreenContainer />
    </div>
  );
}
