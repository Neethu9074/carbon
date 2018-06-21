import React, { Fragment } from 'react';

import { getTechnologyComboBoxItems } from 'in-applications/technologyRegistry';
import { getEndpointTypesComboBoxItems } from 'in-applications/endpointTypes';
import ComboBox from 'in-components/ComboBox';

import locals from './Filters.mless';

export default function Filters({
  endpointTypes,
  restrictedEndpointTypes,
  technologies,
  restrictedTechnologies,
  setFilter
}) {
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
        options={getTechnologyComboBoxItems(restrictedTechnologies)}
        className={locals.filter}
      />
    </Fragment>
  );
}
