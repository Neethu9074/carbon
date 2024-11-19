/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Select } from '@instana/components';

import GraphExplorerPresenter from 'in-infrastructure/GraphExplorer/GraphExplorerPresenter';
import InfraPageHeaderWithTabs from 'in-infrastructure/components/InfraPageHeaderWithTabs';
import { getViewStructure } from 'in-infrastructure/perspectives/viewStructureStore';
import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import NotMonitoringMap from 'in-map/components/NotMonitoringMap';
import 'in-infrastructure/GraphExplorer/charts-react/styles.css';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import MapSidebar from 'in-map/components/MapSidebar';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import getGraph from 'in-subscription/graph';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './GraphExplorer.mless';

const nodeSize = 48;

export default function GraphExplorer() {
  return (
    <InfraPageHeaderWithTabs>
      <WithEmptyStateFallback getHasDataToRender={getHasDataToRender} FallbackComponent={NotMonitoringMap}>
        <ViewTrackingMeta
          data={{
            productArea: productAreas.infrastructure,
            pageRootName: pageNames.infra_graph_explorer
          }}
        />
        <Title title={t('in-infrastructure:graphExplorerView.infrastructureGraphExplorer')} />
        <section>
          <MapSidebar />
          <GraphExplorerWrapper />
        </section>
      </WithEmptyStateFallback>
    </InfraPageHeaderWithTabs>
  );
}
function getHasDataToRender() {
  return getViewStructure().map(structure => structure.viewStructure.children.length > 0);
}

const layouts = [
  { value: 'layered', label: 'Layered' },
  { value: 'force', label: 'Force' },
  { value: 'mrtree', label: 'MRTree' },
  { value: 'stress', label: 'Stress' }
];
export function GraphExplorerWrapper() {
  const { location, navigate } = useNavigation();
  const snapshotId = location.query.snapshotId;
  const setSnapshotId = snapshotId => {
    const targetLocation = cloneLocation(location);
    delete targetLocation.query.snapshotId;
    targetLocation.query.snapshotId = snapshotId;
    navigate(targetLocation);
  };
  const [layout, setLayout] = useState('layered');
  const connected = useObservable(
    combineLatest([
      getSnapshot(snapshotId).filter(Boolean).distinct(),
      timeConfig$
        .map(timeConfig => ({ snapshotId, timeConfig }))
        .flatMap(getGraph)
        .throttle(60 * 1000)
    ]).map(([snapshot, graph]) => ({
      selectedSnapshotId: snapshot.get('id'),
      ...getNodesAndLinks(snapshot.get('id'), graph)
    })),
    [snapshotId]
  );
  return (
    <div className={locals.view}>
      <Select
        value={layout}
        onChange={({ target }) => {
          setLayout(target.value);
        }}
      >
        {layouts.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      {connected && (
        <Graph {...connected} snapshotId={connected.snapshotId} layout={layout} setSnapshotId={setSnapshotId} />
      )}
    </div>
  );
}

function getNodesAndLinks(snapshotId, { edges, idsToPlugins }) {
  const nodes = new Set();
  const linkData = [];

  for (let item of edges) {
    nodes.add(item.from);
    nodes.add(item.to);
    linkData.push({
      id: item.id,
      source: item.from,
      target: item.to,
      labels: [{ text: item.relation }]
    });
  }

  return {
    nodeData: Array.from(nodes).map(id => ({
      id,
      height: nodeSize,
      width: nodeSize,
      plugin: translateFullyQualifiedPluginToShortPluginName(idsToPlugins[id])
    })),
    linkData,
    snapshotId
  };
}

function Graph({ nodeData, linkData, snapshotId, layout, setSnapshotId }) {
  return (
    <GraphExplorerPresenter
      nodes={nodeData}
      links={linkData}
      snapshotId={snapshotId}
      layout={layout}
      setSnapshotId={setSnapshotId}
    />
  );
}
