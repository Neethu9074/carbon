import { createField } from 'formalistic';
import React from 'react';

import { getConfigAsResultObservable, refresh, setConfig } from 'in-settings/tabs/AuthSettings/api/ldap';
import TouchedMessages from 'in-components/form/TouchedMessages';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
import ApiItemView from 'in-settings/components/ApiItemView';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Title from 'in-components/Title';
import Link from 'in-components/Link';

import indentityProvidersLocals from '../indentityProviders.mless';

export default function Ldap() {
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
      <Title title="LDAP Configuration" />
      <SubViewHeader>LDAP Configuration</SubViewHeader>
      <h2>
        Help and support is available in our{' '}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://docs.instana.io/quick_start/authentication/ldapsearch/"
        >
          documentation pages
        </Link>
        .
      </h2>
      <div className={indentityProvidersLocals.space} />

      <form>
        <Row className={indentityProvidersLocals.row}>
          <Col xs={12}>{createInput(form, setForm, 'url', 'URL')}</Col>
        </Row>
        <Row className={indentityProvidersLocals.row}>
          <Col xs={6}>{createInput(form, setForm, 'roUser', 'User')}</Col>
          <Col xs={6}>{createInput(form, setForm, 'roPassword', 'Password')}</Col>
          <Col xs={12}>
            {form.get('emptyPass').map(field => (
              <CheckboxFancy
                label="Anonymous"
                checked={field.value}
                onChange={() => setForm(form.updateIn(['emptyPass'], f => f.setValue(!field.value).setTouched(true)))}
              />
            ))}
          </Col>
        </Row>

        <div className={indentityProvidersLocals.space} />

        <Row className={indentityProvidersLocals.row}>
          <Col xs={6}>{createInput(form, setForm, 'base', 'Base')}</Col>
          <Col xs={6}>{createInput(form, setForm, 'groupQuery', 'Group Query')}</Col>
        </Row>
        <Row className={indentityProvidersLocals.row}>
          <Col xs={6}>{createInput(form, setForm, 'groupMemberField', 'Group Member Field')}</Col>
          <Col xs={6}>{createInput(form, setForm, 'userQueryTemplate', 'User Query Template')}</Col>
        </Row>
        <Row className={indentityProvidersLocals.row}>
          <Col xs={6}>{createInput(form, setForm, 'emailField', 'Email Field')}</Col>
        </Row>

        <div className={indentityProvidersLocals.space} />
        <h3>Optional settings</h3>
        <Row className={indentityProvidersLocals.row}>
          <Col xs={6}>{createInput(form, setForm, 'userDnMapping', 'User Dn Mapping')}</Col>
          <Col xs={6}>{createInput(form, setForm, 'userField', 'User Field')}</Col>
        </Row>

        <div className={indentityProvidersLocals.space} />
        <h3>Test configuration</h3>
        <Row className={indentityProvidersLocals.row}>
          <Col xs={6}>{createInput(form, setForm, 'testUser', 'Username')}</Col>
          <Col xs={6}>{createInput(form, setForm, 'testPassword', 'Password')}</Col>
          <Col xs={12}>
            <DescriptionText>These credentials are not stored and are used once for testing only.</DescriptionText>
          </Col>
        </Row>
      </form>
    </>
  );
}

function createInput(form, setForm, fieldName, label) {
  return form.get(fieldName).map(field => (
    <FormGroup>
      <Label htmlFor={`ldap_${fieldName}`} hasError={!field.valid && field.touched}>
        {label}
      </Label>

      <Input
        id={`ldap_${fieldName}`}
        type="text"
        value={field.value}
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

function saveItem(form) {
  return setConfig({
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
  });
}

function enrichForm(form, { result: { config } }) {
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
    .put('userQueryTemplate', createField({ value: config.userQueryTemplate }));
}
