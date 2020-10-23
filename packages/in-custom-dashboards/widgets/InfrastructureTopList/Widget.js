import { combineLatest, just } from 'reactive-observables';
import React, { useState } from 'react';

import { host as hostType, container as containerType, process as processType } from 'in-stores/starredItems/types';
import columnDefinitions from 'in-custom-dashboards/widgets/InfrastructureTopList/columnDefinitions';
import TopListWidget, { getFlattenedIds } from 'in-custom-dashboards/widgets/TopListWidget';
import { entityTypeToFullyQualifiedPlugin } from 'in-infrastructure/tableView/stores/snapshotIds';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { physicalTablePath } from 'in-stores/navigation/paths/mainPaths';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { pendingResult } from 'in-services/fixedObjects';
import ButtonGroup from 'in-new-components/ButtonGroup';
import { add, remove } from 'in-stores/starredItems';
import { getSnapshot } from 'in-stores/snapshot';
import { getMetric } from 'in-stores/metric';
import search from 'in-subscription/search';
import { getLabel } from 'in-sdk/snapshot';

export default function InfrastructureTopList({ config }) {
  const [selectedType, setSelectedType] = useState('host');

  const generalProps = {
    ...config,
    getItems: args =>
      getItems({
        ...args,
        selectedType
      }),
    header: <Header selectedType={selectedType} setSelectedType={setSelectedType} />,
    columnDefinitions: columnDefinitions[selectedType],
    getId: ({ snapshotId }) => snapshotId,
    fullListView$: getModifiedUrlStream(location => {
      location.pathname = physicalTablePath;
      setOrDeleteMatrixKey(location, physicalTablePath, 'plugin', selectedType);
    }),
    getItem: (id, timeConfig) => getItem(id, timeConfig, selectedType),
    getItemLink: item =>
      getDashboardLink(item.snapshotId || item?.snapshot?.get('id'), { pathname: '/physical/dashboard' }),
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

function getItems({ query, selectedType, timeConfig, pinnedItemIdsByType }) {
  const pinnedIds = getFlattenedIds(pinnedItemIdsByType);

  return search({
    query,
    timeConfig,
    view: 'TABLE',
    restrictResultEntityType: entityTypeToFullyQualifiedPlugin[selectedType]
  }).flatMap(snapshotIds =>
    combineLatest(
      snapshotIds
        .toArray()
        .map(snapshotId => getMetricForType(snapshotId, selectedType).map(metric => ({ snapshotId, metric }))),
      false
    ) // Sort decending by metric value.
      .map(snapshotIdsWithMetrics => snapshotIdsWithMetrics.filter(Boolean).sort((s1, s2) => s2.metric - s1.metric))
      // Add the snapshot to the first 5 items and for the pinned items to the list
      .throttle(1000)
      .flatMap(snapshotIdsWithMetrics =>
        combineLatest(
          snapshotIdsWithMetrics.map((snapshotIdWithMetric, i) => {
            if (i >= 5 && pinnedIds.indexOf(snapshotIdWithMetric.snapshotId) === -1) {
              return just(snapshotIdWithMetric);
            }

            return getSnapshot(snapshotIdWithMetric.snapshotId).map(snapshot => ({
              ...snapshotIdWithMetric,
              snapshot
            }));
          })
        )
      )
      .throttle(500)
      .map(snapshotIdsWithMetrics => {
        return {
          errors: [],
          progress: {
            loading: false
          },
          data: {
            // Only return those that have the snapshot field set. The previous
            // flatMap step implements the rule as to when this should be done.
            items: snapshotIdsWithMetrics.filter(s => s.snapshot),
            totalHits: snapshotIds.size
          }
        };
      })
      .startWith(pendingResult)
  );
}

function getItem(id, timeConfig, selectedType) {
  return getSnapshot(id, timeConfig).flatMap(snapshot =>
    getMetricForType(snapshot.get('id'), selectedType).map(mainKpiValue => ({ snapshot, mainKpiValue }))
  );
}

function getMetricForType(snapshotId, type) {
  return getMetric({
    snapshotId,
    metric: type === 'host' ? 'cpu.used' : type === 'docker' ? 'cpu.total_usage' : 'cpu.user',
    timeWindowAggregation: 'mean',
    forceTimeWindowAggregation: true
  });
}
