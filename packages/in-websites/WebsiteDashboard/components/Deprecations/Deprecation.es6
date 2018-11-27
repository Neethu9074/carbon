import React from 'react';

import ExpandableCard from 'in-new-components/ExpandableCard';
import Pill from 'in-new-components/Pill';

import locals from './Deprecation.mless';

export default function Deprecation({ title, preview, children, supportedUntil }) {
  return (
    <ExpandableCard title={title} preview={preview} header={<Pill color="#fa0">Support ends {supportedUntil}</Pill>}>
      <div className={locals.content}>{children}</div>
    </ExpandableCard>
  );
}
