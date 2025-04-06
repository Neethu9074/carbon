/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  CarbonCheckbox,
  CarbonColumn,
  CarbonForm,
  CarbonFormGroup,
  CarbonPasswordInput,
  CarbonRow,
  CarbonStack,
  CarbonTextInput,
  CarbonToggle,
  Typography
} from '@instana/components';
import { t, Trans } from '@instana/i18n-react';

import DeleteConfigurationView from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/DeleteConfigurationView';
import { LDAP_MODE, LdapFormProps } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/Ldap/Ldap.types';

const LdapForm = (props: LdapFormProps) => {
  const { form, setForm } = props;
  const mode = form.get('mode').value;
  const isReadOnly = mode === LDAP_MODE.DELETE;

  const getReadOnlyForm = () => (
    <CarbonStack gap={6}>
      <Typography variant="body-01">
        {t('in-settings:tabs.authenticationProviders.idpIsActive', { idpConfig: 'LDAP' })}
      </Typography>
      <CarbonStack gap={4}>
        <LdapServerSection form={form} setForm={setForm} />
        <LdapAuthenticationSection form={form} setForm={setForm} />
        <LdapQueriesSection form={form} setForm={setForm} />
      </CarbonStack>
      <DeleteConfigurationView form={form} setForm={setForm} />
    </CarbonStack>
  );

  if (isReadOnly) {
    return getReadOnlyForm();
  }
  return (
    <CarbonForm>
      <CarbonStack gap={2}>
        <LdapServerSection form={form} setForm={setForm} />
        <LdapAuthenticationSection form={form} setForm={setForm} />
        <LdapQueriesSection form={form} setForm={setForm} />
        <OptionalSettingsSection form={form} setForm={setForm} />
        <InstanaAdministrationAccessSection form={form} setForm={setForm} />
      </CarbonStack>
    </CarbonForm>
  );
};

export default LdapForm;

const LdapServerSection = ({ form, setForm }: LdapFormProps) => {
  const isReadOnly = form.get('mode').value === LDAP_MODE.DELETE;
  const url = form.get('url');
  const acceptAnyCA = form.get('acceptAnyCA');

  return (
    <CarbonFormGroup legendText="">
      <Typography variant="heading-02">{t('in-settings:tabs.ldapForm.ldapServer')}</Typography>
      <CarbonStack gap={4}>
        <CarbonTextInput
          labelText={t('in-settings:tabs.url')}
          helperText={t('in-settings:tabs.urlDescription')}
          id="ldap_url"
          value={url.value}
          onChange={e => {
            setForm(form.updateIn(['url'], f => f.setValue(e.target.value).setTouched(true)));
          }}
          invalid={!url.valid && url.touched}
          invalidText={url.messages[0]?.message}
          readOnly={isReadOnly}
        />
        <CarbonCheckbox
          labelText={t('in-settings:tabs.ldapsAcceptAnyCA')}
          helperText={t('in-settings:tabs.ldapsAcceptAnyCAHelperText')}
          id="ldapsAcceptAnyCA"
          checked={acceptAnyCA.value}
          onChange={({ target }) =>
            setForm(form.updateIn(['acceptAnyCA'], f => f.setValue(target.checked).setTouched(true)))
          }
          readOnly={isReadOnly}
        />
      </CarbonStack>
    </CarbonFormGroup>
  );
};

