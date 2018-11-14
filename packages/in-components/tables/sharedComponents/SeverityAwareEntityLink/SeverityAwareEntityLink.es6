import React from 'react';

import { SeverityIndicatorCellContentWrapper } from 'in-components/tables/sharedComponents';
import EntityLink from 'in-new-components/EntityLink/EntityLink';

export default function SeverityAwareEntityLink({ severity, icon, label, href$ }) {
  return (
    <SeverityIndicatorCellContentWrapper severity={severity}>
      <EntityLink label={label} href$={href$} icon={icon} />
    </SeverityIndicatorCellContentWrapper>
  );
}
