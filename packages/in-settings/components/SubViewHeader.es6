import React from 'react';

import SectionLine from 'in-settings/components/SectionLine';

import locals from './SubViewHeader.mless';

export default function SubViewHeader({ children }) {
  return (
    <div className={locals.wrapper}>
      <h1 className={locals.header}>{children}</h1>
      <SectionLine withMarginBottom={false} />
    </div>
  );
}
