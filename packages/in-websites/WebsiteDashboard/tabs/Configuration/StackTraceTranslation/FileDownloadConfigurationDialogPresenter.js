/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';
import { Link } from '@instana/components';

import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import TemporaryMessage from 'in-components/TemporaryMessage';
import SectionHelp from 'in-settings/components/SectionHelp';
import { close } from 'in-components/DialogPresenter/store';
import SaveCancel from 'in-settings/components/SaveCancel';
import FormGroup from 'in-settings/components/FormGroup';
import { Row, Col } from 'in-new-components/layout/Grid';
import { Trans, markAsSecureString, t } from 'in-i18n';
import Dialog from 'in-new-components/Dialog/Dialog';
import HelpText from 'in-components/form/HelpText';
import { isBlank } from 'in-services/util/string';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

import locals from './FileDownloadConfigurationDialogPresenter.mless';

export default function FileDownloadConfigurationDialogPresenter(props) {
  const { form, message, onSubmit } = props;
  const disabled = message && message.isSaving;

  return (
    <Dialog
      title={
        form.get('id').value
          ? t('in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogTitleEdit')
          : t('in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogTitleNew')
      }
      onClose={close}
      className={locals.dialog}
    >
      <form onSubmit={onSubmit}>
        <fieldset disabled={disabled}>
          {message && <TemporaryMessage type={message.type} message={message.message} duration={5000} />}

          <MatchingRules {...props} disabled={disabled} />
          <BasicAuth {...props} />
          <HttpHeaders {...props} disabled={disabled} />

          <SaveCancel form={form} onClickCancelButton={close} isCreate={isBlank(form.get('id').value)} />
        </fieldset>
      </form>
    </Dialog>
  );
}

function MatchingRules({ form, onChange, addMatchingRule, removeMatchingRule, disabled }) {
  return (
    <Fragment>
      <SectionHeading withoutTopSpacing>
        {t('in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogHeadingMatchingRules')}
      </SectionHeading>
      <SectionHelp>
        <p>{t('in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogMatchingRuleHelp1')}</p>
        <p>
          <Trans
            i18nKey="in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogMatchingRuleHelp2"
            values={{ http: markAsSecureString('https://') }}
          />
        </p>
      </SectionHelp>
      <TouchedMessages field={form.get('matchingRules')} />

      {form.get('matchingRules').map((rule, i) => (
        <Fragment key={i}>
          <TouchedMessages field={rule} />

          <div className={locals.removableRow}>
            <Row>
              <Col md={2}>
                {rule.get('allowTransmissionViaInsecureChannel').map(field => (
                  <FormGroup>
                    <Label
                      htmlFor={`config-${i}-allowTransmissionViaInsecureChannel`}
                      hasError={!field.valid && field.touched}
                    >
                      {t('in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogLabelScheme')}
                    </Label>
                    <Select
                      id={`config-${i}-allowTransmissionViaInsecureChannel`}
                      value={String(field.value)}
                      onChange={e =>
                        onChange(['matchingRules', i, 'allowTransmissionViaInsecureChannel'], e.target.value === 'true')
                      }
                      hasError={!field.valid && field.touched}
                    >
                      <option value="false">https://</option>
                      <option value="true">
                        {t(
                          'in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogLabelHTTPSOrHTTP'
                        )}
                      </option>
                    </Select>
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))}
              </Col>
              <Col md={5}>
                {rule.get('host').map(field => (
                  <FormGroup>
                    <Label htmlFor={`config-${i}-host`} hasError={!field.valid && field.touched}>
                      {t('in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogLabelHost')}
                    </Label>
                    <Input
                      id={`config-${i}-host`}
                      type="text"
                      value={field.value || ''}
                      onChange={e => onChange(['matchingRules', i, 'host'], e.target.value)}
                      hasError={!field.valid && field.touched}
                    />
                    <HelpText>
                      <Trans
                        i18nKey="in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogLabelHostHelpText"
                        values={{ asterisks: markAsSecureString('*') }}
                      />
                    </HelpText>
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))}
              </Col>
              <Col md={5}>
                {rule.get('path').map(field => (
                  <FormGroup>
                    <Label htmlFor={`config-${i}-path`} hasError={!field.valid && field.touched}>
                      {t('in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogLabelPath')}
                    </Label>
                    <Input
                      id={`config-${i}-path`}
                      type="text"
                      value={field.value || ''}
                      onChange={e => onChange(['matchingRules', i, 'path'], e.target.value)}
                      hasError={!field.valid && field.touched}
                    />
                    <HelpText>
                      <Trans
                        i18nKey="in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogLabelPathHelpText"
                        values={{ asterisks: markAsSecureString('*') }}
                      />
                    </HelpText>
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))}
              </Col>
            </Row>
            <SvgIcon
              className={locals.removeButton}
              type="lib_actions_delete"
              onClick={() => !disabled && removeMatchingRule(i)}
            />
          </div>
        </Fragment>
      ))}

      <Button
        kind="secondary"
        icon="lib_openclose_add"
        type="button"
        onClick={addMatchingRule}
        className={locals.addButton}
      >
        {t('in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogButtonAddMatchingRule')}
      </Button>
    </Fragment>
  );
}

