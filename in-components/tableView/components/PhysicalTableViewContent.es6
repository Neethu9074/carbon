import React from 'react';

import PhysicalSummary from 'in-components/tableView/components/PhysicalSummary';
import {highlightedEntityId$} from 'in-services/stores/highlightedEntityId';
import {expandedSnapshotIds$} from 'in-components/tableView/stores/expandedIds';
import ChildList from 'in-components/tableView/components/ChildList';
import ZoneEntry from 'in-components/tableView/components/ZoneEntry';
import {selectedSnapshotId$} from 'in-stores/snapshot';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {physicalViewStructure$} from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';

import './PhysicalTableViewContent.less';

const idOfUnmonitoredZone = 'unmonitored-hosts-zone';

const block = 'in-table-view-physical';

export default connectTo({
    highlightedSnapshotId: highlightedEntityId$,
    selectedSnapshotId: selectedSnapshotId$,
    viewStructure: physicalViewStructure$,
    expandedSnapshotIds: expandedSnapshotIds$
  }, function PhysicalTableViewContent({viewStructure, highlightedSnapshotId, selectedSnapshotId,
      expandedSnapshotIds}) {
    if (!viewStructure) {
      return <LoadingIndicator />;
    }

    const children = viewStructure.get('children')
      .toArray()
      .filter(zone => zone.get('id') !== idOfUnmonitoredZone);

    return (
      <div className={block}>
        <PhysicalSummary zones={children} />

        <ChildList Component={ZoneEntry}
                   children={children}
                   highlightedSnapshotId={highlightedSnapshotId}
                   selectedSnapshotId={selectedSnapshotId}
                   indent={false}
                   ignorePluginWhileSorting={true}
                   expandedSnapshotIds={expandedSnapshotIds} />
      </div>
    );
  }
);
