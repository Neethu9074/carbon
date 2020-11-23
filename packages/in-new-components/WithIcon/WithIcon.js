import React, { forwardRef } from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import PluginIcon from 'in-components/PluginIcon';
import SvgIcon from 'in-components/SvgIcon';

import locals from './WithIcon.mless';

export default forwardRef(function WithIcon({ plugin, snapshot, icon, iconColor, className, children }, ref) {
  return (
    <div className={locals.wrapper} ref={ref}>
      {plugin || snapshot ? (
        <PluginIcon
          style={{ fill: iconColor }}
          className={evaluateClassNames({
            [locals.pluginIcon]: true,
            [className]: className
          })}
          plugin={plugin}
          snapshot={snapshot}
        />
      ) : (
        <SvgIcon
          style={{ fill: iconColor }}
          className={evaluateClassNames({
            [locals.linkEntityIcon]: true,
            [className]: className
          })}
          type={icon}
        />
      )}
      <div className={locals.childWrapper}>{children}</div>
    </div>
  );
});
