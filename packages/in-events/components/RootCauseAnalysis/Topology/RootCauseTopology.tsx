/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import ELK, { ElkExtendedEdge, ElkNode } from 'elkjs/lib/elk.bundled';
import React, { useContext, useEffect, useState } from 'react';
import classNames, { Argument } from 'classnames';
import { path as d3Path } from 'd3-path';
import { get } from 'lodash';

import {
  CarbonMenuItemDivider,
  CarbonPopover,
  CarbonPopoverContent,
  IconButton,
  Stack,
  SvgIcon,
  Typography
} from '@instana/components';
import { ShapeNode, Edge } from '@instana/carbon-charts';
import { generateUniqueShortId } from '@instana/utils';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import '@instana/carbon-charts/lib/index.css';

import {
  ConnectionsMap,
  getAPMetricsObservable,
  getLegacyAPMetricsObservable,
  nodeInfo,
  NodesMap,
  RCA_TOPOLOGY_TAGS
} from 'in-events/components/legacy/TopologyUtils';
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior/ApplicationEntityHealthIndicatorBehavior';
import {
  createTagFilterExpressionForAnalysisOfApplicationSA,
  getIconForRCADisplay
} from 'in-events/components/RootCauseAnalysis/utils/rootCauseUtil';
import {
  RCATopologyAPContext,
  RCATopologyTimeWindowContext
} from 'in-events/components/RootCauseAnalysis/Topology/RootCauseTopologyDialog';
//@ts-expect-error
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import { RootCauseTopologySVGWrapper } from 'in-events/components/RootCauseAnalysis/Topology/RootCauseTopologySVGWrapper';
import getApplicationEntityHealthInfo from 'in-applications/subscriptions/getApplicationEntityHealthInfo';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
//@ts-expect-error
import EntityHealthIndicator from 'in-components/EntityHealthIndicator';
import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import getEntityHealthInfo from 'in-kubernetes/subscriptions/getEntityHealthInfo';
import { meanLatency, number, percentage } from 'in-services/formatters/number';
import HealthIcon from 'in-components/health/HealthIcon/HealthIcon';
import { getSparkChartGranularity } from 'in-applications/metrics';
import { MetricDataSeries } from 'in-components/Chart/types';
import BadgeList from 'in-components/BadgeList/BadgeList';
import { getColor } from 'in-applications/endpointTypes';
import SparkChart from 'in-components/SparkChart';
import { Nullish, TimeConfig } from 'in-types';
import { t } from 'in-i18n';

import locals from './RootCauseMap.mless';

interface RootCauseTopologyProps {
  relationships: ConnectionsMap[];
  nodes: NodesMap;
  width: string;
  height: string;
  selectedRCAID: string | Nullish;
}

interface GraphNode extends ElkNode {
  entityType: string;
  label: string;
  metadata: any;
  tags: Set<RCA_TOPOLOGY_TAGS>;
}

interface GraphLink extends ElkExtendedEdge {
  dashed: boolean;
  metrics: any;
}

const nodeSize = 48;

export default function RootCauseTopology({
  relationships,
  nodes,
  width,
  height,
  selectedRCAID
}: RootCauseTopologyProps) {
  const links = convertRelationshipsToConnections(relationships);
  const graphNodes = convertRCANodesToElkNodes(nodes);

  const [algorithm, setAlgorithm] = useState('layered');

  return (
    <div className={locals.wrapper}>
      <RootCauseTopologyPresenter
        nodes={graphNodes}
        links={links}
        width={width}
        height={height}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        selectedRCAID={selectedRCAID}
      />
    </div>
  );
}

function convertRelationshipsToConnections(relationships: ConnectionsMap[]): GraphLink[] {
  const linkData: GraphLink[] = [];

  relationships.forEach(relationship => {
    if (relationship) {
      linkData.push({
        sources: [relationship.from],
        targets: [relationship.to],
        id: generateUniqueShortId(),
        dashed: relationship.connectionType === 'outgoing',
        labels: relationship.label ? [{ text: relationship.label }] : undefined,
        metrics: relationship.metrics
      });
    }
  });

  return linkData;
}

