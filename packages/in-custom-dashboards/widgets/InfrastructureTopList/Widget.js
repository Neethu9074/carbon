import { combineLatest, just } from 'reactive-observables';
import React, { useState } from 'react';

import { host as hostType, container as containerType, process as processType } from 'in-stores/starredItems/types';
import columnDefinitions from 'in-custom-dashboards/widgets/InfrastructureTopList/columnDefinitions';
import { entityTypeToFullyQualifiedPlugin } from 'in-views/tableView/stores/snapshotIds';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { physicalTablePath } from 'in-stores/navigation/paths/mainPaths';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import TopListWidget from 'in-custom-dashboards/widgets/TopListWidget';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { pendingResult } from 'in-services/fixedObjects';
import ButtonGroup from 'in-new-components/ButtonGroup';
import { add, remove } from 'in-stores/starredItems';
import { search } from 'in-stores/snapshot/snapshot';
import { getSnapshot } from 'in-stores/snapshot';
import { getMetric } from 'in-stores/metric';
import { getLabel } from 'in-sdk/snapshot';

export default function InfrastructureTopList({ config }) {
  const [selectedType, setSelectedType] = useState('host');

  const generalProps = {
    ...config,
    getItems: ({ query }) => getItems(query, selectedType),
    header: <Header selectedType={selectedType} setSelectedType={setSelectedType} />,
    columnDefinitions: columnDefinitions[selectedType],
    getId: ({ snapshot }) => snapshot.get('id'),
    fullListView$: getModifiedUrlStream(location => {
      location.pathname = physicalTablePath;
      setOrDeleteMatrixKey(location, physicalTablePath, 'plugin', selectedType);
    }),
    getItem: (id, timeConfig) => getItem(id, timeConfig, selectedType),
    getItemLink: item => getDashboardLink(item.snapshot.get('id'), { pathname: '/physical/dashboard' }),
    unpinItem: (id, type) => remove({ id, type })
  };

  if (selectedType === 'host') {
    return (
      <TopListWidget
        {...generalProps}
        pinnedItemTypes={[hostType]}
        pinItem={(id, item) =>
          add({
            id,
            label: getLabel(item.snapshot),
            type: hostType
          })
        }
        fullListViewLinkTitle="All Hosts"
      />
    );
  }

  if (selectedType === 'docker') {
    return (
      <TopListWidget
        {...generalProps}
        pinnedItemTypes={[containerType]}
        pinItem={(id, item) =>
          add({
            id,
            label: getLabel(item.snapshot),
            type: containerType
          })
        }
        fullListViewLinkTitle="All Containers"
      />
    );
  }

  return (
    <TopListWidget
      {...generalProps}
      pinnedItemTypes={[processType]}
      pinItem={(id, item) =>
        add({
          id,
          label: getLabel(item.snapshot),
          type: processType
        })
      }
      fullListViewLinkTitle="All Processes"
    />
  );
}

function Header({ selectedType, setSelectedType }) {
  return (
    <ButtonGroup
      buttonPropsList={[
        {
          text: 'Hosts',
          key: 'host',
          onClick: () => setSelectedType('host')
        },
        {
          text: 'Containers',
          key: 'docker',
          onClick: () => setSelectedType('docker')
        },
        {
          text: 'Processes',
          key: 'process',
          onClick: () => setSelectedType('process')
        }
      ]}
      activeKey={selectedType}
    />
  );
}

function getItems(query, selectedType) {
  return search({
    customQuery: query,
    restrictResultEntityType: entityTypeToFullyQualifiedPlugin[selectedType]
  })
    .flatMap(({ snapshots }) => {
      if (!snapshots) {
        return just(null);
      }
      return enrichWithAndSortByMetric(snapshots, selectedType);
    })
    .map(snapshots => {
      if (!snapshots) {
        return pendingResult;
      }

      return {
        errors: [],
        progress: {
          loading: false
        },
        data: {
          items: snapshots.map(snapshot => ({ snapshot })),
          totalHits: snapshots.length
        }
      };
    });
}

function getItem(id, timeConfig, selectedType) {
  return getSnapshot(id, timeConfig).flatMap(snapshot =>
    getMetricForType(snapshot.get('id'), selectedType).map(mainKpiValue => ({ snapshot, mainKpiValue }))
  );
}

function enrichWithAndSortByMetric(snapshots, selectedType) {
  return combineLatest(
    snapshots.map(snapshot => getMetricForType(snapshot.get('id', selectedType)).map(metric => ({ snapshot, metric })))
  ).map(enrichedSnapshots => {
    enrichedSnapshots.sort((s1, s2) => s2.metric - s1.metric);
    return enrichedSnapshots.map(({ snapshot }) => snapshot);
  });
}

function getMetricForType(snapshotId, type) {
  return getMetric({
    snapshotId,
    metric: type === 'host' ? 'cpu.used' : type === 'docker' ? 'cpu.total_usage' : 'cpu.user',
    timeWindowAggregation: 'mean',
    forceTimeWindowAggregation: true
  });
}
