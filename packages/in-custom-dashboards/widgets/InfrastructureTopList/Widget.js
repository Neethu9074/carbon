import React, { useState } from 'react';

import columnDefinitions from 'in-custom-dashboards/widgets/InfrastructureTopList/columnDefinitions';
import { entityTypeToFullyQualifiedPlugin } from 'in-views/tableView/stores/snapshotIds';
import { physicalTablePath } from 'in-stores/navigation/paths/mainPaths';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import TopListWidget from 'in-custom-dashboards/widgets/TopListWidget';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { pendingResult } from 'in-services/fixedObjects';
import ButtonGroup from 'in-new-components/ButtonGroup';
import { search } from 'in-stores/snapshot/snapshot';

export default function InfrastructureTopList(props) {
  const [selectedType, setSelectedType] = useState('host');

  return (
    <TopListWidget
      {...props}
      icon="lib_infrastructure_inverted"
      getData={({ query }) =>
        search({
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
              items: snapshots.slice(0, 5)
            }
          };
        })
      }
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
        'All ' + (selectedType === 'host' ? 'Hosts' : selectedType === 'docker' ? 'Container' : 'Processes')
      }
    />
  );
}
