/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm } from 'formalistic';
import React, { useState } from 'react';

import { Link, Checkbox, Button } from '@instana/components';

import {
  getConfigAsResultObservable,
  getTestResult,
  refresh,
  setConfig,
  deleteConfig
} from 'in-settings/tabs/SecurityAndAccess/api/ldap';
import { isAnotherIdpActivated } from 'in-settings/tabs/SecurityAndAccess/pages/indentityProviders/configuredIdPCheck';
import { getConfigAsResultObservable as getOidcConfig } from 'in-settings/tabs/SecurityAndAccess/api/oidc';
import { getConfigAsResultObservable as getSamlConfig } from 'in-settings/tabs/SecurityAndAccess/api/saml';
import { SETTINGS_IDP_LDAP_TEST_CONFIGURATION } from 'in-services/tracking/tracking';
import TemporaryMessage from 'in-components/TemporaryMessage/TemporaryMessageV2';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { disableInvitesWithIdpEnabled } from 'in-services/featureFlags';
import { notBlankValidator } from 'in-services/validators/string.ts';
import TouchedMessages from 'in-components/form/TouchedMessages';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
import ValidationBlock from 'in-components/form/ValidationBlock';
import ApiItemView from 'in-settings/components/ApiItemView';
import { scrollIntoView } from 'in-services/util/dom';
import { Row, Col } from 'in-components/layout/Grid';
import Section from 'in-settings/components/Section';
import FormGroup from 'in-components/form/FormGroup';
import { isNotBlank } from 'in-services/util/string';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Title from 'in-components/Title';
import { t, Trans } from 'in-i18n';

import indentityProvidersLocals from '../indentityProviders.mless';
import locals from './Ldap.mless';

export default function Ldap(props) {
  const [testResultMessage, setTestResultMessage] = useState({ waitingForTest: false, messageProps: null });
  const { trackCta } = useSegmentTracking();

  return (
    <ApiItemView
      getObservables={() => ({
        config: getConfigAsResultObservable(),
        samlConfig: getSamlConfig(),
        oidcConfig: getOidcConfig()
      })}
      enrichForm={enrichForm}
      onCancelClick={refresh}
      saveItem={data => {
        if (isAnyInvitationsPending(props)) {
          addActiveDialog(
            <ConfirmationDialog
              header={t('in-settings:components.pleaseConfirm')}
              description={
                <span>
                  <Trans i18nKey="in-settings:tabs.createIDPConfirmationDescription" />
                </span>
              }
              onSubmit={() => {
                saveItem(data);
                close();
              }}
              confirmButtonKind="create"
              confirmButtonLabel={t('forms.actions.save')}
            />
          );
        } else saveItem(data);
      }}
      deleteItem={deleteItem}
      render={data => render({ ...data, trackCta })}
      testResultMessage={testResultMessage}
      setTestResultMessage={setTestResultMessage}
    />
  );
}

function isAnyInvitationsPending(props) {
  return disableInvitesWithIdpEnabled && props.invitations?.data?.length > 0;
}

