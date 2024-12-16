/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { TagCatalog } from '@instana/types';

import { handleChangeTagFilterExpressionChange } from 'in-alerting/smart-alerts/components/dialog/AlertFilterConfigurator';
import QueryBuilder, { isQueryValid } from 'in-infrastructure/Explore/components/QueryBuilder';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';

interface ScopeFilterProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  tagCatalog: TagCatalog | undefined;
  setTagFilterValid?: React.Dispatch<React.SetStateAction<boolean>>;
  SectionWrapper?: React.FunctionComponent<any>;
}
export default function ScopeFilter({
  form,
  updateForm,
  tagCatalog,
  setTagFilterValid,
  SectionWrapper
}: ScopeFilterProps) {
  const tagFilterExpression = form?.get('tagFilterExpression')?.value;
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
      onErrorStateChange={setTagFilterValid}
      SectionWrapper={SectionWrapper}
    />
  );
}
