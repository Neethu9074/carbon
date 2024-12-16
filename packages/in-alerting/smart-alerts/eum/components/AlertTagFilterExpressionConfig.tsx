/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { ClearTagFilterExpressionButton } from 'in-alerting/smart-alerts/components/dialog/ClearTagFilterExpressionButton';
import AlertFilterConfigurator from 'in-alerting/smart-alerts/components/dialog/AlertFilterConfigurator';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import IconLabel from 'in-alerting/components/IconLabel';

import locals from 'in-alerting/smart-alerts/eum/components/AlertTagFilterExpressionConfig.mless';

export interface AlertTagFilterExpressionConfigProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  QueryBuilderComponent: QueryBuilderComponent;
  headerTransparent?: boolean;
  label?: string;
  iconType: string;
  removeBorderBottom?: string;
}

export default function AlertTagFilterExpressionConfig({
  form,
  updateForm,
  QueryBuilderComponent,
  headerTransparent,
  label,
  iconType,
  removeBorderBottom
}: AlertTagFilterExpressionConfigProps) {
  return (
    <LightCard
      title={<IconLabel text={label} type={iconType} noBottomMargin />}
      headerClassName={classNames({
        [locals.header]: true,
        [locals.headerTransparent]: headerTransparent
      })}
      className={removeBorderBottom && locals.removeContainerBorderBottom}
      header={
        form.get('tagFilterExpression').value.length > 0 && (
          <ClearTagFilterExpressionButton form={form} updateForm={updateForm} />
        )
      }
      darkFrame
    >
      <AlertFilterConfigurator QueryBuilderComponent={QueryBuilderComponent} form={form} updateForm={updateForm} />
    </LightCard>
  );
}
