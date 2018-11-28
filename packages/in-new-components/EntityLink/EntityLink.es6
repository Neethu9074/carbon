import React from 'react';

import PluginIcon from 'in-components/PluginIcon';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './EntityLink.mless';

export default function EntityLink({ label, plugin, icon, tooltip, href$, specialIndicator }) {
  return (
    <div className={locals.wrapper}>
      {specialIndicator && <span className={locals.specialIndicator} />}
      {plugin ? (
        <PluginIcon className={locals.pluginIcon} dimension={18} plugin={plugin} />
      ) : (
        <SvgIcon className={locals.linkEntityIcon} type={icon} width={24} height={24} />
      )}
      {tooltip ? (
        <Tooltip content={tooltip}>
          <Link href$={href$}>{label}</Link>
        </Tooltip>
      ) : (
        <Link href$={href$}>{label}</Link>
      )}
    </div>
  );
}
