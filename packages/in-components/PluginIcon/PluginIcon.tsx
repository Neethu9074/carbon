/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';

import { Size } from '@instana/components/types/components/SvgIcon/types';
import { themes } from '@instana/design-tokens';
import { SvgIcon } from '@instana/components';

import {
  isWebsitePlugin,
  isSyntheticPlugin,
  isMobileAppPlugin,
  isLogPlugin,
  isOtelDatabasePlugin
} from 'in-forge/plugins/pluginTypes';
import { getIconType as getInfraIconType } from 'in-infrastructure/infrastructureIconType';
import { capitalize } from 'in-services/formatters/string';
import { SnapshotMap } from 'in-components/EntityLink';
import { getPluginName } from 'in-sdk/pluginName';

export interface PluginIconProps extends Omit<React.ComponentProps<typeof SvgIcon>, 'type'> {
  size?: Size;
  color?: string;
  snapshot?: SnapshotMap;
  plugin: string;
}

export default forwardRef(function PluginIcon(props: PluginIconProps, ref: React.ForwardedRef<SVGSVGElement>) {
  const { size, color = themes.default.ids.color.option.neutral['700'] } = props;
  const pluginName = getPluginName(props.plugin) || capitalize(props.snapshot?.get('plugin') as string) || 'Unknown';
  return (
    <SvgIcon
      ref={ref}
      {...props}
      size={size}
      color={color}
      aria-label={`${pluginName} icon`}
      type={getIconType(props.snapshot, props.plugin)}
    />
  );
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
    if (isMobileAppPlugin(plugin)) {
      return 'lib_mobile_app';
    }
    if (isLogPlugin(plugin)) {
      return 'lib_application_logging';
    }
  }
  if (isOtelDatabasePlugin(plugin || (snapshot?.get('plugin') as string))) {
    return dataBaseIcon(snapshot, plugin);
  }

  return getInfraIconType(snapshot ?? plugin!);
}

function dataBaseIcon(snapshot?: SnapshotMap, plugin?: string): string {
  const data = snapshot?.get('data') as Map<string, unknown>;
  const database = (data?.get('resource.db.system') as string)?.toLowerCase();
  switch (database) {
    case 'db2':
      return 'lib_infra_db2Database';
    case 'mysql':
      return 'lib_infra_mySqlDatabase';
    case 'mongodb':
      return 'lib_infra_mongoDb';
    case 'informix':
      return 'lib_infra_informix';
    default:
      return getInfraIconType(snapshot ?? plugin!);
  }
}
