/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';

import PluginIcon from 'in-components/PluginIcon';

import locals from './WithIcon.mless';

export default forwardRef(function WithIcon({ plugin, snapshot, icon, iconColor, className, children }, ref) {
  return (
    <div className={locals.wrapper} ref={ref}>
      {plugin || snapshot ? (
        <PluginIcon
          style={{ fill: iconColor }}
          className={classNames({
            [locals.pluginIcon]: true,
            [className]: className
          })}
          plugin={plugin}
          snapshot={snapshot}
        />
      ) : (
        <SvgIcon
          style={{ fill: iconColor }}
          className={classNames({
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