function render({ form, setForm, testResultMessage, setTestResultMessage, result, trackCta }) {
  const allFieldsFilled =
    form.get('url').value &&
    form.get('url').value !== '' &&
    form.get('testUser').value &&
    form.get('testUser').value !== '' &&
    form.get('testPassword').value &&
    form.get('testPassword').value !== '' &&
    form.get('base').value &&
    form.get('base').value !== '' &&
    form.get('groupQuery').value &&
    form.get('groupQuery').value !== '' &&
    form.get('groupMemberField').value &&
    form.get('groupMemberField').value !== '' &&
    form.get('userQueryTemplate').value &&
    form.get('userQueryTemplate').value !== '' &&
    form.get('emailField').value &&
    form.get('emailField').value !== '';
  // testResultMessage.messageProps exists only when Test configuration is clicked
  const needsROCredentials = !form.get('emptyPass').value;
  const shouldDoROUserPassCheck = needsROCredentials && (testResultMessage.messageProps || allFieldsFilled);
  const hasROUser = form.get('roUser').value && form.get('roUser').value !== '';
  const hasROPassword = form.get('roPassword').value && form.get('roPassword').value !== '';
  const shouldShowMissingUserMessage = shouldDoROUserPassCheck && !hasROUser;
  const shouldShowMissingPasswordMessage = shouldDoROUserPassCheck && !hasROPassword;
  return (
    <>
      <Title title={t('in-settings:tabs.configureLdap')} />
      <SubViewHeader>{t('in-settings:tabs.ldapConfiguration')}</SubViewHeader>
      {isAnotherIdpActivated([result.oidcConfig?.activated, result.samlConfig?.activated]) ? (
        <h2>{t('in-settings:tabs.ldapCannotbeConfiguredWithOtherIdPActive')}</h2>
      ) : (
        <>
          <p>
            <Trans
              i18nKey="in-settings:tabs.ldapHelpDoc"
              components={{
                docLink: <Link external size="sm" href="https://ibm.biz/configuring-ldap" />
              }}
            />
          </p>

          <form>
            <Section restrictWidth="50rem">
              <h2>{t('in-settings:tabs.requiredSettings')}</h2>
              <Row className={indentityProvidersLocals.row}>
                <Col xs={12}>
                  <FormInput
                    placeholder="ldaps://ldap.example.com:636"
                    form={form}
                    setForm={setForm}
                    fieldName="url"
                    label={t('in-settings:tabs.url')}
                    description={t('in-settings:tabs.urlDescription')}
                  />
                </Col>
              </Row>

              <Row className={indentityProvidersLocals.row}>
                <Col xs={12}>
                  {form.get('acceptAnyCA').map(field => (
                    <Checkbox
                      label={t('in-settings:tabs.ldapsAcceptAnyCA')}
                      checked={field.value}
                      onChange={() => {
                        const newValue = form.updateIn(['acceptAnyCA'], f => f.setValue(!field.value).setTouched(true));
                        setForm(newValue);
                      }}
                    />
                  ))}
                </Col>
              </Row>

              <Row className={indentityProvidersLocals.row}>
                <Col xs={12}>
                  {form.get('emptyPass').map(field => (
                    <Checkbox
                      label={t('in-settings:tabs.anonymous')}
                      checked={field.value}
                      onChange={() => {
                        let newValues = form.updateIn(['emptyPass'], f => f.setValue(!field.value).setTouched(true));
                        if (field.value) {
                          newValues = newValues.updateIn(['roUser'], f => f.setValue('').setTouched(true));
                          newValues = newValues.updateIn(['roPassword'], f => f.setValue('').setTouched(true));
                        }
                        setForm(newValues);
                      }}
                    />
                  ))}
                </Col>
              </Row>

              {!form.get('emptyPass').value && (
                <Row className={indentityProvidersLocals.firstHideableRow}>
                  <Col xs={6}>
                    <FormInput
                      placeholder="cn=admin,dc=example,dc=com"
                      className={locals.formGroupWithoutMargin}
                      form={form}
                      setForm={setForm}
                      label={t('in-settings:tabs.user')}
                      fieldName="roUser"
                      description={t('in-settings:tabs.userDescription')}
                    />
                    {shouldShowMissingUserMessage && (
                      <ValidationBlock>{t('in-applications:forms.errorBlankValue')}</ValidationBlock>
                    )}
                  </Col>
                  <Col xs={6}>
                    <FormInput
                      placeholder={t('in-settings:tabs.hidden')}
                      className={locals.formGroupWithoutMargin}
                      form={form}
                      setForm={setForm}
                      label={t('in-settings:tabs.password')}
                      fieldName="roPassword"
                      type="password"
                      description={t('in-settings:tabs.passwordDescription')}
                    />
                    {shouldShowMissingPasswordMessage && (
                      <ValidationBlock>{t('in-applications:forms.errorBlankValue')}</ValidationBlock>
                    )}
                  </Col>
                </Row>
              )}
            </Section>
            <Section restrictWidth="50rem">
              <Row className={indentityProvidersLocals.row}>
                <Col xs={6}>
                  <FormInput
                    placeholder="dc=example,dc=com"
                    form={form}
                    setForm={setForm}
                    fieldName="base"
                    label={t('in-settings:tabs.base')}
                    description={t('in-settings:tabs.baseDescription')}
                  />
                </Col>
                <Col xs={6}>
                  <FormInput
                    placeholder="(cn=INSTANA)"
                    form={form}
                    setForm={setForm}
                    fieldName="groupQuery"
                    label={t('in-settings:tabs.groupQuery')}
                    description={t('in-settings:tabs.groupQueryDescription')}
                  />
                </Col>
              </Row>
              <Row className={indentityProvidersLocals.row}>
                <Col xs={6}>
                  <FormInput
                    placeholder={t('in-settings:tabs.member')}
                    form={form}
                    setForm={setForm}
                    fieldName="groupMemberField"
                    label={t('in-settings:tabs.groupMemberField')}
                    description={t('in-settings:tabs.groupMemberFieldDescription')}
                  />
                </Col>
                <Col xs={6}>
                  <FormInput
                    placeholder="(uid=%s)"
                    form={form}
                    setForm={setForm}
                    fieldName="userQueryTemplate"
                    label={t('in-settings:tabs.userQueryTemplate')}
                    description={t('in-settings:tabs.userQueryTemplateDescription')}
                  />
                </Col>
              </Row>
              <Row className={indentityProvidersLocals.row}>
                <Col xs={6}>
                  <FormInput
                    placeholder={t('in-settings:tabs.mail')}
                    form={form}
                    setForm={setForm}
                    fieldName="emailField"
                    label={t('in-settings:tabs.emailField')}
                    description={t('in-settings:tabs.emailFieldDescription')}
                  />
                </Col>
              </Row>
            </Section>
            <Section restrictWidth="50rem">
              <h3>{t('in-settings:tabs.ldapUserAccount')}</h3>

              <Row className={indentityProvidersLocals.row}>
                <Col xs={12}>
                  <DescriptionText>
                    {t('in-settings:tabs.thisAccountIsAutomaticallyAssignedAnAdminRoleLDAP')}
                  </DescriptionText>
                </Col>
              </Row>
              <Row className={indentityProvidersLocals.row}>
                <Col xs={6}>
                  <FormInput
                    className={locals.formGroupWithoutMargin}
                    form={form}
                    setForm={setForm}
                    fieldName="testUser"
                    label={t('in-settings:tabs.username')}
                    description={t('in-settings:tabs.usernameDescription')}
                  />
                </Col>
                <Col xs={6}>
                  <FormInput
                    placeholder={t('in-settings:tabs.hidden')}
                    className={locals.formGroupWithoutMargin}
                    form={form}
                    setForm={setForm}
                    fieldName="testPassword"
                    label={t('in-settings:tabs.password')}
                    type="password"
                    description={t('in-settings:tabs.usernamePasswordDescription')}
                  />
                </Col>
                <Col xs={12}>
                  <Button
                    icon={testResultMessage.waitingForTest ? 'lib_actions_loading' : null}
                    iconSpinning={testResultMessage.waitingForTest}
                    className={locals.testButton}
                    disabled={
                      !isNotBlank(getConfig(form).testUser) ||
                      !isNotBlank(getConfig(form).testPassword) ||
                      testResultMessage.waitingForTest
                    }
                    kind="secondary"
                    onClick={() => {
                      const config = getConfig(form);
                      const result$ = getTestResult(config);
                      const id = '' + parseInt(Math.random() * 100000);
                      setTestResultMessage({
                        id: '',
                        waitingForTest: true
                      });
                      result$.once(({ testPassed, reason }) => {
                        const msgType = testPassed ? 'success' : 'error';
                        setTestResultMessage({
                          waitingForTest: false,
                          messageProps: {
                            id,
                            text: testPassed ? reason : `${t('in-settings:tabs.ldapTestFailed')} ${reason}`,
                            type: msgType
                          }
                        });
                        trackCta(SETTINGS_IDP_LDAP_TEST_CONFIGURATION, { result: msgType });
                        setForm(form.setTouched(true, { recurse: true }));
                      });
                      result$.errors().once(e => {
                        setTestResultMessage({
                          id,
                          waitingForTest: false,
                          messageProps: {
                            text: `${t('in-settings:tabs.ldapTestFailed')} ${e}`,
                            type: 'error'
                          }
                        });
                        setForm(form.setTouched(true, { recurse: true }));
                      });
                    }}
                  >
                    {t('in-settings:tabs.testConfiguration')}
                  </Button>
                </Col>
              </Row>
              {testResultMessage.messageProps && (
                <Row className={indentityProvidersLocals.row}>
                  <Col xs={12}>
                    <TemporaryMessage {...testResultMessage.messageProps} duration={10000} />
                  </Col>
                </Row>
              )}
            </Section>
            <Section restrictWidth="50rem">
              <h2>{t('in-settings:tabs.optionalSettings')}</h2>
              <Row className={indentityProvidersLocals.row}>
                <Col xs={6}>
                  <FormInput
                    placeholder={t('in-settings:tabs.optional')}
                    form={form}
                    setForm={setForm}
                    fieldName="userDnMapping"
                    label={t('in-settings:tabs.userDnMapping')}
                    description={t('in-settings:tabs.userDnMappingDescription')}
                  />
                </Col>
                <Col xs={6}>
                  <FormInput
                    placeholder={t('in-settings:tabs.optional')}
                    form={form}
                    setForm={setForm}
                    fieldName="userField"
                    label={t('in-settings:tabs.userField')}
                    description={t('in-settings:tabs.userFieldDescription')}
                  />
                </Col>
              </Row>
            </Section>
          </form>
        </>
      )}
    </>
  );
}

