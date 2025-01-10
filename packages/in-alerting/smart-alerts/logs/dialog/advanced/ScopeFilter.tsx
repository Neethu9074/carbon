/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Result, TagCatalog, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

import LogsFilterQueryBuilder from 'in-alerting/smart-alerts/logs/components/LogsFilterQueryBuilder';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { isQueryValid } from 'in-logging/analyze/AnalyzeView/workspace/LogsQueryBuilder';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { CatalogResponse } from 'in-logging/api/catalog';

interface ScopeFilterProps {
  form: MapForm<any>;
  updateForm?: (form: MapForm<any>) => void;
  tagCatalog: CatalogResponse | undefined;
  timeConfig: TimeConfig | undefined;
  setTagFilterValid?: React.Dispatch<React.SetStateAction<boolean>>;
  SectionWrapper?: React.FunctionComponent<any>;
}
export default function ScopeFilter({
  form,
  updateForm,
  tagCatalog,
  timeConfig,
  setTagFilterValid,
  SectionWrapper
}: ScopeFilterProps) {
  const tagFilterExpression = form?.get('tagFilterExpression')?.value;
  const validTagFilterExpressionResult$ = isQueryValid(tagFilterExpression, timeConfig);

  const validTagFilterResult: Result<boolean> = useObservable(validTagFilterExpressionResult$, []);
  const isInvalid = validTagFilterResult?.data === false;
  const handleChangeTagFilterExpressionChange = (
    tagFilterExpression: FormModelElement[],
    form: MapForm<any>,
    updateForm?: (form: MapForm<any>) => void
  ) => {
    if (updateForm)
      updateForm(form.updateIn(['tagFilterExpression'], f => f.setValue(tagFilterExpression).setTouched(true)));
  };

  return (
    <QueryBuilderSection
      value={tagFilterExpression}
      QueryBuilder={LogsFilterQueryBuilder}
      tagCatalog={tagCatalog as TagCatalog}
      onChange={tfe => handleChangeTagFilterExpressionChange(tfe, form, updateForm)}
      hasError={isInvalid}
      useLastValidStateWhenErroneous
      onErrorStateChange={setTagFilterValid}
      SectionWrapper={SectionWrapper}
    />
  );
}
