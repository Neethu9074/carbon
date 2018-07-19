import React from 'react';

import { selectedType$, setSelectedType, matchedSnapshotCount$ } from 'in-views/tableView/stores/snapshotIds';
import { showPingComparison } from 'in-services/featureFlags';
import connectTo from 'in-hoc/connectTo';

import './TypeSelector.less';

const block = 'in-table-view-type-selector';
const id = 'table-view-type-selector';

const physicalDomains = {
  host: 'Hosts',
  jvm: 'JVMs',
  nodejs: 'Node.js Apps',
  docker: 'Docker Containers',
  process: 'Processes'
};
if (showPingComparison) {
  physicalDomains.ping = 'Ping';
}

// This list exists because we have the special type
// "service" which is an aggregation of multiple types.
const logicalDomains = {
  service: 'Services'
};

export default connectTo(
  {
    selectedType: selectedType$.map(selectedType => selectedType.type),
    matchedSnapshotCount: matchedSnapshotCount$,
    domains: selectedType$.map(selectedType => (physicalDomains[selectedType.type] ? physicalDomains : logicalDomains))
  },
  function TypeSelector({ selectedType, matchedSnapshotCount, domains }) {
    return (
      <label className={block} htmlFor={id}>
        Table content:
        <select id={id} className={`${block}__selection`} value={selectedType} onChange={setType}>
          {Object.keys(domains)
            .sort()
            .map(val => (
              <option value={val} key={val}>
                {domains[val]}
              </option>
            ))}
        </select>
        ({matchedSnapshotCount})
      </label>
    );
  }
);

function setType(e) {
  setSelectedType(e.target.value);
}