function convertRCANodesToElkNodes(nodes: NodesMap): GraphNode[] {
  const nodeData: GraphNode[] = [];

  const getNodePriority = (node: nodeInfo) => {
    if (node.entityType === 'application') return '1';
    if (node.entityType === 'service' || node.entityType === 'superService') return '2';
    if (node.entityType === 'endpoint' || node.entityType === 'infrastructure') return '3';

    return '4';
  };

  Object.values(nodes).forEach(node => {
    nodeData.push({
      id: node.id,
      entityType: node.entityType,
      metadata: { ...node },
      height: nodeSize,
      width: nodeSize,
      label: node.label,
      tags: node.tags,
      layoutOptions: { 'partitioning.partition': getNodePriority(node) }
    });
  });

  return nodeData;
}

interface TopologyPresenterProps {
  nodes: GraphNode[];
  links: ElkExtendedEdge[];
  width: string;
  height: string;
  algorithm: string;
  setAlgorithm: React.Dispatch<React.SetStateAction<string>>;
  selectedRCAID: string | Nullish;
}
function RootCauseTopologyPresenter({
  nodes,
  links,
  width,
  height,
  algorithm,
  setAlgorithm,
  selectedRCAID
}: TopologyPresenterProps) {
  const [positions, setPositions] = useState<ElkNode>();
  const [currentlyOpen, setCurrentlyOpen] = useState<string>('');

  useEffect(() => {
    const graph: GraphNode = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': algorithm,
        'elk.padding': '[left=50, top=50, right=50, bottom=50]',
        separateConnectedComponents: 'true',
        'spacing.nodeNode': '100',
        'spacing.nodeNodeBetweenLayers': '200',
        'elk.partitioning.activate': 'true',
        'elk.layered.separateConnectedComponents': 'true'
      },
      children: nodes,
      edges: links,
      entityType: '',
      metadata: undefined,
      label: '',
      tags: new Set()
    };
    new ELK().layout(graph).then((g: ElkNode) => setPositions(g));
  }, [links, nodes, algorithm]);

  if (!positions) return null;

  const nodeElements = positions.children?.map(node => (
    <NewNode
      key={node.id}
      {...node}
      //@ts-expect-error
      entityType={node.entityType}
      //@ts-expect-error
      data={node}
      //@ts-expect-error
      label={node.label}
      currentlyOpen={currentlyOpen}
      setCurrentlyOpen={setCurrentlyOpen}
    />
  ));
  //@ts-expect-error
  const linkElements = positions.edges?.map(edge => <NewLink key={`link_${edge.id}`} link={edge} dash={edge.dashed} />);
  const defs = (
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
        <path d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
  );

  const getCenterAround = () => {
    if (selectedRCAID) {
      const foundNode = positions.children?.find(node => node.id === selectedRCAID);
      if (foundNode && foundNode.x && foundNode.y) {
        const { x, y } = foundNode;
        return {
          x,
          y
        };
      }
    }
    return null;
  };

  return (
    <RootCauseTopologySVGWrapper
      width={width}
      height={height}
      defs={defs}
      algorithm={algorithm}
      setAlgorithm={setAlgorithm}
      centerAround={getCenterAround()}
    >
      {linkElements}
      {nodeElements}
    </RootCauseTopologySVGWrapper>
  );
}

interface NewNodeProps extends GraphNode {
  currentlyOpen: string;
  setCurrentlyOpen: React.Dispatch<React.SetStateAction<string>>;
}

