import React from 'react';

import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './BackButton.mless';

export default function BackButton({ label, href, href$ }) {
  return (
    <Link className={locals.link} href={href} href$={href$}>
      <SvgIcon width={10} type="chevron_left" className={locals.icon} />
      {label}
    </Link>
  );
}
