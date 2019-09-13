import React from 'react';

import BadgeList from 'in-new-components/Badge/BadgeList';
import theme from 'in-themes';

import locals from './TechPreviewBadge.mless';

export default function TechPreviewBadge() {
  return (
    <div className={locals.wrapper}>
      <BadgeList kind="lighter" type="Tech Preview" getColor={() => theme.lib.colors.N600Light} />
    </div>
  );
}
