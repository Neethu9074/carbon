/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import { useGoToGraph } from 'in-stores/navigation/paths/dashboardPaths';
import { graphViewFromInfraMapEnabled } from 'in-services/featureFlags';
import { getLabel, getShowZoneInSidebarHeader } from 'in-sdk/snapshot';
import ZoneTag from 'in-map/components/MapSidebar/components/ZoneTag';
import { shorten } from 'in-services/util/string';
import PluginIcon from 'in-components/PluginIcon';
import { getPluginName } from 'in-sdk/pluginName';
import { t } from 'in-i18n';

import locals from './SidebarHeader.mless';

export default function SidebarHeader({ snapshot }) {
  const plugin = snapshot.get('plugin');
  const entityType = getPluginName(plugin, 1);

  const graphHref = useGoToGraph(snapshot.get('id'));
  return (
    <div className={locals.sidebarHeader}>
      <div className={locals.entity}>
        <Icon snapshot={snapshot} graphHref={graphHref} />
        <div>
          <h2 className={locals.entityLabel}>{shorten(getLabel(snapshot) || '', 128)}</h2>
          <div className={locals.typeIdWrapper}>
            <span className={locals.entityType}>{entityType}</span>

            {getShowZoneInSidebarHeader(plugin) ? <ZoneTag snapshotId={snapshot.get('id')} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon({ snapshot, graphHref }) {
  if (graphViewFromInfraMapEnabled) {
    return (
      <Link href={graphHref} aria-label={t('in-map:accessibility.entityGraph')}>
        <PluginIcon className={locals.entityIcon} snapshot={snapshot} />
      </Link>
    );
  }
  return <PluginIcon className={locals.entityIcon} snapshot={snapshot} />;
}
