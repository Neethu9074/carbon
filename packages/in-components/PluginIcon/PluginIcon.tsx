/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';

import { Size } from '@instana/components/types/components/SvgIcon/types';
import { SvgIcon } from '@instana/components';

import { getIconType as getInfraIconType } from 'in-infrastructure/infrastructureIconType';
import { isWebsitePlugin, isSyntheticPlugin } from 'in-forge/plugins/pluginTypes';
import { SnapshotMap } from 'in-components/EntityLink';
import theme from 'in-themes';

interface PluginIconProps extends Omit<React.ComponentProps<typeof SvgIcon>, 'type'> {
  size?: Size;
  color?: string;
  snapshot?: SnapshotMap;
  plugin: string;
}

export default forwardRef(function PluginIcon(props: PluginIconProps, ref: React.ForwardedRef<SVGSVGElement>) {
  const { size, color = theme.lib.colors.N700Medium } = props;
  return <SvgIcon ref={ref} {...props} size={size} color={color} type={getIconType(props.snapshot, props.plugin)} />;
});

function getIconType(snapshot?: SnapshotMap, plugin?: string): string {
  if (plugin) {
    // we are not checking for isAppDataPlugin, because instead prefer to use the application/service/endpoint icons
    // from 'lib_infra_*' which look more consistent to other icons
    if (isWebsitePlugin(plugin)) {
      return 'lib_website';
    }
    if (isSyntheticPlugin(plugin)) {
      return 'lib_synthetic';
    }
  }

  return getInfraIconType(snapshot ?? plugin!);
}
