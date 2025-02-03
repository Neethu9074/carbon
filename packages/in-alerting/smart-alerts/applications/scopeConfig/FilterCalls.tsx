/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { Spacer } from '@instana/components';

import AlertFilterConfigurator from 'in-alerting/smart-alerts/components/dialog/AlertFilterConfigurator';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

import locals from './FilterCalls.mless';

export default function FilterCalls({
  tagFilterExpression,
  isBuiltIn,
  tearSheetView,
  QueryBuilder,
  form,
  updateForm
}: any) {
  return (
    <div
      className={classNames({
        [locals.alertFilterConfiguratorWrapper]: true,
        [locals.alertFilterConfiguratorWrapperBottomPadding]: !tagFilterExpression.length || isBuiltIn
      })}
      id="scopeSection"
    >
      {tearSheetView && (
        <>
          <Spacer vertical="normal" />
          <AlertTypography
            variant="heading-200"
            color="color900"
            content={t('in-alerting:smartAlerts.components.smartAlertDialog.scopeFilterCallsTitle')}
          />
          <AlertTypography
            variant="body-small"
            color="color600"
            content={t('in-alerting:smartAlerts.components.smartAlertDialog.scopeFilterCallsDescription')}
          />

          <Spacer vertical="normal" />
        </>
      )}
      <AlertFilterConfigurator QueryBuilderComponent={QueryBuilder} form={form} updateForm={updateForm} />
    </div>
  );
}
