import theme from 'in-themes';
import React from 'react';

import WithIcon from 'in-new-components/WithIcon';
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
  subscriptComponent
}) {
  const iconColor = href$ && theme.lib.colors.blue800;

  const innerContent = (
    <WithIcon plugin={plugin} snapshot={snapshot} icon={icon} iconColor={iconColor}>
      {tooltip ? (
        <Tooltip content={tooltip}>
          <Link href$={href$}>{label}</Link>
        </Tooltip>
      ) : (
        <>
          <Link href$={href$}>{label}</Link>
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
