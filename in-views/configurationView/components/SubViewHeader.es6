import React from 'react';

import Section from 'in-views/configurationView/components/Section';

import './SubViewHeader.less';

const block = 'in-config-view-sub-view-header';

export default function SubViewHeader({ children }) {
  return (
    <Section>
      <h1 className={block}>
        {children}
      </h1>
    </Section>
  );
}
