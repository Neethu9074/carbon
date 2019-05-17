import React from 'react';

import LoadingIndicator from 'in-components/LoadingIndicator';

import './CellLoadingIndicator.less';

const block = 'in-cell-loading';

export default function CellLoadingIndicator() {
  return <LoadingIndicator type="dark" className={block} />;
}

export const cellLoadingIndicatorInstance = <CellLoadingIndicator />;
