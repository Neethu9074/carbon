import { combineLatest } from 'reactive-observables';
import React, { useState } from 'react';

import columnDefinitions from 'in-custom-dashboards/widgets/InfrastructureTopList/columnDefinitions';
import { entityTypeToFullyQualifiedPlugin } from 'in-views/tableView/stores/snapshotIds';
import { physicalTablePath } from 'in-stores/navigation/paths/mainPaths';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import TopListWidget from 'in-custom-dashboards/widgets/TopListWidget';
import { pin, unpin, types } from 'in-cockpit/pinnedItems/pinnedItems';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getResultForData } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import ButtonGroup from 'in-new-components/ButtonGroup';
import { search } from 'in-stores/snapshot/snapshot';
import { getSnapshot } from 'in-stores/snapshot';

export default function InfrastructureTopList(props) {
  const [selectedType, setSelectedType] = useState('host');

  const generalProps = {
    ...props,
    icon: 'lib_infrastructure_inverted',
    getItems: ({ query }) => getItems(query, selectedType),
    header: <Header selectedType={selectedType} setSelectedType={setSelectedType} />,
    columnDefinitions: columnDefinitions[selectedType],
    getId: item => item.get('id'),
    fullListView$: getModifiedUrlStream(location => {
      location.pathname = physicalTablePath;
      setOrDeleteMatrixKey(location, physicalTablePath, 'plugin', selectedType);
    })
  };

  if (selectedType === 'host') {
    return (
      <TopListWidget
        {...generalProps}
        pinnedItemTypes={[types.HOSTS]}
        pinItem={id => pin(types.HOSTS, id)}
        unpinItem={id => unpin(types.HOSTS, id)}
        getItemsByGroupedIds={(groupedIds, timeConfig) => getItemsByGroupedIds(groupedIds[types.HOSTS], timeConfig)}
        fullListViewLinkTitle="All Hosts"
      />
    );
  }

  if (selectedType === 'docker') {
    return (
      <TopListWidget
        {...generalProps}
        pinnedItemTypes={[types.CONTAINERS]}
        pinItem={id => pin(types.CONTAINERS, id)}
        unpinItem={id => unpin(types.CONTAINERS, id)}
        getItemsByGroupedIds={(groupedIds, timeConfig) =>
          getItemsByGroupedIds(groupedIds[types.CONTAINERS], timeConfig)
        }
        fullListViewLinkTitle="All Containers"
      />
    );
  }

  return (
    <TopListWidget
      {...generalProps}
      pinnedItemTypes={[types.PROCESSES]}
      pinItem={id => pin(types.PROCESSES, id)}
      unpinItem={id => unpin(types.PROCESSES, id)}
      getItemsByGroupedIds={(groupedIds, timeConfig) => getItemsByGroupedIds(groupedIds[types.PROCESSES], timeConfig)}
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
  }).map(({ snapshots }) => {
    if (!snapshots) {
      return pendingResult;
    }
    return {
      errors: [],
      progress: {
        loading: false
      },
      data: {
        items: snapshots,
        totalHits: snapshots.length
      }
    };
  });
}

function getItemsByGroupedIds(ids, timeConfig) {
  return combineLatest(ids.map(id => getSnapshot(id, timeConfig))).map(items => getResultForData({ items }));
}
