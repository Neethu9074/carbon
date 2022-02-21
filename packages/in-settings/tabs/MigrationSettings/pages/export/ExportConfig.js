/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import { createField } from 'formalistic';

import { Button } from '@instana/components';

import { getConfigAsResultObservable as getOidcConfigAsResultObservable } from 'in-settings/tabs/AuthSettings/api/oidc';
import { isAnotherIdpActivated } from 'in-settings/tabs/AuthSettings/pages/indentityProviders/configuredIdPCheck';
import { getConfigAsResultObservable, refresh } from 'in-settings/tabs/MigrationSettings/api/exportConfig';
import { getConfigAsResultObservable as getLdapConfig } from 'in-settings/tabs/AuthSettings/api/ldap';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import ApiItemView from 'in-settings/components/ApiItemView';
import EventTypesSwitcher from './EventTypesSwitcher';
import { Row, Col } from 'in-components/layout/Grid';
import Section from 'in-settings/components/Section';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Title from 'in-components/Title';
import { t, Trans } from 'in-i18n';

import locals from './Saml.mless';

export default function ExportConfig() {
  const inputDOMNode = document.createElement('input');
  const [input] = useState(inputDOMNode);
  const [file, setFile] = useState(null);
  inputDOMNode.onchange = () => setFile(input && input.files && input.files.length > 0 ? input.files[0] : undefined);

  return (
    <ApiItemView
      getObservables={() => ({
        config: getConfigAsResultObservable(),
        oidcConfig: getOidcConfigAsResultObservable(),
        ldapConfig: getLdapConfig()
      })}
      enrichForm={enrichForm}
      input={input}
      file={file}
      onCancelClick={() => {
        setFile(null);
        refresh();
      }}
      saveItem={({ setMessage }) => {
        if (file == null) {
          setMessage({
            text: t('in-settings:tabs.failedToSaveConfig', { err: t('in-settings:tabs.IdPMetadataRequired') }),
            type: 'error'
          });
          return;
        }
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = function(evt) {
          if (evt.target.result.length > 2000000) {
            setMessage({
              text: t('in-settings:tabs.failedToSaveConfig', {
                err: t('in-settings:tabs.IdPMetadataLargerThanTwoMega')
              }),
              type: 'error'
            });
            return;
          }
        };
      }}
      Content={Content}
    />
  );
}

function Content({ file, form, setForm, setCanSaveItem, result }) {
  useEffect(
    // allow only saving when idP metadata has been uploaded
    () => setCanSaveItem(!!file),
    [file, form, setCanSaveItem]
  );

  return (
    <>
      <Title title={t('in-settings:tabs.configExport')} />
      <SubViewHeader>{t('in-settings:tabs.configExport')}</SubViewHeader>
      {isAnotherIdpActivated([result.ldapConfig?.base, result.oidcConfig?.activated]) ? (
        <h2>{t('in-settings:tabs.cannotConfigureSamlIfAnotherOneIsAlreadyActive')}</h2>
      ) : (
        <>
          <h2>{t('in-settings:tabs.downloadTheConfigurationDataSummary')}</h2>
          <p>
            <Trans i18nKey="in-settings:tabs.configExportHelp" />
          </p>

          <form method="post" encType="multipart/form-data">
            <Section restrictWidth="50rem">
              <Row>
                <Col xs={12}>
                  {form.get('spEntityId').map(field => (
                    <FormGroup>
                      <Label htmlFor="spEntityId" hasError={!field.valid && field.touched}>
                        {t('in-settings:tabs.configExportTypes')}
                      </Label>

                      <Input
                        className={locals.input}
                        type="text"
                        id="spEntityId"
                        value={field.value}
                        onChange={e => {
                          setForm(form.updateIn(['spEntityId'], f => f.setValue(e.target.value).setTouched(true)));
                        }}
                        autoComplete="off"
                      />
                    </FormGroup>
                  ))}
                </Col>
              </Row>
              <div className={locals.eventTypeSwitcher}>
                <EventTypesSwitcher
                  form={form}
                  // onChange={e => console.log('event switcher', e)}
                  types={[]}
                  formGroupStyles={locals.eventTypes}
                />
              </div>
            </Section>

            <Section restrictWidth="50rem">
              <h2>{t('in-settings:tabs.configExport')}</h2>
              {form.get('spEntityId').map(field => (
                <Button
                  kind="secondary"
                  icon="lib_actions_download"
                  href={`/api/settings/authentication/saml/metadata?spEntityId=${encodeURIComponent(field.value)}`}
                >
                  {t('in-settings:tabs.configurationMetadata')}
                </Button>
              ))}

              <ul className={locals.list}>
                <li>{t('in-settings:tabs.downloadTheConfigurationData')}</li>
                <li>{t('in-settings:tabs.useImportToUploadConfigurationData')}</li>
              </ul>
            </Section>
          </form>
        </>
      )}
    </>
  );
}

function enrichForm(form, { setCanDeleteItem, result: { config } }) {
  setCanDeleteItem(!!config.activated);
  return form
    .put('samlSignInCallbackUrl', createField({ value: config.samlSignInCallbackUrl || '' }))
    .put('samlSignOutCallbackUrl', createField({ value: config.samlSignOutCallbackUrl || '' }))
    .put('spEntityId', createField({ value: config.spEntityId || '' }))
    .put('ownerEmail', createField({ value: '' }))
    .put('nameIdFormat', createField({ value: config.nameIdFormat || '' }));
}
