/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField } from 'formalistic';
import { t } from 'in-i18n';
import React from 'react';

import { getConfigAsResultObservable, refresh, setConfig } from 'in-settings/tabs/AuthSettings/api/googleSSO';
import { success, neutral, error as errorType } from 'in-new-components/Message/types';
import TouchedMessages from 'in-components/form/TouchedMessages';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
import ApiItemView from 'in-settings/components/ApiItemView';
import Section from 'in-settings/components/Section';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Title from 'in-components/Title';

export default function GoogleSSO() {
  return (
    <ApiItemView
      getObservables={() => ({
        config: getConfigAsResultObservable()
      })}
      enrichForm={enrichForm}
      onCancelClick={refresh}
      saveItem={saveItem}
      render={render}
    />
  );
}

function render({ form, setForm }) {
  return (
    <>
      <Title title={t('in-settings:tabs.configureGoogleSso')} />
      <SubViewHeader>{t('in-settings:tabs.googleSsoConfiguration')}</SubViewHeader>
      <h2>{t('in-settings:tabs.configureAllowedEmailDomains')}</h2>

      <form>
        <Section restrictWidth="50rem">
          {form.get('filter').map(field => (
            <FormGroup>
              <Label htmlFor="google_sso_filter" hasError={!field.valid && field.touched}>
                {t(
                  'in-settings:tabs.onlyUsersWithEmailAddressesAtTheFollowingDomainsWillBeAllowedToSignInToYourInstanaTenant'
                )}
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
              <DescriptionText>{t('in-settings:tabs.separateMultipleDomainsWithAComma')}</DescriptionText>
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </Section>
      </form>
    </>
  );
}

function saveItem({ form, setMessage }) {
  setMessage({ message: t('in-settings:tabs.savingConfig'), type: neutral, isSaving: true });
  const setConfigResult$ = setConfig({ filter: form.get('filter').value });
  setConfigResult$.once(
    () => setMessage({ text: t('in-settings:tabs.configSuccessfullySaved'), type: success }),
    error => setMessage({ text: t('in-settings:tabs.failedToSaveConfig', { err: error.message }), type: errorType })
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
