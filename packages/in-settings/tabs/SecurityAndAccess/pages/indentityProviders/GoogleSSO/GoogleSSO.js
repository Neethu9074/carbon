/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField } from 'formalistic';
import React from 'react';

import { Typography } from '@instana/components';

import { getConfigAsResultObservable, refresh, setConfig } from 'in-settings/tabs/SecurityAndAccess/api/googleSSO';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import TouchedMessages from 'in-components/form/TouchedMessages';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
import ApiItemView from 'in-settings/components/ApiItemView';
import { UPDATED_OBJECT } from 'in-services/util/constants';
import Section from 'in-settings/components/Section';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

export default function GoogleSSO() {
  const { unstable_trackEvent } = useSegmentTracking();
  return (
    <ApiItemView
      getObservables={() => ({
        config: getConfigAsResultObservable()
      })}
      enrichForm={enrichForm}
      onCancelClick={refresh}
      saveItem={data => saveItem({ ...data, unstable_trackEvent })}
      render={render}
    />
  );
}

//       <h2>{t('in-settings:tabs.configureAllowedEmailDomains')}</h2>

function render({ form, setForm }) {
  return (
    <>
      <Title title={t('in-settings:tabs.googleSSO.configure')} />
      <SubViewHeader>{t('in-settings:tabs.googleSSO.configure')}</SubViewHeader>
      <Typography component="p">{t('in-settings:tabs.googleSSO.domainOnlyMessage')}</Typography>
      <Typography component="p">{t('in-settings:tabs.googleSSO.domainExistingUsersMessage')}</Typography>

      <form>
        <Section restrictWidth="50rem">
          {form.get('filter').map(field => (
            <FormGroup>
              <Label htmlFor="google_sso_filter" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.googleSSO.allowedDomains')}
              </Label>

              <Input
                id="google_sso_filter"
                type="text"
                value={field.value}
                onChange={e => {
                  setForm(form.updateIn(['filter'], f => f.setValue(e.target.value).setTouched(true)));
                }}
                placeholder="@example.com, @example.io"
                autoComplete="off"
                hasError={!field.valid && field.touched}
              />
              <DescriptionText>{t('in-settings:tabs.googleSSO.hint')}</DescriptionText>
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </Section>
      </form>
    </>
  );
}

function saveItem({ form, setMessage, unstable_trackEvent }) {
  const googleSingleSignOnConfig = { filter: form.get('filter').value };
  setMessage({ message: t('in-settings:tabs.savingConfig'), type: 'neutral', isSaving: true });
  const setConfigResult$ = setConfig(googleSingleSignOnConfig);
  setConfigResult$.once(
    () => {
      setMessage({ text: t('in-settings:tabs.configSuccessfullySaved'), type: 'success' });
      unstable_trackEvent(UPDATED_OBJECT, { objectType: 'settings.identityProvider.googleSingleSignOn' });
    },
    error =>
      setMessage({
        text: t('in-settings:tabs.failedToSaveConfig', { err: error.message }),
        type: 'error'
      })
  );
}

function enrichForm(form, { result: { config } }) {
  return form.put(
    'filter',
    createField({
      value: config.filter
    })
  );
}
