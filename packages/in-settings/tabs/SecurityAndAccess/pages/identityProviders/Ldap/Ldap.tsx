/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, Field, MapForm, MapFormItems, ValidationResult } from 'formalistic';
import React, { useState } from 'react';

import { LdapConfig, OidcApiResponseConfig, SamlConfig } from '@instana/types';
import { Link, Checkbox, Button } from '@instana/components';

import {
  getConfigAsResultObservable,
  getTestResult,
  refresh,
  setConfig,
  deleteConfig
} from 'in-settings/tabs/SecurityAndAccess/api/ldap';
// @ts-expect-error needs TS migration
import TemporaryMessage from 'in-components/TemporaryMessage/TemporaryMessageV2';
import { deleteItem, isAnyInvitationsPending } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/utils';
import { isAnotherIdpActivated } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/configuredIdPCheck';
import { getConfigAsResultObservable as getOidcConfig } from 'in-settings/tabs/SecurityAndAccess/api/oidc';
import { getConfigAsResultObservable as getSamlConfig } from 'in-settings/tabs/SecurityAndAccess/api/saml';
// @ts-expect-error needs TS migration
import ApiItemView from 'in-settings/components/ApiItemView';
import { CtaTrackingFunction, useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { SETTINGS_IDENTITY_PROVIDER_LDAP_UPDATE } from 'in-services/tracking/eventNames';
import { SETTINGS_IDP_LDAP_TEST_CONFIGURATION } from 'in-services/tracking/tracking';
import { securityAndAccessIdentityProviders } from 'in-settings/navigation/paths';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { EnrichFormProps, SaveItemProps } from 'in-settings/types';
import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { idpConfigV2Enabled } from 'in-services/featureFlags';
import { UPDATED_OBJECT } from 'in-services/util/constants';
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

import identityProvidersLocals from '../identityProviders.mless';
import locals from './Ldap.mless';

type LdapMapFormItems = {
  acceptAnyCA: Field<boolean>;
  activated: Field<boolean>;
  base: Field<string | undefined>;
  emailField: Field<string | undefined>;
  emptyPass: Field<boolean>;
  groupMemberField: Field<string | undefined>;
  groupMemberFieldConfigured: Field<boolean>;
  groupQuery: Field<string | undefined>;
  roPassword: Field<string | undefined>;
  roUser: Field<string | undefined>;
  testPassword: Field<string>;
  testUser: Field<string>;
  url: Field<string | undefined>;
  userDnMapping: Field<string | undefined>;
  userField: Field<string | undefined>;
  userQueryTemplate: Field<string | undefined>;
};
type LdapMapForm = MapForm<LdapMapFormItems>;

interface TestResultState {
  id?: string;
  waitingForTest: boolean;
  messageProps?: Parameters<typeof TemporaryMessage>[0];
}

interface LdapProps extends Pick<Parameters<typeof isAnyInvitationsPending>[0], 'invitations'> {}

export default function Ldap(props: LdapProps) {
  const [testResultMessage, setTestResultMessage] = useState<TestResultState>({
    waitingForTest: false,
    messageProps: undefined
  });
  const { trackCta, unstable_trackEvent } = useSegmentTracking();

  return (
    <ApiItemView
      getObservables={() => ({
        config: getConfigAsResultObservable(undefined),
        samlConfig: getSamlConfig(undefined),
        oidcConfig: getOidcConfig(undefined)
      })}
      enrichForm={enrichForm}
      onCancelClick={refresh}
      saveItem={(data: Omit<SaveItemPropsWithForm, 'unstable_trackEvent'>) => {
        if (isAnyInvitationsPending(props)) {
          addActiveDialog(
            <ConfirmationDialog
              header={t('in-settings:components.confirmRemove')}
              description={
                <span>
                  <Trans i18nKey="in-settings:tabs.createIDPConfirmationDescription" />
                </span>
              }
              onSubmit={() => {
                saveItem({ ...data, unstable_trackEvent });
                close();
              }}
              confirmButtonKind="create"
              confirmButtonLabel={t('forms.actions.save')}
            />
          );
        } else saveItem({ ...data, unstable_trackEvent });
      }}
      deleteItem={(data: Pick<Parameters<typeof deleteItem>[0], 'setMessage'>) =>
        deleteItem({ ...data, deleteConfig: deleteConfig })
      }
      render={(data: Omit<LdapFormProps, 'trackCta'>) => <LdapForm {...data} trackCta={trackCta} />}
      testResultMessage={testResultMessage}
      setTestResultMessage={setTestResultMessage}
      {...(idpConfigV2Enabled
        ? { parentViewName: t('in-settings:tabs.identityProviders'), parentPath: securityAndAccessIdentityProviders }
        : {})}
    />
  );
}

interface LdapFormProps {
  form: LdapMapForm;
  result: {
    config: LdapConfig;
    oidcConfig?: OidcApiResponseConfig;
    samlConfig?: SamlConfig;
  };
  setForm: React.Dispatch<React.SetStateAction<LdapMapForm>>;
  setTestResultMessage: React.Dispatch<React.SetStateAction<TestResultState>>;
  testResultMessage: TestResultState;
  trackCta: CtaTrackingFunction;
}

function LdapForm({ form, setForm, testResultMessage, setTestResultMessage, result, trackCta }: LdapFormProps) {
  const emptyPassField = form.get('emptyPass');
  const roUserField = form.get('roUser');
  const roPasswordField = form.get('roPassword');
  const testUserField = form.get('testUser');
  const testPasswordField = form.get('testPassword');
  const acceptAnyCAField = form.get('acceptAnyCA');

  // Note: Not touching this.
  // Whoever wrote it must have had a reason…
  // I just have no idea what it was 🙈
  // Question: Why don't we use form.touched and form.valid here?
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
  const needsROCredentials = !emptyPassField.value;
  const shouldDoROUserPassCheck = needsROCredentials && (testResultMessage.messageProps || allFieldsFilled);
  const hasROUser = roUserField.value && roUserField.value !== '';
  const hasROPassword = roPasswordField.value && roPasswordField.value !== '';
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
                docLink: (
                  // @ts-expect-error Link component expects children to be defined but children get passed down from Trans component
                  <Link
                    external
                    size="sm"
                    href=" https://www.ibm.com/docs/en/instana-observability/current?topic=configuration-configuring-ldap"
                  />
                )
              }}
            />
          </p>

          <form>
            <Section restrictWidth="50rem">
              <h2>{t('in-settings:tabs.requiredSettings')}</h2>
              <Row className={identityProvidersLocals.row}>
                <Col xs={12}>
                  <FormInput
                    description={t('in-settings:tabs.urlDescription')}
                    fieldName="url"
                    form={form}
                    label={t('in-settings:tabs.url')}
                    placeholder="ldaps://ldap.example.com:636"
                    setForm={setForm}
                  />
                </Col>
              </Row>

              <Row className={identityProvidersLocals.row}>
                <Col xs={12}>
                  <Checkbox
                    label={t('in-settings:tabs.ldapsAcceptAnyCA')}
                    checked={acceptAnyCAField.value}
                    onChange={() => {
                      const newValue = form.updateIn(['acceptAnyCA'], f =>
                        f.setValue(!acceptAnyCAField.value).setTouched(true)
                      );
                      setForm(newValue);
                    }}
                  />
                </Col>
              </Row>

              <Row className={identityProvidersLocals.row}>
                <Col xs={12}>
                  <Checkbox
                    label={t('in-settings:tabs.anonymous')}
                    checked={emptyPassField.value}
                    onChange={() => {
                      let newValues = form.updateIn(['emptyPass'], f =>
                        f.setValue(!emptyPassField.value).setTouched(true)
                      );
                      if (emptyPassField.value) {
                        newValues = newValues.updateIn(['roUser'], f => f.setValue('').setTouched(true));
                        newValues = newValues.updateIn(['roPassword'], f => f.setValue('').setTouched(true));
                      }
                      setForm(newValues);
                    }}
                  />
                </Col>
              </Row>

              {!emptyPassField.value ? (
                <Row className={identityProvidersLocals.firstHideableRow}>
                  <Col xs={6}>
                    <FormInput
                      className={locals.formGroupWithoutMargin}
                      description={t('in-settings:tabs.userDescription')}
                      fieldName="roUser"
                      form={form}
                      label={t('in-settings:tabs.user')}
                      placeholder="cn=admin,dc=example,dc=com"
                      setForm={setForm}
                    />
                    {shouldShowMissingUserMessage && (
                      <ValidationBlock>{t('in-applications:forms.errorBlankValue')}</ValidationBlock>
                    )}
                  </Col>
                  <Col xs={6}>
                    <FormInput
                      className={locals.formGroupWithoutMargin}
                      description={t('in-settings:tabs.passwordDescription')}
                      fieldName="roPassword"
                      form={form}
                      label={t('in-settings:tabs.password')}
                      placeholder={t('in-settings:tabs.hidden')}
                      setForm={setForm}
                      type="password"
                    />
                    {shouldShowMissingPasswordMessage && (
                      <ValidationBlock>{t('in-applications:forms.errorBlankValue')}</ValidationBlock>
                    )}
                  </Col>
                </Row>
              ) : undefined}
            </Section>
            <Section restrictWidth="50rem">
              <Row className={identityProvidersLocals.row}>
                <Col xs={6}>
                  <FormInput
                    description={t('in-settings:tabs.baseDescription')}
                    fieldName="base"
                    form={form}
                    label={t('in-settings:tabs.base')}
                    placeholder="dc=example,dc=com"
                    setForm={setForm}
                  />
                </Col>
                <Col xs={6}>
                  <FormInput
                    description={t('in-settings:tabs.groupQueryDescription')}
                    fieldName="groupQuery"
                    form={form}
                    label={t('in-settings:tabs.groupQuery')}
                    placeholder="(cn=INSTANA)"
                    setForm={setForm}
                  />
                </Col>
              </Row>
              <Row className={identityProvidersLocals.row}>
                <Col xs={6}>
                  <FormInput
                    description={t('in-settings:tabs.groupMemberFieldDescription')}
                    fieldName="groupMemberField"
                    form={form}
                    label={t('in-settings:tabs.groupMemberField')}
                    placeholder={t('in-settings:tabs.member')}
                    setForm={setForm}
                  />
                </Col>
                <Col xs={6}>
                  <FormInput
                    description={t('in-settings:tabs.userQueryTemplateDescription')}
                    fieldName="userQueryTemplate"
                    form={form}
                    label={t('in-settings:tabs.userQueryTemplate')}
                    placeholder="(uid=%s)"
                    setForm={setForm}
                  />
                </Col>
              </Row>
              <Row className={identityProvidersLocals.row}>
                <Col xs={6}>
                  <FormInput
                    description={t('in-settings:tabs.emailFieldDescription')}
                    fieldName="emailField"
                    form={form}
                    label={t('in-settings:tabs.emailField')}
                    placeholder={t('in-settings:tabs.mail')}
                    setForm={setForm}
                  />
                </Col>
              </Row>
            </Section>
            <Section restrictWidth="50rem">
              <h3>{t('in-settings:tabs.ldapUserAccount')}</h3>

              <Row className={identityProvidersLocals.row}>
                <Col xs={12}>
                  <DescriptionText>
                    {t('in-settings:tabs.thisAccountIsAutomaticallyAssignedAnAdminRoleLDAP')}
                  </DescriptionText>
                </Col>
              </Row>
              <Row className={identityProvidersLocals.row}>
                <Col xs={6}>
                  <FormInput
                    className={locals.formGroupWithoutMargin}
                    description={t('in-settings:tabs.usernameDescription')}
                    fieldName="testUser"
                    form={form}
                    label={t('in-settings:tabs.username')}
                    setForm={setForm}
                  />
                </Col>
                <Col xs={6}>
                  <FormInput
                    className={locals.formGroupWithoutMargin}
                    description={t('in-settings:tabs.usernamePasswordDescription')}
                    fieldName="testPassword"
                    form={form}
                    label={t('in-settings:tabs.password')}
                    placeholder={t('in-settings:tabs.hidden')}
                    setForm={setForm}
                    type="password"
                  />
                </Col>
                <Col xs={12}>
                  <Button
                    icon={testResultMessage.waitingForTest ? 'lib_actions_loading' : undefined}
                    iconSpinning={testResultMessage.waitingForTest}
                    className={locals.testButton}
                    disabled={
                      !isNotBlank(testUserField.value) ||
                      !isNotBlank(testPasswordField.value) ||
                      testResultMessage.waitingForTest
                    }
                    kind="secondary"
                    onClick={() => {
                      const config: LdapConfig = form.toJS();
                      const result$ = getTestResult(config);
                      const id = (Math.random() * 100000).toFixed();
                      setTestResultMessage({
                        id: '',
                        waitingForTest: true
                      });

                      result$.subscribe(data => {
                        if (data.data) {
                          const testResult = data.data;
                          const testPassed = testResult?.testPassed;
                          const reason = testResult?.reason;
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
                        } else if (data.errors) {
                          setTestResultMessage({
                            id,
                            waitingForTest: false,
                            messageProps: {
                              text: `${t('in-settings:tabs.ldapTestFailed')} ${data.errors[0].message}`,
                              type: 'error'
                            }
                          });
                          setForm(form.setTouched(true, { recurse: true }));
                        }
                      });
                    }}
                  >
                    {t('in-settings:tabs.testConfiguration')}
                  </Button>
                </Col>
              </Row>
              {testResultMessage.messageProps && (
                <Row className={identityProvidersLocals.row}>
                  <Col xs={12}>
                    <TemporaryMessage {...testResultMessage.messageProps} duration={10000} />
                  </Col>
                </Row>
              )}
            </Section>
            <Section restrictWidth="50rem">
              <h2>{t('in-settings:tabs.optionalSettings')}</h2>
              <Row className={identityProvidersLocals.row}>
                <Col xs={6}>
                  <FormInput
                    description={t('in-settings:tabs.userDnMappingDescription')}
                    fieldName="userDnMapping"
                    form={form}
                    label={t('in-settings:tabs.userDnMapping')}
                    placeholder={t('in-settings:tabs.optional')}
                    setForm={setForm}
                  />
                </Col>
                <Col xs={6}>
                  <FormInput
                    description={t('in-settings:tabs.userFieldDescription')}
                    fieldName="userField"
                    form={form}
                    label={t('in-settings:tabs.userField')}
                    placeholder={t('in-settings:tabs.optional')}
                    setForm={setForm}
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

