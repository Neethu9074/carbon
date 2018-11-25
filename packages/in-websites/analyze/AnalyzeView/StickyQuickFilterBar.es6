import React from 'react';

import QuickFilterBar from 'in-websites/analyze/AnalyzeView/QuickFilterBar';
import Sticky from 'in-components/Sticky';

export default function StickyQuickFilterBar(props) {
  return <Sticky header={<QuickFilterBar {...props} />}>{props.children}</Sticky>;
}
