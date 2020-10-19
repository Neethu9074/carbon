import React from 'react';

import FacetedFilterHttpStatusCodes from 'in-applications/analyze/components/FacetedSearch/FacetedFilterHttpStatusCodes';
import FacetedFilterGeneric from 'in-applications/analyze/components/FacetedSearch/FacetedFilterGeneric';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { DESTINATION } from 'in-new-components/QueryBuilder/tagFilter/entities';

import locals from './FacetedSearch.mless';

export default function FacetedSearch({ tagFilterExpression = toBackendQueryModel([]), addFilter, removeFilter }) {
  return (
    <div className={locals.wrapper}>
      <FacetedFilterGeneric
        title="Applications"
        tag="application.name"
        entity={DESTINATION}
        tagFilterExpression={tagFilterExpression}
        addFilter={addFilter}
        removeFilter={removeFilter}
      />
      <FacetedFilterGeneric
        title="Services"
        tag="service.name"
        entity={DESTINATION}
        tagFilterExpression={tagFilterExpression}
        addFilter={addFilter}
        removeFilter={removeFilter}
      />
      <FacetedFilterGeneric
        title="Endpoints"
        tag="endpoint.name"
        entity={DESTINATION}
        tagFilterExpression={tagFilterExpression}
        addFilter={addFilter}
        removeFilter={removeFilter}
      />
      <FacetedFilterGeneric
        title="Types"
        tag="call.type"
        tagFilterExpression={tagFilterExpression}
        addFilter={addFilter}
        removeFilter={removeFilter}
      />
      <FacetedFilterGeneric
        title="Technologies"
        tag="technology"
        entity={DESTINATION}
        tagFilterExpression={tagFilterExpression}
        addFilter={addFilter}
        removeFilter={removeFilter}
      />
      <FacetedFilterHttpStatusCodes
        title="HTTP Status Code"
        tagFilterExpression={tagFilterExpression}
        addFilter={addFilter}
        removeFilter={removeFilter}
      />
    </div>
  );
}
