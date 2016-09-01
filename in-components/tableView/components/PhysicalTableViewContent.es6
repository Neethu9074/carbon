/* global process:false */
import React from 'react';

import ExpandCollapseAll from 'in-components/tableView/components/ExpandCollapseAll';
import PhysicalSummary from 'in-components/tableView/components/PhysicalSummary';
import {excludeUnmonitoredHosts$} from 'in-stores/settings/unmonitoredHosts';
import HealthSlider from 'in-components/tableView/components/HealthSlider';
import {closeTableView} from 'in-components/tableView/stores/visibility';
import ChildList from 'in-components/tableView/components/ChildList';
import ZoneEntry from 'in-components/tableView/components/ZoneEntry';
import {ID_OF_UNMONITORED_ZONE} from 'in-services/unmonitoredZone';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {physicalViewStructure$} from 'in-stores/view';
import Button from 'in-components/Button';
import {
  isFilterActive$,
  snapshotIdsInPhysicalViewMatchingFilter$
} from 'in-components/tableView/stores/search';
import connectTo from 'in-hoc/connectTo';

import './PhysicalTableViewContent.less';


const block = 'in-table-view-physical';

export default connectTo({
    viewStructure: physicalViewStructure$,
    isFilterActive: isFilterActive$,
    snapshotIdsMatchingFilter: snapshotIdsInPhysicalViewMatchingFilter$.startWith([]),
    excludeUnmonitoredHosts: excludeUnmonitoredHosts$
  }, function PhysicalTableViewContent({viewStructure, isFilterActive, snapshotIdsMatchingFilter,
      excludeUnmonitoredHosts}) {
    if (!viewStructure) {
      return <LoadingIndicator />;
    }

    let children = viewStructure.get('children')
      .toArray();

    if (excludeUnmonitoredHosts) {
      children = children.filter(child => child.get('id') !== ID_OF_UNMONITORED_ZONE);
    }

    return (
      <div className={block}>
        <div className={block + '__header'}>
          <div className={block + '__header-left'}>
            <PhysicalSummary zones={children} />
            <ExpandCollapseAll />
          </div>

          <div className={block + '__header-left'}>
            <HealthSlider />
            <Button onClick={closeTableView}>
              Close
            </Button>
          </div>
        </div>

        <ChildList Component={ZoneEntry}
                   children={children}
                   indent={false}
                   ignorePluginWhileSorting={true}
                   isFilterActive={isFilterActive}
                   snapshotIdsMatchingFilter={snapshotIdsMatchingFilter} />
      </div>
    );
  }
);
