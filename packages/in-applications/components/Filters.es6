import React, { Fragment } from 'react';

import MultiSelectDropdown from 'in-new-components/MultiSelectDropdown/MultiSelectDropdown';
import { getTechnologyComboBoxItems } from 'in-applications/technologyRegistry';
import { getEndpointTypesComboBoxItems } from 'in-applications/endpointTypes';

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
        apply={values => setFilter({ technologies: values })}
        placeholder="Technology…"
        options={getTechnologyComboBoxItems(restrictedTechnologies)}
        className={locals.filter}
      />
    </Fragment>
  );
}
