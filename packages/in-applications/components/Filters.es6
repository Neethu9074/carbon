import React, { Fragment } from 'react';

import { getEndpointTypesComboBoxItems } from 'in-applications/endpointTypes';
import { technologyComboBoxItems } from 'in-applications/technologyRegistry';
import ComboBox from 'in-components/ComboBox';

import locals from './Filters.mless';

export default function Filters({ endpointTypes, restrictedEndpointTypes, technologies, setFilter }) {
  return (
    <Fragment>
      <ComboBox
        value={endpointTypes}
        onChange={t => setFilter({ endpointTypes: t.map(a => a.value) })}
        placeholder="Type…"
        multi
        options={getEndpointTypesComboBoxItems(restrictedEndpointTypes)}
        className={locals.filter}
      />
      <ComboBox
        value={technologies}
        onChange={t => setFilter({ technologies: t.map(a => a.value) })}
        placeholder="Technology…"
        multi
        options={technologyComboBoxItems}
        className={locals.filter}
      />
    </Fragment>
  );
}
