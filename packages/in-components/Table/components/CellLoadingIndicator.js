import React from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';

import './CellLoadingIndicator.less';

const block = 'in-cell-loading';

export default function CellLoadingIndicator() {
  return <LoadingIndicator className={block} />;
}

export const cellLoadingIndicatorInstance = <CellLoadingIndicator />;
