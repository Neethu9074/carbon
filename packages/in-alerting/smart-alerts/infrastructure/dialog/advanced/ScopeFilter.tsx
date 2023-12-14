/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

//@ts-expect-error
import { handleChangeTagFilterExpressionChange } from 'in-alerting/smart-alerts/components/dialog/AlertFilterConfigurator';
//@ts-expect-error
import QueryBuilder, { isQueryValid } from 'in-infrastructure/Explore/components/QueryBuilder';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';

interface ScopeFilterProps {
  form: MapForm<any>;
  updateForm?: (form: MapForm<any>) => void;
}
export default function ScopeFilter({ form, updateForm }: ScopeFilterProps) {
  const tagFilterExpression = form?.get('tagFilterExpression')?.value;
  const entityType = form.get('entityType')?.value;
  const metric = form.get('rule')?.get('metricName')?.value;
  const tagCatalog = useTagCatalog({ ownerType: entityType, metric, regex: false });
  const validTagFilterExpressionResult = isQueryValid(tagFilterExpression, tagCatalog);
  const isInvalid = validTagFilterExpressionResult.data === false;
  return (
    <QueryBuilderSection
      value={tagFilterExpression}
      QueryBuilder={QueryBuilder}
      tagCatalog={tagCatalog}
      onChange={tfe => handleChangeTagFilterExpressionChange(tfe, form, updateForm)}
      hasError={isInvalid}
      useLastValidStateWhenErroneous
    />
  );
}
