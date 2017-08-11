import React from 'react';

import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import './BackButton.less';

const block = 'in-dash-tab-view-back';

export default function BackButton({ label, href, href$ }) {
  return (
    <Link className={block} href={href} href$={href$}>
      <SvgIcon width={10} type="chevron_left" className={`${block}__arrow`} />
      {label}
    </Link>
  );
}