function BasicAuth({ form, onChange }) {
  return (
    <Fragment>
      <SectionHeading>
        {t(
          'in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogHeadingHTTPBasicAuthentication'
        )}
      </SectionHeading>
      <SectionHelp>
        <p>
          <Trans
            i18nKey="in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogHTTPBasicAuthenticationHelp"
            components={{
              linkToDocs: (
                <Link
                  href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Basic_authentication_scheme"
                  external
                />
              )
            }}
          />
        </p>
      </SectionHelp>

      <Row>
        <Col md={6}>
          {form.get('basicAuthUserName').map(field => (
            <FormGroup>
              <Label htmlFor="config-basicAuthUserName" hasError={!field.valid && field.touched}>
                {t('in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogLabelUserName')}
              </Label>
              <Input
                id="config-basicAuthUserName"
                type="text"
                value={field.value || ''}
                onChange={e => onChange(['basicAuthUserName'], e.target.value)}
                hasError={!field.valid && field.touched}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </Col>
        <Col md={6}>
          {form.get('basicAuthPassword').map(field => (
            <FormGroup>
              <Label htmlFor="config-basicAuthPassword" hasError={!field.valid && field.touched}>
                {t('in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogLabelPassword')}
              </Label>
              <Input
                id="config-basicAuthPassword"
                type="password"
                autoComplete="off"
                value={field.value || ''}
                onChange={e => onChange(['basicAuthPassword'], e.target.value)}
                hasError={!field.valid && field.touched}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </Col>
      </Row>
    </Fragment>
  );
}

function HttpHeaders({ form, onChange, addHeader, removeHeader, disabled }) {
  return (
    <Fragment>
      <SectionHeading>
        {t(
          'in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogHeadingCustomHTTPRequestHeaders'
        )}
      </SectionHeading>
      <SectionHelp>
        <p>
          {t(
            'in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogCustomHTTPRequestHeadersHelp'
          )}
        </p>
      </SectionHelp>

      {form.get('headers').map((header, i) => (
        <Fragment key={i}>
          <TouchedMessages field={header} />

          <div className={locals.removableRow}>
            <Row>
              <Col md={6}>
                {header.get('key').map(field => (
                  <FormGroup>
                    <Label htmlFor={`config-headers-${i}-key`} hasError={!field.valid && field.touched}>
                      {t('in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogLabelKey')}
                    </Label>
                    <Input
                      id={`config-headers-${i}-key`}
                      type="text"
                      value={field.value || ''}
                      onChange={e => onChange(['headers', i, 'key'], e.target.value)}
                      hasError={!field.valid && field.touched}
                    />
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))}
              </Col>
              <Col md={6}>
                {header.get('value').map(field => (
                  <FormGroup>
                    <Label htmlFor={`config-headers-${i}-value`} hasError={!field.valid && field.touched}>
                      {t('in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogLabelValue')}
                    </Label>
                    <Input
                      id={`config-headers-${i}-value`}
                      type="text"
                      value={field.value || ''}
                      onChange={e => onChange(['headers', i, 'value'], e.target.value)}
                      hasError={!field.valid && field.touched}
                    />
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))}
              </Col>
            </Row>

            <SvgIcon
              className={locals.removeButton}
              type="lib_actions_delete"
              onClick={() => !disabled && removeHeader(i)}
            />
          </div>
        </Fragment>
      ))}

      <Button kind="secondary" icon="lib_openclose_add" type="button" onClick={addHeader} className={locals.addButton}>
        {t('in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogButtonAddHeader')}
      </Button>
    </Fragment>
  );
}
