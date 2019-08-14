import React, { Fragment } from 'react';

import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import TemporaryMessage from 'in-components/TemporaryMessage';
import { close } from 'in-components/DialogPresenter/store';
import SaveCancel from 'in-settings/components/SaveCancel';
import FormGroup from 'in-settings/components/FormGroup';
import { Row, Col } from 'in-new-components/layout/Grid';
import HelpText from 'in-components/form/HelpText';
import { isBlank } from 'in-services/util/string';
import Select from 'in-components/form/Select';
import Button from 'in-new-components/Button';
import Dialog from 'in-new-components/Dialog';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';

import locals from './FileDownloadConfigurationDialogPresenter.mless';

export default function FileDownloadConfigurationDialogPresenter(props) {
  const { form, message, onSubmit } = props;
  return (
    <Dialog
      title={`${form.get('id').value ? 'Edit' : 'New'} File Download Configuration`}
      onClose={close}
      className={locals.dialog}
    >
      {message && <TemporaryMessage type={message.type} message={message.message} duration={5000} />}

      <form onSubmit={onSubmit}>
        <p className={locals.help}>
          Define what kind of credentials (HTTP basic authentication) and/or HTTP headers we should include in HTTP
          requests to download JavaScript and source map files.
        </p>

        <MatchingRules {...props} />
        <BasicAuth {...props} />
        <HttpHeaders {...props} />

        <SaveCancel form={form} onClickCancelButton={close} isCreate={isBlank(form.get('id').value)} />
      </form>
    </Dialog>
  );
}

function MatchingRules({ form, onChange, addMatchingRule, removeMatchingRule }) {
  return (
    <Fragment>
      <SectionHeading>Matching Rules</SectionHeading>
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
                      Scheme
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
                      <option value="true">https:// or http://</option>
                    </Select>
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))}
              </Col>
              <Col md={5}>
                {rule.get('host').map(field => (
                  <FormGroup>
                    <Label htmlFor={`config-${i}-host`} hasError={!field.valid && field.touched}>
                      Host
                    </Label>
                    <Input
                      id={`config-${i}-host`}
                      type="text"
                      value={field.value || ''}
                      onChange={e => onChange(['matchingRules', i, 'host'], e.target.value)}
                      hasError={!field.valid && field.touched}
                    />
                    <HelpText>
                      Describe how to match the host segment of URLs. You can define wildcard matching via{' '}
                      <code>*</code>
                    </HelpText>
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))}
              </Col>
              <Col md={5}>
                {rule.get('path').map(field => (
                  <FormGroup>
                    <Label htmlFor={`config-${i}-path`} hasError={!field.valid && field.touched}>
                      Path
                    </Label>
                    <Input
                      id={`config-${i}-path`}
                      type="text"
                      value={field.value || ''}
                      onChange={e => onChange(['matchingRules', i, 'path'], e.target.value)}
                      hasError={!field.valid && field.touched}
                    />
                    <HelpText>
                      Describe how to match the host segment of URLs. You can define wildcard matching via{' '}
                      <code>*</code>
                    </HelpText>
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))}
              </Col>
            </Row>
            <SvgIcon className={locals.removeButton} type="lib_actions_delete" onClick={() => removeMatchingRule(i)} />
          </div>
        </Fragment>
      ))}

      <Button kind="secondary" icon="lib_openclose_add" type="button" onClick={addMatchingRule}>
        Add Matching Rule
      </Button>
    </Fragment>
  );
}

function BasicAuth({ form, onChange }) {
  return (
    <Fragment>
      <SectionHeading>HTTP Basic Authentication</SectionHeading>
      <Row>
        <Col md={6}>
          {form.get('basicAuthUserName').map(field => (
            <FormGroup>
              <Label htmlFor="config-basicAuthUserName" hasError={!field.valid && field.touched}>
                User Name
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
                Password
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

function HttpHeaders({ form, onChange, addHeader, removeHeader }) {
  return (
    <Fragment>
      <SectionHeading>Custom HTTP Request Headers</SectionHeading>
      {form.get('headers').map((header, i) => (
        <Fragment key={i}>
          <TouchedMessages field={header} />

          <div className={locals.removableRow}>
            <Row>
              <Col md={6}>
                {header.get('key').map(field => (
                  <FormGroup>
                    <Label htmlFor={`config-headers-${i}-key`} hasError={!field.valid && field.touched}>
                      Key
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
                      Value
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

            <SvgIcon className={locals.removeButton} type="lib_actions_delete" onClick={() => removeHeader(i)} />
          </div>
        </Fragment>
      ))}

      <Button kind="secondary" icon="lib_openclose_add" type="button" onClick={addHeader}>
        Add Header
      </Button>
    </Fragment>
  );
}
