import React from 'react';

import { selectedType$, setSelectedType, matchedSnapshotCount$ } from 'in-views/tableView/stores/snapshotIds';
import connectTo from 'in-hoc/connectTo';

import './TypeSelector.less';

const block = 'in-table-view-type-selector';
const id = 'table-view-type-selector';

const physicalDomains = {
  host: 'Hosts',
  jvm: 'JVMs',
  nodejs: 'Node.js Apps',
  containerd: 'Containerd Containers',
  docker: 'Docker Containers',
  garden: 'Garden Containers',
  process: 'Processes',
  clickHouseDatabase: 'ClickHouse',
  ping: 'Ping'
};

export default connectTo(
  {
    selectedType: selectedType$.map(selectedType => selectedType.type),
    matchedSnapshotCount: matchedSnapshotCount$
  },
  function TypeSelector({ selectedType, matchedSnapshotCount }) {
    return (
      <label className={block} htmlFor={id}>
        Table content:
        <select id={id} className={`${block}__selection`} value={selectedType} onChange={setType}>
          {Object.keys(physicalDomains)
            .sort()
            .map(val => (
              <option value={val} key={val}>
                {physicalDomains[val]}
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
