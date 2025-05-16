/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo } from 'react';
import classNames from 'classnames';

import { Button, Stack, SvgIcon } from '@instana/components';
import { themes } from '@instana/design-tokens';

import GroupingConfigurator, {
  isGroupingConfigurationValid
} from 'in-infrastructure/Explore/components/GroupingConfigurator';
import { ClearTagFilterExpressionButton } from 'in-alerting/smart-alerts/components/dialog/ClearTagFilterExpressionButton';
import { EMPTY_EXPRESSION, toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { evaluationTypes } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/CustomOrPerEntityOption';
import GroupingConfiguratorSection from 'in-components/GroupingConfigurator/GroupingConfiguratorSection';
import { useGroupByCatalog } from 'in-alerting/smart-alerts/infrastructure/hooks/useGroupByLabel';
import { isQueryValid } from 'in-infrastructure/Explore/components/QueryBuilder';
import Section from 'in-components/workspace/Section';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './ScopeGroup.mless';

export default function ScopeGroup({ form, updateForm, tagCatalog, SectionWrapper = Section, isTearSheet }) {
  const tagFilterExpression = form?.get('tagFilterExpression')?.value;
  const groupBy = form?.get('groupBy')?.value;
  const evaluationType = form.get('evaluationType').value;
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

  const clearGroupBy = () => {
    updateForm(form.updateIn(['groupBy'], f => f.setValue([]).setTouched(true)));
  };

  const groupByTagCatalog = useGroupByCatalog(tagCatalog);
  const isPerEntityAlerting = evaluationType === evaluationTypes.perEntity;

  return (
    <>
      {!isPerEntityAlerting && groupByTagCatalog && (
        <Stack gap="xsmall" direction="horizontal" distribution="spaceBetween">
          <GroupingConfiguratorSection
            value={groupBy}
            GroupingConfigurator={GroupingConfigurator}
            tagCatalog={groupByTagCatalog}
            tagFilterExpression={backendQueryModel || EMPTY_EXPRESSION}
            onChange={groups => handleGroupChange(groups, form, updateForm)}
            SectionWrapper={SectionWrapper}
            fixOverlayLeftAlignment
          />
          <div
            className={classNames({
              [locals.alignEnd]: true,
              [locals.paddingEnd]: !isTearSheet
            })}
          >
            {groupBy.length > 0 && (
              <ClearTagFilterExpressionButton
                form={form}
                updateForm={updateForm}
                customFormUpdater={() => handleGroupChange([], form, updateForm)}
              />
            )}
          </div>
        </Stack>
      )}
      {isPerEntityAlerting && (
        <SectionWrapper title={t('in-components:groupingConfigurator.titleGroup')} icon="lib_group_by">
          <Stack gap="xsmall" direction="horizontal" align="center">
            <Button kind="tertiary" size="compact" icon="lib_openclose_add" disabled>
              {t('in-components:groupingConfigurator.addGroup')}
            </Button>
            <Tooltip
              align="bottomMiddle"
              content={t('in-alerting:smartAlerts.infrastructure.group.disabled.tooltipInfo')}
            >
              <SvgIcon
                type="lib_help_error_info_outline"
                size="s"
                color={themes.default.ids.color.option.neutral['700']}
              />
            </Tooltip>
          </Stack>
        </SectionWrapper>
      )}
    </>
  );
}
