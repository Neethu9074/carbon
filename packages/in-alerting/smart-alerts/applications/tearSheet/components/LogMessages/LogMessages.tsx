/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { Pill, Typography } from '@instana/components';
import { TimeConfig } from '@instana/types';

//@ts-expect-error
import LogMessagesList from 'in-alerting/smart-alerts/applications/components/LogMessagesList';
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
              .updateIn(['rule', 'level'], f => (f as Field<string>).setValue(level).setTouched(true))
          );
        }}
        slideOut={() => undefined}
        pageSize={5}
        logsTearsheetColumns={columnDefinition}
        header={
          <div className={locals.title}>
            <Typography variant="body-bold">Select Log Message</Typography>
            <Typography variant="body-small">Optional</Typography>
          </div>
        }
        rule={form.get('rule')}
      />
    </FormGroup>
  );
}

export const columnDefinition = [
  {
    id: 'level',
    label: t('in-alerting:smartAlerts.applications.logMessages.levelColumn'),
    width: 30,
    getContent(item: any) {
      return <Pill type="gray">{item.level}</Pill>;
    }
  }
];
