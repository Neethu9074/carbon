import React from 'react';

import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './TimeThresholdConfig.mless';

export default function AlertThresholdConfigItemContainer({ children, iconType }) {
  return (
    <div className={locals.alertConfigItemContainer}>
      <SvgIcon className={locals.icon} type={iconType} />
      {children}
    </div>
  );
}
