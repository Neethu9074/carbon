import React from 'react';

import FacetedFilterGeneric from 'in-applications/analyze/components/FacetedSearch/FacetedFilterGeneric';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';

import locals from './FacetedSearch.mless';

export default function FacetedSearch({ tagFilterExpression = toBackendQueryModel([]), addFilter }) {
  return (
    <div className={locals.wrapper}>
      <FacetedFilterGeneric
        title="Applications"
        tag="application.name"
        tagFilterExpression={tagFilterExpression}
        addFilter={addFilter}
      />
      <FacetedFilterGeneric
        title="Services"
        tag="service.name"
        tagFilterExpression={tagFilterExpression}
        addFilter={addFilter}
      />
      <FacetedFilterGeneric
        title="Endpoints"
        tag="endpoint.name"
        tagFilterExpression={tagFilterExpression}
        addFilter={addFilter}
      />
      <FacetedFilterGeneric
        title="Types"
        tag="call.type"
        tagFilterExpression={tagFilterExpression}
        addFilter={addFilter}
      />
      <FacetedFilterGeneric
        title="Technologies"
        tag="technology"
        tagFilterExpression={tagFilterExpression}
        addFilter={addFilter}
      />
      <FacetedFilterGeneric
        title="HTTP Status Code"
        tag="call.http.status"
        tagFilterExpression={tagFilterExpression}
        addFilter={addFilter}
      />
    </div>
  );
}
