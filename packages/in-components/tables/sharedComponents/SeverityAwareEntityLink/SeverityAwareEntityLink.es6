import React from 'react';

import { SeverityIndicatorCellContentWrapper } from 'in-components/tables/sharedComponents';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './SeverityAwareEntityLink.mless';

export default function SeverityAwareEntityLink({ severity, icon, label, href$ }) {
  return (
    <SeverityIndicatorCellContentWrapper severity={severity}>
      <div className={locals.flexWrapper}>
        <SvgIcon className={locals.linkEntityIcon} type={icon} width={24} height={24} />
        <Link href$={href$}>{label}</Link>
      </div>
    </SeverityIndicatorCellContentWrapper>
  );
}
