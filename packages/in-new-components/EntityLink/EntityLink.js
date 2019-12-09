import React from 'react';

import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './EntityLink.mless';

export default function EntityLink({ label, tooltip, href$, specialIndicator, subscriptComponent }) {
  const innerContent = tooltip ? (
    <Tooltip content={tooltip}>
      <Link href$={href$}>{label}</Link>
    </Tooltip>
  ) : (
    <>
      <Link href$={href$}>{label}</Link>
      {subscriptComponent}
    </>
  );

  if (!specialIndicator) {
    return innerContent;
  }

  return (
    <div>
      <span className={locals.specialIndicator} />
      {innerContent}
    </div>
  );
}
