/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Link } from '@instana/components';

import { useGetLinkToSnapshotInCurrentView } from 'in-stores/navigation/paths/dashboardPaths';
import HealthyPluginIcon from 'in-components/health/HealthyPluginIcon';
import { getPhysicalHierarchy, getSnapshot } from 'in-stores/snapshot';
import { emptyList } from 'in-services/fixedImmutables';
import { entitySelectedTracker } from 'in-map/tracker';
import { getPluginName } from 'in-sdk/pluginName';
import Tooltip from 'in-components/Tooltip';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './SidebarBreadcrumb.mless';

const Crumb = connectTo(
  props => {
    return {
      snapshot: getSnapshot(props.snapshotId)
    };
  },
  function Crumb({ snapshot, selectedSnapshotId, snapshotId }) {
    const snapshotRef = useGetLinkToSnapshotInCurrentView(snapshotId);
    if (!snapshot) {
      return null;
    }

    const plugin = snapshot.get('plugin');
    const tooltip = `${getPluginName(plugin, 1)}: ${getLabel(snapshot)}`;

    let imgClasses = locals.crumbIcon;
    const isSelected = snapshot.get('id') === selectedSnapshotId;
    if (isSelected) {
      imgClasses = locals.crumbIconSelected;
    }

    return (
      <Tooltip content={tooltip} align="rightMiddle">
        <li className={locals.crumb}>
          <Link
            href={snapshotRef}
            title={t('in-map:selectThisEntity')}
            className={locals.crumbLink}
            onClick={() => {
              entitySelectedTracker({ origin: 'elevator', type: plugin, path: location.pathname });
            }}
          >
            <HealthyPluginIcon
              className={imgClasses}
              snapshotId={snapshotId}
              plugin={plugin}
              snapshot={snapshot}
              size="s"
            />
          </Link>
        </li>
      </Tooltip>
    );
  }
);

export default connectTo(
  props => {
    return {
      physicalHierarchy: getPhysicalHierarchy({
        snapshotId: props.snapshotId
      }).startWith(emptyList)
    };
  },
  function SidebarBreadcrumb({ physicalHierarchy, snapshotId }) {
    if (!physicalHierarchy || physicalHierarchy.size <= 1) {
      return null;
    }

    physicalHierarchy = physicalHierarchy.toArray();

    return (
      <ul
        className={classNames({
          [locals.sidebarBreadcrumb]: true
        })}
        data-walkme-id="wm-stack"
      >
        {physicalHierarchy.map(id => (
          <Crumb key={id} snapshotId={id} selectedSnapshotId={snapshotId} />
        ))}
      </ul>
    );
  }
);
