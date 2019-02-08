import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import PluginIcon from 'in-components/PluginIcon';
import SvgIcon from 'in-components/SvgIcon';

import locals from './WithIcon.mless';

export default function WithIcon({ plugin, snapshot, icon, iconColor, iconSize, ellipsisContent = true, children }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [locals.ellipsis]: ellipsisContent
      })}
    >
      {plugin || snapshot ? (
        <PluginIcon
          style={{ fill: iconColor }}
          className={locals.pluginIcon}
          dimension={iconSize || 18}
          plugin={plugin}
          snapshot={snapshot}
        />
      ) : (
        <SvgIcon
          style={{ fill: iconColor }}
          className={locals.linkEntityIcon}
          type={icon}
          width={iconSize || 24}
          height={iconSize || 24}
        />
      )}
      {children}
    </div>
  );
}