const LdapAuthenticationSection = ({ form, setForm }: LdapFormProps) => {
  const isReadOnly = form.get('mode').value === LDAP_MODE.DELETE;
  const emptyPass = form.get('roForm').get('emptyPass').value;
  const roUserField = form.get('roForm').get('roUser');
  const roPasswordField = form.get('roForm').get('roPassword');
  const roAuthFormErrors = form.get('roForm').messages;
  const isRoUserError = roAuthFormErrors.filter(message => message.path === 'roUser')?.[0]?.message;
  const isRoPasswordError = roAuthFormErrors.filter(message => message.path === 'roPassword')?.[0]?.message;
  return (
    <CarbonFormGroup legendText="">
      <Typography variant="heading-02">{t('in-settings:tabs.ldapForm.ldapAuthentication')}</Typography>
      <CarbonStack gap={4}>
        <CarbonToggle
          readOnly={isReadOnly}
          id="readonlyAccess"
          labelA={t('in-settings:tabs.ldapForm.authenticateReadOnlyAccessToLdap')}
          labelB={t('in-settings:tabs.ldapForm.authenticateReadOnlyAccessToLdap')}
          name="readonlyAccess"
          toggled={!emptyPass}
          onToggle={e => {
            let updatedForm = form;
            if (!e) {
              updatedForm = updatedForm
                .updateIn(['roForm', 'roUser'], f => f.setValue(''))
                .updateIn(['roForm', 'roPassword'], f => f.setValue(''));
            }
            setForm(updatedForm.updateIn(['roForm', 'emptyPass'], f => f.setValue(!e).setTouched(true)));
          }}
          size="sm"
        />
        {!emptyPass && (
          <CarbonRow>
            <CarbonColumn>
              <CarbonTextInput
                labelText={t('in-settings:tabs.user')}
                helperText={<Trans i18nKey="in-settings:tabs.ldapForm.userDescription" />}
                id="ldap_roUser"
                value={roUserField.value}
                onChange={e => {
                  setForm(form.updateIn(['roForm', 'roUser'], f => f.setValue(e.target.value).setTouched(true)));
                }}
                invalid={roUserField.touched && !!isRoUserError}
                invalidText={isRoUserError}
                readOnly={isReadOnly}
              />
            </CarbonColumn>
            {!isReadOnly && (
              <CarbonColumn>
                <CarbonPasswordInput
                  labelText={t('in-settings:tabs.ldapForm.passwordForReadOnlyUser')}
                  id="ldap_roPassword"
                  value={roPasswordField.value}
                  onChange={e => {
                    setForm(form.updateIn(['roForm', 'roPassword'], f => f.setValue(e.target.value).setTouched(true)));
                  }}
                  invalid={roPasswordField.touched && isRoPasswordError !== undefined}
                  invalidText={isRoPasswordError}
                />
              </CarbonColumn>
            )}
          </CarbonRow>
        )}
      </CarbonStack>
    </CarbonFormGroup>
  );
};

const LdapQueriesSection = ({ form, setForm }: LdapFormProps) => {
  const isReadOnly = form.get('mode').value === LDAP_MODE.DELETE;
  const baseField = form.get('base');
  const groupQueryField = form.get('groupQuery');
  const groupMemberField = form.get('groupMemberField');
  const emailField = form.get('emailField');
  const userQueryTemplateField = form.get('userQueryTemplate');
  return (
    <CarbonFormGroup legendText="">
      <Typography variant="heading-02">{t('in-settings:tabs.ldapForm.ldapQueries')}</Typography>
      <CarbonStack gap={4}>
        <CarbonTextInput
          labelText={t('in-settings:tabs.base')}
          helperText={t('in-settings:tabs.baseDescription')}
          id="ldap_base"
          value={baseField.value}
          onChange={e => {
            setForm(form.updateIn(['base'], f => f.setValue(e.target.value).setTouched(true)));
          }}
          invalid={!baseField.valid && baseField.touched}
          invalidText={baseField.messages[0]?.message}
          readOnly={isReadOnly}
        />
        <CarbonRow>
          <CarbonColumn>
            <CarbonTextInput
              labelText={t('in-settings:tabs.groupQuery')}
              helperText={t('in-settings:tabs.groupQueryDescription')}
              id="ldap_groupQuery"
              value={groupQueryField.value}
              onChange={e => {
                setForm(form.updateIn(['groupQuery'], f => f.setValue(e.target.value).setTouched(true)));
              }}
              invalid={!groupQueryField.valid && groupQueryField.touched}
              invalidText={groupQueryField.messages[0]?.message}
              readOnly={isReadOnly}
            />
          </CarbonColumn>
          <CarbonColumn>
            <CarbonTextInput
              labelText={t('in-settings:tabs.groupMemberField')}
              id="ldap_groupMemberField"
              helperText={t('in-settings:tabs.groupMemberFieldDescription')}
              value={groupMemberField.value}
              onChange={e => {
                setForm(form.updateIn(['groupMemberField'], f => f.setValue(e.target.value).setTouched(true)));
              }}
              invalid={!groupMemberField.valid && groupMemberField.touched}
              invalidText={groupMemberField.messages[0]?.message}
              readOnly={isReadOnly}
            />
          </CarbonColumn>
        </CarbonRow>
        <CarbonRow>
          <CarbonColumn>
            <CarbonTextInput
              labelText={t('in-settings:tabs.userQueryTemplate')}
              helperText={t('in-settings:tabs.userQueryTemplateDescription')}
              id="ldap_userQueryTemplate"
              value={userQueryTemplateField.value}
              onChange={e => {
                setForm(form.updateIn(['userQueryTemplate'], f => f.setValue(e.target.value).setTouched(true)));
              }}
              invalid={!userQueryTemplateField.valid && userQueryTemplateField.touched}
              invalidText={userQueryTemplateField.messages[0]?.message}
              readOnly={isReadOnly}
            />
          </CarbonColumn>
          <CarbonColumn>
            <CarbonTextInput
              labelText={t('in-settings:tabs.emailField')}
              helperText={t('in-settings:tabs.emailFieldDescription')}
              id="ldap_emailField"
              value={emailField.value}
              onChange={e => {
                setForm(form.updateIn(['emailField'], f => f.setValue(e.target.value).setTouched(true)));
              }}
              invalid={!emailField.valid && emailField.touched}
              invalidText={emailField.messages[0]?.message}
              readOnly={isReadOnly}
            />
          </CarbonColumn>
        </CarbonRow>
      </CarbonStack>
    </CarbonFormGroup>
  );
};

