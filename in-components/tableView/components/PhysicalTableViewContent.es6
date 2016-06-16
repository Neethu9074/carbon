import React from 'react';

import ExpandCollapseAll from 'in-components/tableView/components/ExpandCollapseAll';
import PhysicalSummary from 'in-components/tableView/components/PhysicalSummary';
import {highlightedEntityId$} from 'in-services/stores/highlightedEntityId';
import {expandedSnapshotIds$} from 'in-components/tableView/stores/expandedIds';
import ChildList from 'in-components/tableView/components/ChildList';
import ZoneEntry from 'in-components/tableView/components/ZoneEntry';
import Search from 'in-components/tableView/components/Search';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {selectedSnapshotId$} from 'in-stores/snapshot';
import {physicalViewStructure$} from 'in-stores/view';
import {
  isFilterActive$,
  snapshotIdsInPhysicalViewMatchingFilter$
} from 'in-components/tableView/stores/search';
import connectTo from 'in-hoc/connectTo';

import './PhysicalTableViewContent.less';

const idOfUnmonitoredZone = 'unmonitored-hosts-zone';

const block = 'in-table-view-physical';

export default connectTo({
    highlightedSnapshotId: highlightedEntityId$,
    selectedSnapshotId: selectedSnapshotId$,
    viewStructure: physicalViewStructure$,
    expandedSnapshotIds: expandedSnapshotIds$,
    isFilterActive: isFilterActive$,
    snapshotIdsMatchingFilter: snapshotIdsInPhysicalViewMatchingFilter$
  }, function PhysicalTableViewContent({viewStructure, highlightedSnapshotId, selectedSnapshotId,
      expandedSnapshotIds, isFilterActive, snapshotIdsMatchingFilter}) {
    if (!viewStructure) {
      return <LoadingIndicator />;
    }

    const children = viewStructure.get('children')
      .toArray()
      .filter(zone => zone.get('id') !== idOfUnmonitoredZone);

    return (
      <div className={block}>
        <div className={block + '__header'}>
          <div className={block + '__header-left'}>
            <PhysicalSummary zones={children} />
            <ExpandCollapseAll />
          </div>
          <Search />
        </div>

        <ChildList Component={ZoneEntry}
                   children={children}
                   highlightedSnapshotId={highlightedSnapshotId}
                   selectedSnapshotId={selectedSnapshotId}
                   indent={false}
                   ignorePluginWhileSorting={true}
                   expandedSnapshotIds={expandedSnapshotIds}
                   isFilterActive={isFilterActive}
                   snapshotIdsMatchingFilter={snapshotIdsMatchingFilter} />
      </div>
    );
  }
);