const SUPPORTED_INPUT_TYPES = Object.freeze(['text', 'number', 'password'] as const);

interface FormInputProps<FIELD_KEY extends keyof LdapMapFormItems> {
  className?: string;
  description?: string;
  disabled?: boolean;
  fieldName: FIELD_KEY;
  form: LdapMapForm;
  label: string;
  parseFn?: (val: string) => LdapMapFormItems[FIELD_KEY]['value'];
  placeholder?: string;
  setForm: React.Dispatch<React.SetStateAction<LdapMapForm>>;
  type?: (typeof SUPPORTED_INPUT_TYPES)[number];
}

function FormInput<FIELD_KEY extends keyof LdapMapFormItems>({
  className,
  description,
  disabled,
  fieldName,
  form,
  label,
  parseFn = val => val,
  placeholder,
  setForm,
  type
}: FormInputProps<FIELD_KEY>) {
  return form.get(fieldName).map(field => (
    <FormGroup className={className}>
      <Label htmlFor={`ldap_${fieldName}`} hasError={!field.valid && field.touched}>
        {label}
      </Label>

      <Input
        id={`ldap_${fieldName}`}
        type={type || 'text'}
        value={field.value?.toString() ?? ''}
        disabled={disabled}
        placeholder={placeholder}
        onChange={e => {
          const newValue = parseFn(e.target.value);
          setForm(form.updateIn([fieldName], f => f.setValue(newValue as never).setTouched(true)) as LdapMapForm);
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
  scrollIntoView(document.getElementsByClassName('message')[0] as HTMLElement);
}

interface SaveItemPropsWithForm extends SaveItemProps {
  form: LdapMapForm;
}

function saveItem({ form, setMessage, unstable_trackEvent }: SaveItemPropsWithForm) {
  setMessage({ message: t('in-settings:tabs.savingConfig'), type: 'neutral', isSaving: true });
  const setConfigResult$ = setConfig(form.toJS());
  setConfigResult$.once(
    () => {
      setMessage({ text: t('in-settings:tabs.configSuccessfullySaved'), type: 'success' });
      unstable_trackEvent(UPDATED_OBJECT, { objectType: SETTINGS_IDENTITY_PROVIDER_LDAP_UPDATE });
      scrollToResultMessage();
      refresh();
    },
    error => {
      setMessage({ text: t('in-settings:tabs.failedToSaveConfig', { err: error.message }), type: 'error' });
      scrollToResultMessage();
    }
  );
}

function checkNonAnonymousROUserHasCredentials({ emptyPass, roUser, roPassword }: LdapMapFormItems): ValidationResult {
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
  return undefined;
}

function enrichForm<FORM_ITEMS extends MapFormItems>(
  _form: MapForm<FORM_ITEMS>,
  { setCanDeleteItem, result: { config } }: EnrichFormProps<LdapConfig>
): LdapMapForm {
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
        value: config.testUser ?? '',
        validator: notBlankValidator
      }),
      testPassword: createField({
        value: config.testPassword ?? '',
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
      }),
      groupMemberFieldConfigured: createField({
        value: config.groupMemberFieldConfigured
      })
    }
  });
}
