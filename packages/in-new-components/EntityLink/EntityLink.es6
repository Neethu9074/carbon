import React from 'react';

import WithIcon from 'in-new-components/WithIcon';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import theme from 'in-themes';

import locals from './EntityLink.mless';

export default function EntityLink({ label, plugin, snapshot, icon, tooltip, href$, specialIndicator }) {
  let content = (
    <WithIcon plugin={plugin} snapshot={snapshot} icon={icon} iconColor={theme.lib.colors.blue800}>
      {tooltip ? (
        <Tooltip content={tooltip}>
          <Link href$={href$}>{label}</Link>
        </Tooltip>
      ) : (
        <Link className={locals.link} href$={href$}>
          {label}
        </Link>
      )}
    </WithIcon>
  );

  if (specialIndicator) {
    content = (
      <div>
        <span className={locals.specialIndicator} />
        {content}
      </div>
    );
  }

  return content;
}
