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
import { getPluginName } from 'in-sdk/pluginName';
import { t } from 'in-i18n';

import locals from './FacetedSearch.mless';

export default function FacetedSearch({
  tagFilterExpression = toBackendQueryModel([]),
  updateFilter,
  updateGroup,
  hiddenCalls,
  onChangeHiddenCalls,
  isValid,
  dataSource,
  groupbyTag
}) {
  return (
    <div className={locals.wrapper}>
      <FacetedFilterLatency
        title={t('in-applications:labelLatency')}
        dataSource={dataSource}
        tagFilterExpression={tagFilterExpression}
        updateFilter={updateFilter}
        isValid={isValid}
      />
      <FacetedFilterErroneous
        title={t('in-applications:analyze.erroneous')}
        tagFilterExpression={tagFilterExpression}
        updateFilter={updateFilter}
        dataSource={dataSource}
        hiddenCalls={hiddenCalls}
      />
      <FacetedFilterGeneric
        title={t('in-applications:analyze.applications')}
        tag="application.name"
        entity={DESTINATION}
        tagFilterExpression={tagFilterExpression}
        updateFilter={updateFilter}
        updateGroup={updateGroup}
        dataSource={dataSource}
        hiddenCalls={hiddenCalls}
        enableUseAsGroup={dataSource !== 'traces'}
        groupbyTag={groupbyTag}
      />

      <FacetedFilterGeneric
        title={t('in-applications:analyze.services')}
        tag="service.name"
        entity={DESTINATION}
        tagFilterExpression={tagFilterExpression}
        updateFilter={updateFilter}
        updateGroup={updateGroup}
        dataSource={dataSource}
        hiddenCalls={hiddenCalls}
        enableUseAsGroup={dataSource !== 'traces'}
        groupbyTag={groupbyTag}
      />
      <FacetedFilterGeneric
        title={t('in-applications:analyze.endpoints')}
        tag="endpoint.name"
        entity={DESTINATION}
        tagFilterExpression={tagFilterExpression}
        updateFilter={updateFilter}
        updateGroup={updateGroup}
        dataSource={dataSource}
        hiddenCalls={hiddenCalls}
        enableUseAsGroup={dataSource !== 'traces'}
        groupbyTag={groupbyTag}
      />
      <FacetedFilterGeneric
        title={t('in-applications:analyze.types')}
        tag="call.type"
        tagFilterExpression={tagFilterExpression}
        updateFilter={updateFilter}
        updateGroup={updateGroup}
        dataSource={dataSource}
        hiddenCalls={hiddenCalls}
        enableUseAsGroup={dataSource !== 'traces'}
        groupbyTag={groupbyTag}
      />
      <FacetedFilterGeneric
        title={t('in-applications:analyze.technologies')}
        tag="technology"
        entity={DESTINATION}
        tagFilterExpression={tagFilterExpression}
        updateFilter={updateFilter}
        updateGroup={updateGroup}
        hiddenCalls={hiddenCalls}
        dataSource={dataSource}
        customLabelMapper={label => getPluginName(label)}
        enableUseAsGroup={dataSource !== 'traces'}
        groupbyTag={groupbyTag}
      />
      <FacetedFilterHttpStatusCodes
        title={t('in-applications:analyze.httpStatusCode')}
        tagFilterExpression={tagFilterExpression}
        updateFilter={updateFilter}
        dataSource={dataSource}
      />
      <FacetedFilterHiddenCalls
        title={t('in-applications:analyze.hiddenCalls')}
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
        dataSource={dataSource}
        openByDefault
      />
    </div>
  );
}
