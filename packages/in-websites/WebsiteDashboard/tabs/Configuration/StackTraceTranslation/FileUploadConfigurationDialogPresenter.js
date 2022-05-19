/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import TemporaryMessage from 'in-components/TemporaryMessage/TemporaryMessage';
import SectionHeading from 'in-settings/components/SectionHeading';
import SectionHelp from 'in-settings/components/SectionHelp';
import { close } from 'in-components/DialogPresenter/store';
import SaveCancel from 'in-settings/components/SaveCancel';
import FormGroup from 'in-settings/components/FormGroup';
import { Row, Col } from 'in-components/layout/Grid';
import { isBlank } from 'in-services/util/string';
import Dialog from 'in-components/Dialog/Dialog';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

import locals from './FileUploadConfigurationDialogPresenter.mless';

export default function FileUploadConfigurationDialogPresenter(props) {
  const { form, message, onSubmit, websiteId, onChange } = props;
  const host = document.location.host;
  const curlCode = `
curl -X PUT \\
  'https://${host}/api/website-monitoring/config/${websiteId}/sourceMapUpload/${form.get('id').value}/form' \\
  --header 'authorization: apiToken <YOUR-API-TOKEN>' \\
  -F 'url="<FULL-URL-TO-JS>"' \\
  -F 'sourceMap=@"<FULL-PATH-TO-LOCAL-SOURCEMAP>"'
`;

  return (
    <Dialog
      title={
        form.get('id').value
          ? t('in-websites:websiteDashboard.tabs.configuration.fileUploadConfigurationDialogTitleEdit')
          : t('in-websites:websiteDashboard.tabs.configuration.fileUploadConfigurationDialogTitleNew')
      }
      onClose={close}
      className={locals.dialog}
    >
      <form onSubmit={onSubmit}>
        {message && <TemporaryMessage type={message.type} message={message.message} duration={5000} />}

        <SectionHeading withoutTopSpacing>
          {t('in-websites:websiteDashboard.tabs.configuration.fileUploadConfigurationDialogHeadingDescription')}
        </SectionHeading>
        <SectionHelp>
          <p>{t('in-websites:websiteDashboard.tabs.configuration.fileUploadConfigurationDialogDescriptionHelp')}</p>
        </SectionHelp>
        <Row>
          <Col md={12}>
            <FormGroup>
              <Label htmlFor={`config-headers-desc-key`}>
                {t('in-websites:websiteDashboard.tabs.configuration.fileUploadConfigurationDialogLabelDescription')}
              </Label>
              <Input
                id={`config-headers-desc-key`}
                type="text"
                value={form.get('description').value}
                onChange={e => onChange(['description'], e.target.value)}
              />
            </FormGroup>
          </Col>
        </Row>

        {form.get('id').value && (
          <>
            <SectionHeading withoutTopSpacing>
              {t('in-websites:websiteDashboard.tabs.configuration.fileUploadConfigurationDialogHeadingOpenAPI')}
            </SectionHeading>
            <SectionHelp>
              <p>{t('in-websites:websiteDashboard.tabs.configuration.fileUploadConfigurationDialogOpenAPIHelp')}</p>
            </SectionHelp>
            <div className={locals.snippetWrapper}>
              <div className={locals.snippet}>
                <Code code={curlCode} lang="bash" showLineNumbers={false} softWrap />
              </div>
            </div>
          </>
        )}

        <SaveCancel form={form} onClickCancelButton={close} isCreate={isBlank(form.get('id').value)} />
      </form>
    </Dialog>
  );
}
