import React from 'react';

import { selectedType$, setSelectedType, matchedSnapshotCount$ } from 'in-views/tableView/stores/snapshotIds';
import connectTo from 'in-hoc/connectTo';

import './TypeSelector.less';

const block = 'in-table-view-type-selector';
const id = 'table-view-type-selector';

// This list exists because we have the special type
// "service" which is an aggregation of multiple types.
const domains = {
  Infrastructure: {
    host: 'Hosts',
    jvm: 'JVMs',
    nodejs: 'Node.js Apps',
    docker: 'Docker Containers',
    process: 'Processes'
  },
  Application: {
    service: 'Services'
  },
  Instana: {
    agent: 'Agents'
  }
};

export default connectTo(
  {
    selectedType: selectedType$,
    matchedSnapshotCount: matchedSnapshotCount$
  },
  function TypeSelector({ selectedType, matchedSnapshotCount }) {
    return (
      <label className={block} htmlFor={id}>
        Table content:

        <select id={id} className={`${block}__selection`} value={selectedType} onChange={setType}>
          {Object.keys(domains).map(domain => (
            <optgroup key={domain} label={domain}>
              {Object.keys(domains[domain]).sort().map(val => (
                <option value={val} key={val}>
                  {domains[domain][val]}
                </option>
              ))}
            </optgroup>
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
