/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import * as Immutable from 'immutable';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';

import Tooltip from 'in-components/Tooltip/Tooltip';
import PluginIcon from 'in-components/PluginIcon';
import theme from 'in-themes';

import locals from './WithIcon.mless';

interface WithPluginIconProps extends WithIconProps {
  plugin: string;
  snapshot?: Immutable.Map<string, unknown>;
}

interface WithLibraryIconProps extends WithIconProps {
  icon: string;
}

interface WithIconProps {
  iconColor?: string;
  className?: string;
  children?: React.ReactNode;
  tooltip?: string;
}

export default forwardRef(function WithIcon(
  props: WithPluginIconProps | WithLibraryIconProps,
  ref: React.ForwardedRef<Element>
) {
  const { iconColor, className, children, tooltip } = props;
  const { plugin, snapshot } = props as WithPluginIconProps;
  const { icon } = props as WithLibraryIconProps;
  return (
    <div className={locals.wrapper} ref={ref as React.ForwardedRef<HTMLDivElement>}>
      <Tooltip content={tooltip}>
        <div className={locals.innerWrapper}>
          {plugin || snapshot ? (
            <PluginIcon
              color={iconColor ?? theme.lib.colors.N700Medium}
              className={classNames({
                [locals.pluginIcon]: true,
                [className as any]: className
              })}
              plugin={plugin}
              snapshot={snapshot}
            />
          ) : (
            <SvgIcon
              color={iconColor ?? theme.lib.colors.N700Medium}
              className={classNames({
                [locals.linkEntityIcon]: true,
                [className as any]: className
              })}
              type={icon}
            />
          )}
          <div className={locals.childWrapper}>{children}</div>
        </div>
      </Tooltip>
    </div>
  );
});
