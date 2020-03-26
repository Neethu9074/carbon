import { createField } from 'formalistic';
import React from 'react';

import { getConfigAsResultObservable, setConfig } from 'in-settings/tabs/AuthSettings/api/ldap';
import TouchedMessages from 'in-components/form/TouchedMessages';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
import ApiItemView from 'in-settings/components/ApiItemView';
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
          <Col xs={6}>{createInput(form, setForm, 'user', 'User')}</Col>
          <Col xs={6}>{createInput(form, setForm, 'password', 'Password')}</Col>
        </Row>
        <Row className={indentityProvidersLocals.row}>
          <Col xs={6}>{createInput(form, setForm, 'base', 'Base')}</Col>
          <Col xs={6}>{createInput(form, setForm, 'groupQuery', 'Group Query')}</Col>
        </Row>
        <Row className={indentityProvidersLocals.row}>
          <Col xs={6}>{createInput(form, setForm, 'groupMemberField', 'Group Member Field')}</Col>
          <Col xs={6}>{createInput(form, setForm, 'userQueryTemplate', 'User Query Template')}</Col>
        </Row>
        <Row className={indentityProvidersLocals.row}>
          <Col xs={6}>{createInput(form, setForm, 'email', 'Email Field')}</Col>
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
  const url = form.get('url').value;
  return setConfig({
    url
  });
}

function enrichForm(form) {
  return form
    .put('url', createField({ value: '' }))
    .put('user', createField({ value: '' }))
    .put('password', createField({ value: '' }))
    .put('async', createField({ value: '' }))
    .put('base', createField({ value: '' }))
    .put('groupQuery', createField({ value: '' }))
    .put('groupMemberField', createField({ value: '' }))
    .put('userQueryTemplate', createField({ value: '' }))
    .put('email', createField({ value: '' }))
    .put('userDnMapping', createField({ value: '' }))
    .put('userField', createField({ value: '' }))
    .put('testUser', createField({ value: '' }))
    .put('testPassword', createField({ value: '' }));
}