function FormInput({ form, type, setForm, fieldName, label, className, disabled, placeholder, description }) {
  return form.get(fieldName).map(field => (
    <FormGroup className={className}>
      <Label htmlFor={`ldap_${fieldName}`} hasError={!field.valid && field.touched}>
        {label}
      </Label>

      <Input
        id={`ldap_${fieldName}`}
        type={type || 'text'}
        value={field.value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={e => {
          setForm(form.updateIn([fieldName], f => f.setValue(e.target.value).setTouched(true)));
        }}
        autoComplete="off"
        hasError={!field.valid && field.touched}
      />
      {description && <HelpText>{description}</HelpText>}

      <TouchedMessages field={field} />
    </FormGroup>
  ));
}

function scrollToResultMessage() {
  scrollIntoView(document.getElementsByClassName('message')[0]);
}

function saveItem({ form, setMessage }) {
  setMessage({ message: t('in-settings:tabs.savingConfig'), type: 'neutral', isSaving: true });
  const setConfigResult$ = setConfig(form.toJS());
  setConfigResult$.once(
    () => {
      setMessage({ text: t('in-settings:tabs.configSuccessfullySaved'), type: 'success' });
      scrollToResultMessage();
    },
    error => {
      setMessage({ text: t('in-settings:tabs.failedToSaveConfig', { err: error.message }), type: 'error' });
      scrollToResultMessage();
    }
  );
}

function deleteItem({ setMessage }) {
  setMessage({ message: t('in-settings:tabs.deletingConfig'), type: 'neutral', isSaving: true });
  const setConfigResult$ = deleteConfig();
  setConfigResult$.once(
    () => {
      setMessage({
        text: t('in-settings:tabs.configSuccessfullyDeleted'),
        type: 'success'
      });
    },
    error => setMessage({ text: t('in-settings:tabs.failedToDeleteConfig', { err: error.message }), type: 'error' })
  );
}

function getConfig(form) {
  return {
    base: form.get('base').value,
    emailField: form.get('emailField').value,
    emptyPass: form.get('emptyPass').value,
    groupMemberField: form.get('groupMemberField').value,
    groupQuery: form.get('groupQuery').value,
    roPassword: form.get('roPassword').value,
    roUser: form.get('roUser').value,
    testPassword: form.get('testPassword').value,
    testUser: form.get('testUser').value,
    url: form.get('url').value,
    userDnMapping: form.get('userDnMapping').value,
    userField: form.get('userField').value,
    userQueryTemplate: form.get('userQueryTemplate').value
  };
}

function checkNonAnonymousROUserHasCredentials({ emptyPass, roUser, roPassword }) {
  if (!emptyPass.value) {
    if (!roUser.value || !roPassword.value || roUser.value == '' || roPassword.value == '') {
      return [
        {
          severity: 'error',
          message: t('in-applications:forms.errorBlankValue')
        }
      ];
    }
  }
}

function enrichForm(form, { setCanDeleteItem, result: { config } }) {
  if (config.base) {
    setCanDeleteItem(true);
  }
  return createMapForm({
    validator: checkNonAnonymousROUserHasCredentials,
    items: {
      url: createField({
        value: config.url,
        validator: notBlankValidator
      }),
      emptyPass: createField({
        value: config.emptyPass
      }),
      roUser: createField({
        value: config.roUser
      }),
      roPassword: createField({
        value: config.roPassword
      }),
      testUser: createField({
        value: config.testUser || '',
        validator: notBlankValidator
      }),
      testPassword: createField({
        value: config.testPassword || '',
        validator: notBlankValidator
      }),
      base: createField({
        value: config.base,
        validator: notBlankValidator
      }),
      groupQuery: createField({
        value: config.groupQuery,
        validator: notBlankValidator
      }),
      groupMemberField: createField({
        value: config.groupMemberField,
        validator: notBlankValidator
      }),
      userQueryTemplate: createField({
        value: config.userQueryTemplate,
        validator: notBlankValidator
      }),
      emailField: createField({
        value: config.emailField,
        validator: notBlankValidator
      }),
      userDnMapping: createField({
        value: config.userDnMapping
      }),
      userField: createField({
        value: config.userField
      }),
      activated: createField({
        value: !!config.base
      }),
      acceptAnyCA: createField({
        value: config.acceptAnyCA
      })
    }
  });
}
