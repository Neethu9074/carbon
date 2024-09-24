/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { Pill, RadioButton } from '@instana/components';
import { TimeConfig } from '@instana/types';

//@ts-expect-error
import LogMessagesList from 'in-alerting/smart-alerts/applications/components/LogMessagesList';
import AlertTypography from 'in-alerting/components/AlertTypography';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import { operators } from 'in-analyze/applicationFilter';
import { t } from 'in-i18n';

import locals from './LogMessages.mless';

export default function LogMessages({
  form,
  timeConfig,
  updateForm
}: {
  form: MapForm<any>;
  timeConfig: TimeConfig;
  updateForm: (form: MapForm<any>) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <FormGroup>
      <LogMessagesList
        applications={form.get('applications').value}
        tagFilterExpression={form.get('tagFilterExpression').value}
        applicationBoundaryScope={form.get('boundaryScope').value}
        includeInternal={form.get('includeInternal').value}
        includeSynthetic={form.get('includeSynthetic').value}
        timeConfig={timeConfig}
        onLogMessageSelect={(message: string, level: string) => {
          updateForm(
            form
              .updateIn(['rule', 'message'], f => (f as Field<string>).setValue(message).setTouched(true))
              .updateIn(['rule', 'operator'], field => field.setValue(operators.EQUALS))
              .updateIn(['rule', 'level'], f => f.setValue(level).setTouched(true))
          );
        }}
        slideOut={() => undefined}
        pageSize={5}
        logsTearsheetColumns={getColumnDefinition(
          form.get('rule').get('message').value,
          form.get('rule').get('level').value
        )}
        header={
          <div className={locals.title}>
            <AlertTypography
              variant={'body-bold'}
              color="color900"
              content={t('in-alerting:smartAlerts.applications.components.provideLogMessageSelectLogMessage')}
              noMargin
            />
            <AlertTypography
              variant={'body-small'}
              color="color600"
              content={t('in-alerting:components.optional')}
              noMargin
            />
          </div>
        }
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        tearSheetView
      />
    </FormGroup>
  );
}

export function getColumnDefinition(message: string, level: string) {
  return [
    {
      id: 'radio',
      lable: '',
      width: 10,
      sortable: false,
      getContent(item: any) {
        return (
          <div className={locals.alignCenter}>
            <RadioButton
              key={`radioBtn-key-${Math.random()}`}
              disabled={false}
              label={null}
              checked={item.message === message && item.level === level}
              onChange={() => undefined}
            />
          </div>
        );
      }
    },
    {
      id: 'level',
      label: t('in-alerting:smartAlerts.applications.logMessages.levelColumn'),
      width: 20,
      sortable: false,
      getContent(item: any) {
        return <Pill type="gray">{item.level}</Pill>;
      }
    }
  ];
}
