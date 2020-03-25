import theme from 'in-themes';
import React from 'react';

import SectionLine from 'in-settings/components/SectionLine';
import SvgIcon from 'in-components/SvgIcon';

import locals from './SubViewHeader.mless';

export default function SubViewHeader({ children, subscript, iconType, iconColor = theme.lib.colors.black }) {
  return (
    <div className={locals.wrapper}>
      {iconType && <SvgIcon className={locals.icon} type={iconType} color={iconColor} />}
      <h1 className={locals.header}>{children}</h1>
      {subscript && <h2 className={locals.subscript}>{subscript}</h2>}
      <SectionLine withMarginBottom={false} />
    </div>
  );
}
