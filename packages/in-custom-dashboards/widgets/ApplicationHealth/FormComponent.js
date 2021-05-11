/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';
import { Li, Ul } from '@instana/components';

import { createApplicationHealthForm } from 'in-custom-dashboards/widgets/ApplicationHealth/form';
import { getApplicationConfigsAsResultObservable } from 'in-api/applicationConfigs';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { pendingResult } from 'in-services/fixedObjects';
import Header from 'in-new-components/workspace/Header';
import Stack from 'in-new-components/layout/Stack';
import Label from 'in-components/form/Label/Label';
import Select from 'in-components/form/Select';
import Tooltip from 'in-components/Tooltip';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './FormComponent.mless';

export default function ApplicationHealthWidgetFormComponent({ form, onChange }) {
  const applications = useObservable(getApplicationsObservable, []) ?? pendingResult;
  const handleOnChange = (e, index) => {
    const application = applications.filter(item => item.id === e.target.value)[0];
    if (!application) return;
    const { id, label } = application;
    onChange([], form =>
      form
        .updateIn([index, 'id'], field => field.setValue(id).setTouched(true))
        .updateIn([index, 'label'], field => field.setValue(label).setTouched(true))
    );
  };
  const selectedApps = form.map(appForm => appForm.get('id').value).filter(Boolean);
  if (applications?.progress?.loading) {
    return <LoadingIndicator />;
  }

  return (
    <Stack space="large">
      <Stack space="xsmall">
        <Header>{t('in-custom-dashboards:widgets.applicationHealth.form.header')}</Header>
        <span className={locals.secondaryHeading}>
          <SvgIcon type="lib_help_error_info_outline" size={'s'} color={theme.lib.colors.N600Light} />
          {t('in-custom-dashboards:widgets.applicationHealth.form.secondaryHeadingText')}
        </span>
        <Ul>
          {form.map((appForm, i) => {
            return appForm.get('id').map(field => (
              <Li key={i} noAlternatingBg className={locals.formSection}>
                <div className={locals.selectsection}>
                  <Label>{t('in-custom-dashboards:widgets.applicationHealth.form.applicationLabel')}</Label>
                  <Select
                    id={`appHealthOverview-${i}`}
                    value={field.value}
                    onChange={e => handleOnChange(e, i)}
                    hasError={!field.valid && field.touched}
                  >
                    <option value={{}}>
                      {t('in-custom-dashboards:widgets.applicationHealth.form.selectApplication')}
                    </option>
                    {applications?.map(application => (
                      <option
                        key={application.id}
                        value={application.id}
                        disabled={selectedApps.includes(application.id)}
                      >
                        {application.label}
                      </option>
                    ))}
                  </Select>
                  {!field.valid && field.touched && <TouchedMessages field={field} />}
                </div>
                {form.items.length > 1 && (
                  <Tooltip content={'Delete'}>
                    <SvgIcon
                      type="lib_actions_delete"
                      onClick={() => onChange([], form => form.remove(i).setTouched(true))}
                    />
                  </Tooltip>
                )}
              </Li>
            ));
          })}
        </Ul>
        <div>
          <Button
            kind="action"
            icon="lib_openclose_add"
            type="button"
            onClick={() => onChange([], form => form.push(createApplicationHealthForm()).setTouched(true))}
          >
            {t('in-custom-dashboards:widgets.applicationHealth.form.addApplication')}
          </Button>
        </div>
      </Stack>
    </Stack>
  );
}

function getApplicationsObservable() {
  return getApplicationConfigsAsResultObservable().map(({ data }) => data);
}
