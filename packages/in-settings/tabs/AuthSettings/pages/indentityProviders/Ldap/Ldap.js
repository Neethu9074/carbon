/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField } from 'formalistic';
import React, { useState } from 'react';

import {
  getConfigAsResultObservable,
  getTestResult,
  refresh,
  setConfig,
  deleteConfig
} from 'in-settings/tabs/AuthSettings/api/ldap';
import { isAnotherIdpActivated } from 'in-settings/tabs/AuthSettings/pages/indentityProviders/configuredIdPCheck';
import { getConfigAsResultObservable as getOidcConfig } from 'in-settings/tabs/AuthSettings/api/oidc';
import { getConfigAsResultObservable as getSamlConfig } from 'in-settings/tabs/AuthSettings/api/saml';
import { success, neutral, error as errorType } from 'in-new-components/Message/types';
import TemporaryMessage from 'in-new-components/TemporaryMessage';
import TouchedMessages from 'in-components/form/TouchedMessages';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
import ApiItemView from 'in-settings/components/ApiItemView';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { Row, Col } from 'in-new-components/layout/Grid';
import Section from 'in-settings/components/Section';
import FormGroup from 'in-components/form/FormGroup';
import { isNotBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Title from 'in-components/Title';
import Link from 'in-components/Link';

import indentityProvidersLocals from '../indentityProviders.mless';
import locals from './Ldap.mless';

export default function Ldap() {
  const [testResultMessage, setTestResultMessage] = useState(null);
  return (
    <ApiItemView
      getObservables={() => ({
        config: getConfigAsResultObservable(),
        samlConfig: getSamlConfig(),
        oidcConfig: getOidcConfig()
      })}
      enrichForm={enrichForm}
      onCancelClick={refresh}
      saveItem={saveItem}
      deleteItem={deleteItem}
      render={render}
      testResultMessage={testResultMessage}
      setTestResultMessage={setTestResultMessage}
    />
  );
}

function render({ form, setForm, testResultMessage, setTestResultMessage, result }) {
  return (
    <>
      <Title title="Configure LDAP" />
      <SubViewHeader>LDAP Configuration</SubViewHeader>
      {isAnotherIdpActivated([result.oidcConfig?.activated, result.samlConfig?.activated]) ? (
        <h2>LDAP is not configurable as long as you have another active identity provider configuration.</h2>
      ) : (
        <>
          <h2>
            Help and support is available in our{' '}
            <Link target="_blank" rel="noopener noreferrer" href="https://instana.com/docs/self_hosted_instana/ldap/">
              documentation pages
            </Link>
            .
          </h2>

          <form>
            <Section restrictWidth="50rem">
              <Row className={indentityProvidersLocals.row}>
                <Col xs={12}>
                  <FormInput
                    placeholder="ldaps://ldap.example.com:636"
                    form={form}
                    setForm={setForm}
                    fieldName="url"
                    label="URL"
                  />
                </Col>
              </Row>
              <Row className={indentityProvidersLocals.row}>
                <Col xs={6}>
                  <FormInput
                    placeholder="cn=admin,dc=example,dc=com"
                    className={locals.formGroupWithoutMargin}
                    form={form}
                    setForm={setForm}
                    label="User"
                    fieldName="roUser"
                    disabled={form.get('emptyPass').value}
                  />
                </Col>
                <Col xs={6}>
                  <FormInput
                    placeholder="hidden"
                    className={locals.formGroupWithoutMargin}
                    form={form}
                    setForm={setForm}
                    label="Password"
                    fieldName="roPassword"
                    type="password"
                    disabled={form.get('emptyPass').value}
                  />
                </Col>
                <Col xs={12}>
                  {form.get('emptyPass').map(field => (
                    <CheckboxFancy
                      label="Anonymous"
                      checked={field.value}
                      onChange={() =>
                        setForm(form.updateIn(['emptyPass'], f => f.setValue(!field.value).setTouched(true)))
                      }
                    />
                  ))}
                </Col>
              </Row>
            </Section>
            <Section restrictWidth="50rem">
              <Row className={indentityProvidersLocals.row}>
                <Col xs={6}>
                  <FormInput
                    placeholder="dc=example,dc=com"
                    form={form}
                    setForm={setForm}
                    fieldName="base"
                    label="Base"
                  />
                </Col>
                <Col xs={6}>
                  <FormInput
                    placeholder="(cn=INSTANA)"
                    form={form}
                    setForm={setForm}
                    fieldName="groupQuery"
                    label="Group Query"
                  />
                </Col>
              </Row>
              <Row className={indentityProvidersLocals.row}>
                <Col xs={6}>
                  <FormInput
                    placeholder="member"
                    form={form}
                    setForm={setForm}
                    fieldName="groupMemberField"
                    label="Group Member Field"
                  />
                </Col>
                <Col xs={6}>
                  <FormInput
                    placeholder="(uid=%s)"
                    form={form}
                    setForm={setForm}
                    fieldName="userQueryTemplate"
                    label="User Query Template"
                  />
                </Col>
              </Row>
              <Row className={indentityProvidersLocals.row}>
                <Col xs={6}>
                  <FormInput
                    placeholder="mail"
                    form={form}
                    setForm={setForm}
                    fieldName="emailField"
                    label="Email Field"
                  />
                </Col>
              </Row>
            </Section>
            <Section restrictWidth="50rem">
              <h3>LDAP user account</h3>

              <Row className={indentityProvidersLocals.row}>
                <Col xs={6}>
                  <FormInput
                    className={locals.formGroupWithoutMargin}
                    form={form}
                    setForm={setForm}
                    fieldName="testUser"
                    label="Username"
                  />
                </Col>
                <Col xs={6}>
                  <FormInput
                    placeholder="hidden"
                    className={locals.formGroupWithoutMargin}
                    form={form}
                    setForm={setForm}
                    fieldName="testPassword"
                    label="Password"
                    type="password"
                  />
                </Col>
                <Col xs={12}>
                  <DescriptionText>This account is automatically assigned an admin role.</DescriptionText>
                </Col>
                <Col xs={12}>
                  <Button
                    className={locals.testButton}
                    disabled={!isNotBlank(getConfig(form).testUser) && !isNotBlank(getConfig(form).testPassword)}
                    kind="secondary"
                    onClick={() => {
                      const config = getConfig(form);
                      const result$ = getTestResult(config);
                      result$.once(({ testPassed, reason }) =>
                        setTestResultMessage(
                          testPassed ? { text: reason, type: success } : { text: reason, type: errorType }
                        )
                      );
                      result$.errors().once(e => setTestResultMessage({ text: e, type: errorType }));
                    }}
                  >
                    Test configuration
                  </Button>
                </Col>
              </Row>
              {testResultMessage && (
                <Row className={indentityProvidersLocals.row}>
                  <Col xs={12}>
                    <TemporaryMessage {...testResultMessage} duration={10000} />
                  </Col>
                </Row>
              )}
            </Section>
            <Section restrictWidth="50rem">
              <h3>Optional settings</h3>
              <Row className={indentityProvidersLocals.row}>
                <Col xs={6}>
                  <FormInput
                    placeholder="(optional)"
                    form={form}
                    setForm={setForm}
                    fieldName="userDnMapping"
                    label="User Dn Mapping"
                  />
                </Col>
                <Col xs={6}>
                  <FormInput
                    placeholder="(optional)"
                    form={form}
                    setForm={setForm}
                    fieldName="userField"
                    label="User Field"
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

function FormInput({ form, type, setForm, fieldName, label, className, disabled, placeholder }) {
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
      <TouchedMessages field={field} />
    </FormGroup>
  ));
}

function saveItem({ form, setMessage }) {
  setMessage({ message: 'Saving config', type: neutral, isSaving: true });
  const setConfigResult$ = setConfig(form.toJS());
  setConfigResult$.once(
    () => setMessage({ text: 'Config successfully saved.', type: success }),
    error => setMessage({ text: `Failed to save config: ${error.message}`, type: errorType })
  );
}

function deleteItem({ setMessage }) {
  setMessage({ message: 'Deleting config', type: neutral, isSaving: true });
  const setConfigResult$ = deleteConfig();
  setConfigResult$.once(
    () => {
      setMessage({ text: 'Config successfully deleted.', type: success });
    },
    error => setMessage({ text: `Failed to delete config: ${error.message}`, type: errorType })
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

function enrichForm(form, { setCanDeleteItem, result: { config } }) {
  if (config.base) {
    setCanDeleteItem(true);
  }
  return form
    .put('emptyPass', createField({ value: config.emptyPass }))
    .put('base', createField({ value: config.base }))
    .put('emailField', createField({ value: config.emailField }))
    .put('groupMemberField', createField({ value: config.groupMemberField }))
    .put('groupQuery', createField({ value: config.groupQuery }))
    .put('roPassword', createField({ value: config.roPassword }))
    .put('testPassword', createField({ value: config.testPassword }))
    .put('testUser', createField({ value: config.testUser }))
    .put('url', createField({ value: config.url }))
    .put('roUser', createField({ value: config.roUser }))
    .put('userDnMapping', createField({ value: config.userDnMapping }))
    .put('userField', createField({ value: config.userField }))
    .put('userQueryTemplate', createField({ value: config.userQueryTemplate }))
    .put('activated', createField({ value: !!config.base }));
}
