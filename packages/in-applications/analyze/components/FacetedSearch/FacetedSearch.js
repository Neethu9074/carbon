/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import FacetedFilterHttpStatusCodes from 'in-applications/analyze/components/FacetedSearch/FacetedFilterHttpStatusCodes';
import FacetedFilterHiddenCalls from 'in-applications/analyze/components/FacetedSearch/FacetedFilterHiddenCalls';
import FacetedFilterErroneous from 'in-applications/analyze/components/FacetedSearch/FacetedFilterErroneous';
import FacetedFilterGeneric from 'in-applications/analyze/components/FacetedSearch/FacetedFilterGeneric';
import FacetedFilterLatency from 'in-applications/analyze/components/FacetedSearch/FacetedFilterLatency';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { DESTINATION } from 'in-new-components/QueryBuilder/tagFilter/entities';

import locals from './FacetedSearch.mless';

export default function FacetedSearch({
  tagFilterExpression = toBackendQueryModel([]),
  updateFilter,
  hiddenCalls,
  onChangeHiddenCalls,
  isValid,
  dataSource
}) {
  return (
    <div className={locals.wrapper}>
      <FacetedFilterLatency
        title="Latency"
        dataSource={dataSource}
        tagFilterExpression={tagFilterExpression}
        updateFilter={updateFilter}
        isValid={isValid}
        openByDefault
      />
      <FacetedFilterErroneous
        title="Erroneous"
        tagFilterExpression={tagFilterExpression}
        updateFilter={updateFilter}
        dataSource={dataSource}
        hiddenCalls={hiddenCalls}
        isValid={isValid}
        openByDefault
      />
      <FacetedFilterGeneric
        title="Applications"
        tag="application.name"
        entity={DESTINATION}
        tagFilterExpression={tagFilterExpression}
        updateFilter={updateFilter}
        dataSource={dataSource}
        hiddenCalls={hiddenCalls}
        isValid={isValid}
      />

      <FacetedFilterGeneric
        title="Services"
        tag="service.name"
        entity={DESTINATION}
        tagFilterExpression={tagFilterExpression}
        updateFilter={updateFilter}
        dataSource={dataSource}
        hiddenCalls={hiddenCalls}
        isValid={isValid}
      />
      <FacetedFilterGeneric
        title="Endpoints"
        tag="endpoint.name"
        entity={DESTINATION}
        tagFilterExpression={tagFilterExpression}
        updateFilter={updateFilter}
        dataSource={dataSource}
        hiddenCalls={hiddenCalls}
        isValid={isValid}
      />
      <FacetedFilterGeneric
        title="Types"
        tag="call.type"
        tagFilterExpression={tagFilterExpression}
        updateFilter={updateFilter}
        dataSource={dataSource}
        hiddenCalls={hiddenCalls}
        isValid={isValid}
      />
      <FacetedFilterGeneric
        title="Technologies"
        tag="technology"
        entity={DESTINATION}
        tagFilterExpression={tagFilterExpression}
        updateFilter={updateFilter}
        hiddenCalls={hiddenCalls}
        dataSource={dataSource}
        isValid={isValid}
      />
      <FacetedFilterHttpStatusCodes
        title="HTTP Status Code"
        tagFilterExpression={tagFilterExpression}
        updateFilter={updateFilter}
      />
      <FacetedFilterHiddenCalls
        title="Hidden Calls"
        includeSynthetic={hiddenCalls?.includeSynthetic}
        includeInternal={hiddenCalls?.includeInternal}
        setIncludeSynthetic={includeSynthetic =>
          onChangeHiddenCalls({
            includeInternal: hiddenCalls?.includeInternal,
            includeSynthetic: includeSynthetic
          })
        }
        setIncludeInternal={includeInternal =>
          onChangeHiddenCalls({
            includeInternal: includeInternal,
            includeSynthetic: hiddenCalls?.includeSynthetic
          })
        }
        openByDefault
      />
    </div>
  );
}