const OptionalSettingsSection = ({ form, setForm }: LdapFormProps) => {
  const isReadOnly = form.get('mode').value === LDAP_MODE.DELETE;
  const userDnMappingField = form.get('userDnMapping');
  const userField = form.get('userField');
  return (
    <CarbonFormGroup legendText="" legendId="optionalSettings">
      <Typography variant="heading-02">{t('in-settings:tabs.ldapForm.optionalSettings')}</Typography>
      <CarbonStack gap={4}>
        <CarbonRow>
          <CarbonColumn>
            <CarbonTextInput
              labelText={t('in-settings:tabs.userDnMapping')}
              helperText={t('in-settings:tabs.userDnMappingDescription')}
              id="userDnMapping"
              value={userDnMappingField.value}
              onChange={e => {
                setForm(form.updateIn(['userDnMapping'], f => f.setValue(e.target.value).setTouched(true)));
              }}
              invalid={!userDnMappingField.valid && userDnMappingField.touched}
              invalidText={userDnMappingField.messages[0]?.message}
              readOnly={isReadOnly}
            />
          </CarbonColumn>
          <CarbonColumn>
            <CarbonTextInput
              labelText={t('in-settings:tabs.userField')}
              helperText={t('in-settings:tabs.userFieldDescription')}
              id="userField"
              value={userField.value}
              onChange={e => {
                setForm(form.updateIn(['userField'], f => f.setValue(e.target.value).setTouched(true)));
              }}
              invalid={!userField.valid && userField.touched}
              invalidText={userField.messages[0]?.message}
              readOnly={isReadOnly}
            />
          </CarbonColumn>
        </CarbonRow>
      </CarbonStack>
    </CarbonFormGroup>
  );
};

const InstanaAdministrationAccessSection = ({ form, setForm }: LdapFormProps) => {
  const isReadOnly = form.get('mode').value === LDAP_MODE.DELETE;
  const testUserField = form.get('testUser');
  const testPasswordField = form.get('testPassword');
  return (
    <CarbonFormGroup legendText="" legendId="instanaAdministrationaccess">
      <Typography variant="heading-02">{t('in-settings:tabs.ldapForm.instanaAdministrationaccess')}</Typography>
      <CarbonStack gap={4}>
        <Typography variant="body-01">
          <Trans i18nKey="in-settings:tabs.ldapForm.instanaAdministrationaccessDescription" />
        </Typography>
        <CarbonRow>
          <CarbonColumn>
            <CarbonTextInput
              labelText={t('in-settings:tabs.ldapForm.usernameAdministrationAccess')}
              helperText={t('in-settings:tabs.ldapForm.usernameAdministrationAccessDescription')}
              id="ldap_testUser"
              value={testUserField.value}
              onChange={e => {
                setForm(form.updateIn(['testUser'], f => f.setValue(e.target.value).setTouched(true)));
              }}
              invalid={!testUserField.valid && testUserField.touched}
              invalidText={testUserField.messages[0]?.message}
              readOnly={isReadOnly}
            />
          </CarbonColumn>
          <CarbonColumn>
            <CarbonPasswordInput
              labelText={t('in-settings:tabs.ldapForm.passwordAdministrationAccess')}
              helperText={t('in-settings:tabs.ldapForm.passwordAdministrationAccessDescription')}
              id="ldap_testPassword"
              value={testPasswordField.value}
              onChange={e => {
                setForm(form.updateIn(['testPassword'], f => f.setValue(e.target.value).setTouched(true)));
              }}
              invalid={!testPasswordField.valid && testPasswordField.touched}
              invalidText={testPasswordField.messages[0]?.message}
              readOnly={isReadOnly}
            />
          </CarbonColumn>
        </CarbonRow>
        <CarbonRow>
          <CarbonColumn>
            <Typography variant="body-01">{t('in-settings:tabs.ldapForm.testConnectionDescription')}</Typography>
          </CarbonColumn>
        </CarbonRow>
      </CarbonStack>
    </CarbonFormGroup>
  );
};
