/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';
import classNames from 'classnames';
import { get, has } from 'lodash';

import {
  CarbonMenuItemDivider,
  CarbonPopover,
  CarbonPopoverContent,
  Stack,
  SvgIcon,
  Typography
} from '@instana/components';
import { ShapeNode } from '@instana/carbon-charts';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import { RCATopologyTimeWindowContext } from 'in-events/components/RootCauseAnalysis/Topology/RootCauseTopologyDialog';
import getHealthInfoQueryParams from 'in-events/components/RootCauseAnalysis/Topology/utils/getHealthInfoQueryParams';
import getApplicationEntityHealthInfo from 'in-applications/subscriptions/getApplicationEntityHealthInfo';
import TopologyContextMenu from 'in-events/components/RootCauseAnalysis/Topology/TopologyContextMenu';
import { getIconForRCADisplay } from 'in-events/components/RootCauseAnalysis/utils/rootCauseUtil';
import { TopologyGraphNode } from 'in-events/components/RootCauseAnalysis/Topology/types';
import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import getEntityHealthInfo from 'in-kubernetes/subscriptions/getEntityHealthInfo';
import HealthIcon from 'in-components/health/HealthIcon/HealthIcon';
import IconButton from 'in-components/IconButton/IconButton';
import { TimeConfig } from 'in-types';

import locals from './RootCauseMap.mless';

interface TopologyNodeProps {
  node: TopologyGraphNode;
  currentlyOpen: string;
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

const getHealthIconStatusColor = (
  node: TopologyGraphNode,
  healthInfo:
    | {
        openIssues: any;
        maxSeverity: any;
      }
    | null
    | undefined
) => {
  if (node.tags.has('RCA')) {
    return 'var(--cds-support-caution-undefined)';
  }

  if (node.tags.has('TRIGGERING')) {
    return themes.default.cds.link['inverse-hover'];
  }

  if (has(healthInfo, 'maxSeverity')) {
    if (get(healthInfo, 'maxSeverity', 0) === 0) {
      return themes.default.ids.color.option.green[500];
    }

    if (get(healthInfo, 'maxSeverity') > 5) {
      return themes.default.ids.color.option.red[500];
    }

    return themes.default.ids.color.option.yellow[500];
  }

  return themes.default.ids.color.option.green[500];
};

const TopologyNode = ({ node, currentlyOpen, setCurrentlyOpen }: TopologyNodeProps) => {
  const { metadata, entityType, tags, x, y, height, width, id, label } = node;

  const timeConfig = useContext(RCATopologyTimeWindowContext) as TimeConfig;

  const entityIcon = getEntityIcon(entityType, metadata);

  const isRootCause = tags.has('RCA') && get(metadata, 'specialCaseVisibility', false);

  const isTE = tags.has('TRIGGERING');

  const healthInfoQuery =
    node?.entityType === 'infrastructure'
      ? getEntityHealthInfo({ snapshotId: node?.id, timeConfig }).map(result => ({
          openIssues: get(result, 'data.openIssues', []).length,
          maxSeverity: get(result, 'data.maxSeverity', 'UNKNOWN')
        }))
      : getApplicationEntityHealthInfo(getHealthInfoQueryParams(entityType, id, timeConfig)).map(result => ({
          openIssues: result?.data?.openIssues.length,
          maxSeverity: result?.data?.maxSeverity
        }));

  const healthInfo = useObservable(healthInfoQuery, []);

  const healthIconStatusColor = getHealthIconStatusColor(node, healthInfo);

  return (
    <foreignObject transform={`translate(${x}, ${y})`} height={height} width={width} style={{ overflow: 'visible' }}>
      <div className={locals.healthIcon} onClick={() => setCurrentlyOpen(id)}>
        <HealthIcon severity={healthInfo?.maxSeverity} iconSize="xs" />
      </div>
      <div style={{ height, width }}>
        <ShapeNode
          renderIcon={
            <CarbonPopover open={currentlyOpen === id} caret={false}>
              <SvgIcon type={entityIcon} color={isRootCause ? 'white' : undefined} />
              <CarbonPopoverContent className={locals.popoverWrapperTopology}>
                <div className={locals.popoverIndicator} style={{ backgroundColor: healthIconStatusColor }} />

                <Stack gap="disabled">
                  <div className={locals.popoverHeaderTopology}>
                    <Stack gap="disabled" direction="horizontal" distribution="spaceBetween" align="center">
                      <Typography variant="heading-compact-01" noWrap noMargin>
                        {node && node.label ? node.label : node.id}
                      </Typography>
                      <IconButton
                        type="lib_openclose_cancel"
                        size="compact"
                        iconSize="xs"
                        onClick={() => {
                          setCurrentlyOpen('');
                        }}
                      />
                    </Stack>
                  </div>
                  <CarbonMenuItemDivider />
                  <TopologyContextMenu node={node} healthInfo={healthInfo} />
                </Stack>
              </CarbonPopoverContent>
            </CarbonPopover>
          }
          size="100%"
          title={label}
          id={id}
          onClick={() => !(currentlyOpen === id) && setCurrentlyOpen(id)}
          className={classNames({
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
