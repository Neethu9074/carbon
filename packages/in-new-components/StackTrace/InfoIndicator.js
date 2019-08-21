import React from 'react';

import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './InfoIndicator.mless';

export default function InfoIndicator({ href, href$, children, target }) {
  return (
    <Tooltip content={<div className={locals.content}>{children}</div>}>
      {href || href$ ? (
        <Link href={href} href$={href$} target={target} className={locals.indicator}>
          ?
        </Link>
      ) : (
        <span className={locals.indicator}>?</span>
      )}
    </Tooltip>
  );
}
