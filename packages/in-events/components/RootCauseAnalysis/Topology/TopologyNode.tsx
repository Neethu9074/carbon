/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';
import classNames from 'classnames';
import { get } from 'lodash';

import { ShapeNode } from '@instana/carbon-charts';
import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

import { RCATopologyTimeWindowContext } from 'in-events/components/RootCauseAnalysis/Topology/RootCauseTopologyDialog';
import getHealthInfoQueryParams from 'in-events/components/RootCauseAnalysis/Topology/utils/getHealthInfoQueryParams';
import getApplicationEntityHealthInfo from 'in-applications/subscriptions/getApplicationEntityHealthInfo';
import { getIconForRCADisplay } from 'in-events/components/RootCauseAnalysis/utils/rootCauseUtil';
import { TopologyGraphNode } from 'in-events/components/RootCauseAnalysis/Topology/types';
import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import getEntityHealthInfo from 'in-kubernetes/subscriptions/getEntityHealthInfo';
import HealthIcon from 'in-components/health/HealthIcon/HealthIcon';
import { TimeConfig } from 'in-types';

import locals from './RootCauseMap.mless';

interface TopologyNodeProps {
  node: TopologyGraphNode;
  setCurrentlyOpen: React.Dispatch<React.SetStateAction<string>>;
}

const getEntityIcon = (entityType: string, metadata: TopologyGraphNode['metadata']) => {
  if (!['service', 'application', 'endpoint', 'superService'].includes(entityType)) {
    const infraPlugin = translateFullyQualifiedPluginToShortPluginName(get(metadata, 'data.entityId.pluginId', ''));
    return getIconForRCADisplay('infrastructure', infraPlugin ?? entityType);
  } else if (entityType === 'superService') {
    return 'lib_application_service';
  }

  return getIconForRCADisplay(entityType);
};

const TopologyNode = ({ node, setCurrentlyOpen }: TopologyNodeProps) => {
  const { metadata, entityType, tags, x, y, height, width, id, label } = node;

  const timeConfig = useContext(RCATopologyTimeWindowContext) as TimeConfig;

  const entityIcon = getEntityIcon(entityType, metadata);

  const isRootCause = tags.has('RCA') && get(metadata, 'specialCaseVisibility', false);

  const isTE = tags.has('TRIGGERING');

  const healthInfoQuery =
    node?.entityType === 'infrastructure' || node?.entityType === 'process'
      ? getEntityHealthInfo({ snapshotId: node?.id, timeConfig }).map(result => ({
          openIssues: get(result, 'data.openIssues', []).length,
          maxSeverity: get(result, 'data.maxSeverity', 'UNKNOWN')
        }))
      : getApplicationEntityHealthInfo(getHealthInfoQueryParams(entityType, id, timeConfig)).map(result => ({
          openIssues: result?.data?.openIssues.length,
          maxSeverity: result?.data?.maxSeverity
        }));

  const healthInfo = useObservable(healthInfoQuery, []);

  return (
    <foreignObject x={x} y={y} height={height} width={width} style={{ overflow: 'visible' }}>
      <div className={locals.healthIcon}>
        <HealthIcon severity={healthInfo?.maxSeverity} iconSize="xs" />
      </div>
      <div style={{ height, width }}>
        <ShapeNode
          renderIcon={<SvgIcon type={entityIcon} color={isRootCause ? 'white' : undefined} />}
          size="100%"
          title={label}
          id={id}
          onClick={() => setCurrentlyOpen(id)}
          className={classNames({
            [locals.NodeBase]: true,
            [locals.rootCauseEntityNode]: isRootCause,
            [locals.triggeringEntityNode]: isTE,
            [locals.regularNode]: !isRootCause && !isTE
          })}
        />
      </div>
    </foreignObject>
  );
};

export default TopologyNode;
