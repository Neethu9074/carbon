import React from 'react';

import { selectedType$, setSelectedType, matchedSnapshotCount$ } from 'in-views/tableView/stores/snapshotIds';
import connectTo from 'in-hoc/connectTo';

import './TypeSelector.less';

const block = 'in-table-view-type-selector';
const id = 'table-view-type-selector';

export default connectTo(
  {
    selectedType: selectedType$,
    matchedSnapshotCount: matchedSnapshotCount$
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
                {[val]}
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
