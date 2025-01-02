/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { TimeConfig } from '@instana/types';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import getBizOpsTagSuggestions from 'in-bizops/subscriptions/getBizOpsTagSuggestions';
import { getBusinessMonitoringTagCatalog } from 'in-bizops/api/catalog';
import { GetBizOpsTagSuggestionQuery } from 'in-bizops/utils/types';
import { createQueryBuilder } from 'in-components/QueryBuilder';

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createQueryBuilder({
  getTagCatalog: getBusinessMonitoringTagCatalog,
  getSuggestions: params => {
    const { tagFilterExpression, tagName, timeConfig, propose, key, value } = params;
    let entity = params.entity;
    if (entity == null) entity = 'NOT_APPLICABLE';
    const query: GetBizOpsTagSuggestionQuery = {
      entity: entity,
      tagFilterExpression: tagFilterExpression,
      tagName: tagName,
      propose: propose,
      key: key,
      value: value,
      timeConfig: timeConfig
    };
    return getBizOpsTagSuggestions(query);
  }
});

export default QueryBuilder;
export const isQueryValid = ([tagFilterExpression, timeConfig]: [FormModelElement[], TimeConfig]) =>
  isQueryValidInternal(tagFilterExpression, timeConfig);
