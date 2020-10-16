import React from 'react';

import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './EmptyPane.mless';

export default function EmptyPane({ icon, emptyMessage, detailMessage }) {
  return (
    <div className={locals.emptyPane}>
      <SvgIcon type={icon} />
      <span className={locals.emptyMessage}>{emptyMessage}</span>
      {detailMessage && <span className={locals.detailMessage}>{detailMessage}</span>}
    </div>
  );
}
