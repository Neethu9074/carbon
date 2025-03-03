/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo } from 'react';
import classNames from 'classnames';

import GroupingConfigurator, {
  isGroupingConfigurationValid
} from 'in-infrastructure/Explore/components/GroupingConfigurator';
import { EMPTY_EXPRESSION, toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import GroupingConfiguratorSection from 'in-components/GroupingConfigurator/GroupingConfiguratorSection';
import { useGroupByCatalog } from 'in-alerting/smart-alerts/infrastructure/hooks/useGroupByLabel';
import { isQueryValid } from 'in-infrastructure/Explore/components/QueryBuilder';

import locals from 'in-alerting/smart-alerts/infrastructure/components/InfraGroupLabel.mless';

export default function ScopeGroup({ form, updateForm, tagCatalog, SectionWrapper, isTearSheet }) {
  const tagFilterExpression = form?.get('tagFilterExpression')?.value;
  const groupBy = form?.get('groupBy')?.value;
  const validTagFilterExpressionResult = isQueryValid(tagFilterExpression, tagCatalog);
  const validGroupResult = isGroupingConfigurationValid(groupBy, tagCatalog);
  // in case of a pending result (validTagFilterExpressionResult.data === null) we do not want to show the user an error message
  const isValid = validTagFilterExpressionResult.data === true && validGroupResult.data === true;
  const backendQueryModel = useMemo(
    () => (isValid ? toBackendQueryModel(tagFilterExpression) : undefined),
    [isValid, tagFilterExpression]
  );
  const handleGroupChange = (groups, form, updateForm) => {
    updateForm(form.updateIn(['groupBy'], f => f.setValue(groups).setTouched(true)));
  };

  const groupByTagCatalog = useGroupByCatalog(tagCatalog);

  return (
    <div className={classNames({ [locals.container]: !isTearSheet })}>
      {groupByTagCatalog && (
        <GroupingConfiguratorSection
          value={groupBy}
          GroupingConfigurator={GroupingConfigurator}
          tagCatalog={groupByTagCatalog}
          tagFilterExpression={backendQueryModel || EMPTY_EXPRESSION}
          onChange={groups => handleGroupChange(groups, form, updateForm)}
          SectionWrapper={SectionWrapper}
          fixOverlayLeftAlignment
        />
      )}
    </div>
  );
}
