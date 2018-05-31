import React, { Fragment } from 'react';

import MultiSelectDropdown from 'in-new-components/MultiSelectDropdown/MultiSelectDropdown';
import { getEndpointTypesComboBoxItems } from 'in-applications/endpointTypes';
import { getTechnologyComboBoxItems } from 'in-applications/technologyRegistry';

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
      <MultiSelectDropdown
        values={endpointTypes}
        apply={values => setFilter({ endpointTypes: values })}
        placeholder="Type…"
        options={getEndpointTypesComboBoxItems(restrictedEndpointTypes)}
        className={locals.filter}
      />
      <MultiSelectDropdown
        values={technologies}
        onChange={t => setFilter({ technologies: t.map(a => a.value) })}
        placeholder="Technology…"
        multi
        options={getTechnologyComboBoxItems(restrictedTechnologies)}
        className={locals.filter}
      />
    </Fragment>
  );
}
