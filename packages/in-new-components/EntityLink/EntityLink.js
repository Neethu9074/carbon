import theme from 'in-themes';
import React from 'react';

import WithIcon from 'in-new-components/WithIcon';
import { noop } from 'in-services/util/function';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './EntityLink.mless';

export default function EntityLink({
  label,
  plugin,
  snapshot,
  icon,
  tooltip,
  href$,
  specialIndicator,
  subscriptComponent,
  onClick = noop
}) {
  const iconColor = href$ && theme.lib.colors.blue800;

  const link = (
    <Link href$={href$} onClick={onClick}>
      {label}
    </Link>
  );

  const innerContent = (
    <WithIcon plugin={plugin} snapshot={snapshot} icon={icon} iconColor={iconColor}>
      {tooltip ? (
        <Tooltip content={tooltip}>{link}</Tooltip>
      ) : (
        <>
          {link}
          {subscriptComponent}
        </>
      )}
    </WithIcon>
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
