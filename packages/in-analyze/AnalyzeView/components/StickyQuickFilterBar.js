import React from 'react';

import QuickFilterBar from 'in-analyze/AnalyzeView/components/QuickFilterBar';
import Sticky from 'in-components/Sticky';

export default function StickyQuickFilterBar(props) {
  return <Sticky header={<QuickFilterBar {...props} />}>{props.children}</Sticky>;
}
