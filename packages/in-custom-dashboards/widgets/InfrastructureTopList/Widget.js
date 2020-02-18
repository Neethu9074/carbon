import React, { useState } from 'react';

import columnDefinitions from 'in-custom-dashboards/widgets/InfrastructureTopList/columnDefinitions';
import { entityTypeToFullyQualifiedPlugin } from 'in-views/tableView/stores/snapshotIds';
import { physicalTablePath } from 'in-stores/navigation/paths/mainPaths';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import TopListWidget from 'in-custom-dashboards/widgets/TopListWidget';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { pendingResult } from 'in-services/fixedObjects';
import ButtonGroup from 'in-new-components/ButtonGroup';
import { types } from 'in-cockpit/favItems/favItems';
import { search } from 'in-stores/snapshot/snapshot';

export default function InfrastructureTopList(props) {
  const [selectedType, setSelectedType] = useState('host');

  return (
    <TopListWidget
      {...props}
      icon="lib_infrastructure_inverted"
      favItemTypes={[types.INFRASTRUCTURE]}
      getFavItems$={getFavItems$}
      getIdByItem={getIdByItem}
      getTypeByItem={getTypeByItem}
      getItems={({ query }) => getItems(query, selectedType)}
      header={
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
      }
      columnDefinitions={columnDefinitions[selectedType]}
      fullListView$={getModifiedUrlStream(location => {
        location.pathname = physicalTablePath;
        setOrDeleteMatrixKey(location, physicalTablePath, 'plugin', selectedType);
      })}
      fullListViewLinkTitle={
        'All ' + (selectedType === 'host' ? 'Hosts' : selectedType === 'docker' ? 'Containers' : 'Processes')
      }
    />
  );
}

function getIdByItem(item) {
  return item.get('id');
}

function getTypeByItem() {
  return types.INFRASTRUCTURE;
}

function getFavItems$(/*idsByType, timeConfig*/) {}

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
        items: snapshots
      }
    };
  });
}