function NewNode(node: NewNodeProps) {
  const { x, y, height, width, entityType, id, label, tags, metadata, currentlyOpen, setCurrentlyOpen } = node;
  const timeConfig = useContext(RCATopologyTimeWindowContext) as TimeConfig;
  const relatedAP = useContext(RCATopologyAPContext)[0];

  let entityIcon = '';

  if (
    entityType !== 'service' &&
    entityType !== 'application' &&
    entityType !== 'endpoint' &&
    entityType !== 'superService'
  ) {
    const infraPlugin = translateFullyQualifiedPluginToShortPluginName(metadata?.data?.entityId?.pluginId);
    entityIcon = getIconForRCADisplay('infrastructure', infraPlugin ?? entityType);
  } else if (entityType === 'superService') {
    entityIcon = 'lib_application_service';
  } else {
    entityIcon = getIconForRCADisplay(entityType);
  }

  const isRootCause = (tags.has('RCA') && metadata.specialCaseVisibility) ?? false;
  const isTE = tags.has('TRIGGERING') ?? false;

  const nodeStyleProperties: Argument[] = [
    {
      [locals.rootCauseEntityNode]: isRootCause,
      [locals.triggeringEntityNode]: isTE,
      [locals.regularNode]: !isRootCause && !isTE
    }
  ];

  const healthInfoQueryParams = {
    applicationId: node?.entityType === 'application' ? node?.id : undefined,
    serviceId: node?.entityType === 'service' ? node?.id : undefined,
    endpointId: node?.entityType === 'endpoint' ? node?.id : undefined,
    timeConfig
  };

  // Used for AP entities
  const legacyMetricQuery = {
    applicationId: node?.entityType === 'application' ? node?.id : '',
    serviceId: node?.entityType === 'service' ? node?.id : undefined,
    endpointId: node?.entityType === 'endpoint' ? node?.id : undefined,
    timeConfig
  };

  const healthInfoQuery =
    node?.entityType === 'infrastructure'
      ? getEntityHealthInfo({ snapshotId: node?.id, timeConfig: timeConfig }).map(result => {
          return {
            openIssues: result?.data?.openIssues.length,
            maxSeverity: result?.data?.maxSeverity
          };
        })
      : getApplicationEntityHealthInfo(healthInfoQueryParams).map(result => ({
          openIssues: result?.data?.openIssues.length,
          maxSeverity: result?.data?.maxSeverity
        }));

  const healthInfo = useObservable(healthInfoQuery, [node]);
  const [healthIconStatusColor, setHealthIconStatusColor] = useState(themes.default.ids.color.option.neutral[500]);

  const filterFormModel = createTagFilterExpressionForAnalysisOfApplicationSA(
    node.entityType,
    node.metadata.data,
    node.id,
    null,
    relatedAP ? relatedAP.label : null,
    node.entityType === 'endpoint' ? node.label : null
  );
  const tagFilterExpression = toBackendQueryModel(filterFormModel);

  const realTimeMetrics = useObservable(
    node.entityType === 'infrastructure'
      ? getAPMetricsObservable(tagFilterExpression, timeConfig) // For infra AP metrics
      : getLegacyAPMetricsObservable(legacyMetricQuery), // for rest of AP entites
    [node]
  );

  useEffect(() => {
    if (node.tags.has('RCA')) {
      setHealthIconStatusColor(themes.default.ids.color.option.purple[500]);
    } else if (node.tags.has('TRIGGERING')) {
      setHealthIconStatusColor(themes.default.cds.link['inverse-hover']);
    } else if (healthInfo?.maxSeverity) {
      if (healthInfo.openIssues === 0) {
        return setHealthIconStatusColor(themes.default.ids.color.option.green[500]);
      } else if (healthInfo.maxSeverity > 5) {
        return setHealthIconStatusColor(themes.default.ids.color.option.red[500]);
      } else {
        return setHealthIconStatusColor(themes.default.ids.color.option.yellow[500]);
      }
    } else {
      setHealthIconStatusColor(themes.default.ids.color.option.green[500]); // no health info looks green
    }
  }, [healthInfo, node.tags]);

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
                  <AdditionalContextMenu
                    entity={node}
                    timeConfig={timeConfig as TimeConfig}
                    realTimeMetric={realTimeMetrics}
                    healthInfo={healthInfo}
                  />
                </Stack>
              </CarbonPopoverContent>
            </CarbonPopover>
          }
          size="100%"
          title={label}
          id={id}
          onClick={() => !(currentlyOpen === id) && setCurrentlyOpen(id)}
          className={classNames(nodeStyleProperties)}
        />
      </div>
    </foreignObject>
  );
}

function NewLink({ link, dash = false }: { link: ElkExtendedEdge; dash: boolean }) {
  if (!link.sections) {
    return null;
  }
  const sections = link.sections[0];
  const path = d3Path();

  path.moveTo(sections.startPoint.x, sections.startPoint.y);

  if (sections.bendPoints) {
    sections.bendPoints.forEach(b => {
      path.lineTo(b.x, b.y);
    });
  }

  path.lineTo(sections.endPoint.x, sections.endPoint.y);
  const label = link.labels?.[0];
  const labelText = label?.text;
  const labelX = label?.x;
  const labelY = label?.y;

  const hasLabel = labelText && labelX && labelY;
  return (
    <>
      <Edge path={path.toString()} markerEnd={!dash ? 'arrow' : undefined} variant={dash ? 'dash-md' : ''} />
      {hasLabel && <LabelText text={labelText} x={labelX} y={labelY} />}
    </>
  );
}

