import React from 'react';

import {selectedType$, setSelectedType} from 'in-views/tableView/stores/snapshotIds';
import connectTo from 'in-hoc/connectTo';

import './TypeSelector.less';

const block = 'in-table-view-type-selector';
const id = 'table-view-type-selector';

// This list exists because we have the special type
// "service" which is an aggregation of multiple types.
const options = {
  host: 'Hosts',
  service: 'Services',
  jvm: 'JVMs',
  dropwizard: 'Dropwizard Apps',
  nodejs: 'Node.js Apps',
  docker: 'Docker Containers'
};

export default connectTo({
  selectedType: selectedType$
}, function TypeSelector({selectedType}) {
  return (
    <label className={block}
           htmlFor={id}>
      Table content:

      <select id={id}
              className={`${block}__selection`}
              value={selectedType}
              onChange={setType}>
        {Object.keys(options).sort().map(val =>
          <option value={val}
                  key={val}>
            {options[val]}
          </option>
        )}
      </select>
    </label>
  );
});


function setType(e) {
  setSelectedType(e.target.value);
}
