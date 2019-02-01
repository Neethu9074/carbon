import React from 'react';

import SectionLine from 'in-views/configurationView/components/SectionLine';

import locals from './SubViewHeader.mless';

export default function SubViewHeader({ children }) {
  return (
    <div className={locals.wrapper}>
      <h1 className={locals.header}>{children}</h1>
      <SectionLine withMarginBottom={false} />
    </div>
  );
}