function LabelText({ text, x, y }: { text: string; x: number; y: number }) {
  return (
    <text x={x} y={y}>
      {text}
    </text>
  );
}

interface AdditionalContextMenuProps {
  entity: GraphNode;
  timeConfig: TimeConfig;
  realTimeMetric: Record<string, MetricDataSeries> | null | undefined;
  healthInfo:
    | {
        openIssues: number | undefined;
        maxSeverity: number | undefined;
      }
    | null
    | undefined;
}

function AdditionalContextMenu({ entity, timeConfig, realTimeMetric, healthInfo }: AdditionalContextMenuProps) {
  const badgeTypes = entity.metadata.data.endpointTypes ?? [];
  const technologies = entity.metadata.data.technologies ?? [];
  return (
    <React.Fragment>
      <div className={locals.popoverMainContentTopology}>
        <Stack gap="xsmall">
          <Stack direction="horizontal" gap="disabled">
            {badgeTypes?.length > 0 && <BadgeList type="" types={badgeTypes} getColor={getColor} limit={2} />}
            {technologies?.length > 0 && <TechnologyIndicatorList limit={2} technologies={technologies} />}
          </Stack>
          {realTimeMetric && <MetricDisplay metricResult={realTimeMetric} />}
        </Stack>
      </div>
      <CarbonMenuItemDivider />
      <div className={locals.popoverFooterTopology}>
        <Stack direction="horizontal" gap="small">
          {entity.entityType !== 'infrastructure' && (
            <ApplicationEntityHealthIndicatorBehavior
              maxSeverity={healthInfo?.maxSeverity}
              openIssues={healthInfo?.openIssues}
              timeConfig={timeConfig}
              applicationId={entity.entityType === 'application' ? entity?.id : ''}
              serviceId={entity?.entityType === 'service' ? entity?.id : undefined}
              endpointId={entity?.entityType === 'endpoint' ? entity?.id : undefined}
              IndicatorPresenter={HealthIndicatorButtonPresenter}
            />
          )}

          {entity.entityType === 'infrastructure' && (
            <EntityHealthIndicator
              IndicatorPresenter={(props: any) => <HealthIndicatorButtonPresenter size="normal" {...props} />}
              snapshotId={entity?.id}
              timeConfig={timeConfig}
            />
          )}
        </Stack>
      </div>
    </React.Fragment>
  );
}

function MetricDisplay({ metricResult }: { metricResult: any }) {
  const timeConfig = useContext(RCATopologyTimeWindowContext);
  if (!timeConfig) return null;

  const rollup = getSparkChartGranularity(timeConfig);

  return (
    <Stack direction="horizontal" distribution="spaceEvenly" align="start">
      <SparkChartWithMetric
        title={t('in-applications:titleTotalCalls')}
        rollup={rollup}
        timeConfig={timeConfig}
        aggregation="SUM"
        metrics={get(metricResult, ['calls'])}
        metric={get(metricResult, ['callsAgg'])}
        tooltipFormatter={v => (v ? number.compact(v) : number.compact(0))}
      />
      <SparkChartWithMetric
        title={t('in-applications:titleErroneousCalls')}
        rollup={rollup}
        timeConfig={timeConfig}
        aggregation="MEAN"
        metrics={get(metricResult, ['errors'])}
        metric={get(metricResult, ['errorsAgg'])}
        tooltipFormatter={v => (v ? percentage.compact(v) : percentage.compact(0))}
      />
      <SparkChartWithMetric
        title={t('in-applications:titleAvgLatency')}
        rollup={rollup}
        timeConfig={timeConfig}
        aggregation="MEAN"
        metrics={get(metricResult, ['latency'])}
        metric={get(metricResult, ['latencyAgg'])}
        tooltipFormatter={v => (v ? meanLatency.compact(v) : meanLatency.compact(0))}
      />
    </Stack>
  );
}

interface SparkChartWithMetricProps {
  title: string;
  rollup: number;
  timeConfig: TimeConfig;
  aggregation: string;
  metrics: any;
  metric: any;
  tooltipFormatter: (v: number | null | undefined) => string;
}

function SparkChartWithMetric(props: SparkChartWithMetricProps) {
  const { title, metric, tooltipFormatter } = props;
  return (
    <div>
      <h3>{title}</h3>
      <SparkChart
        {...props}
        verticalMetricValue={metric && metric.length > 0 ? tooltipFormatter(metric[0][1]) : null}
      />
    </div>
  );
}
