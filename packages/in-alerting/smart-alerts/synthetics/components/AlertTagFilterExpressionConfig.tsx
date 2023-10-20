/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { ClearTagFilterExpressionButton } from 'in-alerting/smart-alerts/components/dialog/ClearTagFilterExpressionButton';
import AlertFilterConfigurator from 'in-alerting/smart-alerts/components/dialog/AlertFilterConfigurator';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import IconLabel from 'in-alerting/components/IconLabel';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/synthetics/components/AlertTagFilterExpressionConfig.mless';

export interface AlertTagFilterExpressionConfigProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  QueryBuilderComponent: QueryBuilderComponent;
  headerTransparent: boolean;
}

export default function AlertTagFilterExpressionConfig({
  form,
  updateForm,
  QueryBuilderComponent,
  headerTransparent = false
}: AlertTagFilterExpressionConfigProps) {
  const selectedTests = (form.get('syntheticTestIds') as Field<string[]>)?.value.length;
  return (
    <LightCard
      title={
        <IconLabel
          noBottomMargin
          type={'lib_synthetic'}
          text={
            selectedTests > 0
              ? t('in-alerting:smartAlerts.synthetics.selectTests.testAttachedCount', {
                  count: selectedTests
                })
              : t('in-alerting:smartAlerts.synthetics.selectTests.testAttached')
          }
        />
      }
      headerClassName={classNames({
        [locals.header]: true,
        [locals.headerTransparent]: headerTransparent
      })}
      header={
        (form.get('tagFilterExpression') as Field<string>).value.length > 0 && (
          <ClearTagFilterExpressionButton form={form} updateForm={updateForm} />
        )
      }
      darkFrame
    >
      <AlertFilterConfigurator QueryBuilderComponent={QueryBuilderComponent} form={form} updateForm={updateForm} />
    </LightCard>
  );
}
