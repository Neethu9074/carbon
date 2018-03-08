import { uniq } from 'lodash';
import React from 'react';

import ComboBox from 'in-components/ComboBox';

import locals from './EndpointTypeSelect.mless';

export default function EndpointTypeSelect({ setEndpointTypes, endpointTypes, availableTypes }) {
  availableTypes = uniq(availableTypes);
  return (
    <ComboBox
      value={endpointTypes}
      onChange={t => setEndpointTypes(t.map(a => a.value))}
      placeholder="Type…"
      multi
      options={availableTypes}
      className={locals.filter}
    />
  );
}

export function mapServicesResultToComboBoxItems(result) {
  let availableTypes = [];
  if (result.data) {
    result.data.items.forEach(item => {
      for (let i = 0; i < item.service.types.length; i++) {
        availableTypes.push(item.service.types[i]);
      }
    });
  }
  return uniq(availableTypes).map(type => ({ label: type, value: type }));
}
