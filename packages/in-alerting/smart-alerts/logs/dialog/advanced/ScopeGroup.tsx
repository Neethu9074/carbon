/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useMemo } from 'react';
import { MapForm } from 'formalistic';

import { Group } from '@instana/types';

import { EMPTY_EXPRESSION, toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import GroupingConfiguratorSection from 'in-components/GroupingConfigurator/GroupingConfiguratorSection';
import LogsGroupingConfigurator from 'in-alerting/smart-alerts/logs/components/LogsGroupingConfigurator';

interface ScopeGroupProps {
  form: MapForm<any>;
  updateForm?: (form: MapForm<any>) => void;
  SectionWrapper?: React.FunctionComponent<any>;
}

export default function ScopeGroup({ form, updateForm, SectionWrapper }: ScopeGroupProps) {
  const tagFilterExpression = form?.get('tagFilterExpression')?.value;
  const groupBy = form?.get('groupBy')?.value;

  const backendQueryModel = useMemo(() => toBackendQueryModel(tagFilterExpression), [tagFilterExpression]);

  return (
    <GroupingConfiguratorSection
      value={groupBy}
      GroupingConfigurator={LogsGroupingConfigurator}
      tagFilterExpression={backendQueryModel || EMPTY_EXPRESSION}
      onChange={(groups: Group) => handleGroupChange(groups, form, updateForm)}
      tracking={{}}
      SectionWrapper={SectionWrapper}
    />
  );
}

function handleGroupChange(groups: Group, form: MapForm<any>, updateForm?: (form: MapForm<any>) => void) {
  if (updateForm) {
    updateForm(form.updateIn(['groupBy'], f => f.setValue(groups).setTouched(true)));
  }
}
