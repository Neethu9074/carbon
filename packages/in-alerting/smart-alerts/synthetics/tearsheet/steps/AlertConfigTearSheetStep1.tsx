/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm, Item, Field } from 'formalistic';
import React from 'react';

import { Spacer, Stack } from '@instana/components';

import { ClearTagFilterExpressionButton } from 'in-alerting/smart-alerts/components/dialog/ClearTagFilterExpressionButton';
import ConfigureAlertTest from 'in-alerting/smart-alerts/synthetics/tearsheet/components/ConfigureAlertTest';
import AlertFilterConfigurator from 'in-alerting/smart-alerts/components/dialog/AlertFilterConfigurator';
import { ScopeWrapper } from 'in-alerting/smart-alerts/components/tearSheet/CustomWrappers/Wrapper';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/synthetics/tearsheet/steps/AlertConfigTearSheetStep1.mless';

interface AlertConfigTearSheetStep1Props {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  updateForm: (form: MapForm<any>) => void;
  QueryBuilderComponent: QueryBuilderComponent;
}

export default function AlertConfigTearSheetStep1({
  form,
  onChange,
  updateForm,
  QueryBuilderComponent
}: AlertConfigTearSheetStep1Props) {
  return (
    <div className={locals.container}>
      <TearSheetStepTitleWrapper
        headline={t('in-alerting:smartAlerts.synthetics.tearSheet.step1.header')}
        description={t('in-alerting:smartAlerts.synthetics.tearSheet.step1.description')}
        hideSpace
      >
        <ConfigureAlertTest form={form} onChange={onChange} numberOfAlertTestListRows={10} />
        <Spacer size="gutter" />
        <ScopeWrapper
          title={t('in-alerting:smartAlerts.synthetics.tearSheet.scopeFilter.filter')}
          description={t('in-alerting:smartAlerts.synthetics.tearSheet.scopeFilter.filterDescription')}
          gap="normal"
        >
          <Stack direction="horizontal" gap="small" distribution="spaceBetween">
            <AlertFilterConfigurator
              QueryBuilderComponent={QueryBuilderComponent}
              form={form}
              updateForm={updateForm}
            />
            <div>
              {(form.get('tagFilterExpression') as Field<string>).value.length > 0 && (
                <ClearTagFilterExpressionButton form={form} updateForm={updateForm} />
              )}
            </div>
          </Stack>
        </ScopeWrapper>
      </TearSheetStepTitleWrapper>
    </div>
  );
}
