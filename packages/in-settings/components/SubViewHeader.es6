import React from 'react';

import SectionLine from 'in-settings/components/SectionLine';
import SvgIcon from 'in-components/SvgIcon';

import locals from './SubViewHeader.mless';

export default function SubViewHeader({ children, iconType, iconColor = '#000000' }) {
  return (
    <div className={locals.wrapper}>
      {iconType && <SvgIcon className={locals.icon} type={iconType} width={28} height={28} color={iconColor} />}
      <h1 className={locals.header}>{children}</h1>
      <SectionLine withMarginBottom={false} />
    </div>
  );
}
