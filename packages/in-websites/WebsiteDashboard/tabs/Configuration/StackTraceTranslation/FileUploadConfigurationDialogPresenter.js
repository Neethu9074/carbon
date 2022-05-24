/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment } from 'react';

import { Link } from '@instana/components';

import TemporaryMessage from 'in-components/TemporaryMessage/TemporaryMessage';
import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
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
import { baseUrl } from 'in-services/config';
import { t, Trans } from 'in-i18n';

import locals from './FileUploadConfigurationDialogPresenter.mless';

export default function FileUploadConfigurationDialogPresenter(props) {
  const { form, message, onSubmit, onChange, websiteId } = props;

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
              <Trans
                i18nKey="in-websites:websiteDashboard.tabs.configuration.fileUploadConfigurationDialogOpenAPIHelp"
                components={{
                  documentation: (
                    <Link
                      href="https://www.ibm.com/docs/en/obi/current?topic=monitoring-web-rest-api-examples"
                      external
                    >
                      null
                    </Link>
                  )
                }}
              />
            </SectionHelp>
            <Row>
              <Col xs={12}>
                <CopyableText
                  title={t('in-websites:websiteDashboard.tabs.configuration.fileUploadUrl')}
                  value={`${baseUrl}/api/website-monitoring/config/${encodeURIComponent(websiteId)}/sourceMapUpload/${
                    form.get('id').value
                  }/form`}
                  fieldName="sourceMapUploadFormUrl"
                />
              </Col>
              <Col xs={12}>
                <CopyableText
                  title={t('in-websites:websiteDashboard.tabs.configuration.clearUploadedFilesUrl')}
                  value={`${baseUrl}/api/website-monitoring/config/${encodeURIComponent(websiteId)}/sourceMapUpload/${
                    form.get('id').value
                  }/clear`}
                  fieldName="sourceMapUploadClearUrl"
                />
              </Col>
            </Row>
          </>
        )}

        <SaveCancel form={form} onClickCancelButton={close} isCreate={isBlank(form.get('id').value)} />
      </form>
    </Dialog>
  );
}

function CopyableText({ title, value, fieldName }) {
  return (
    <FormGroup>
      <Label htmlFor={fieldName}>{title}</Label>

      <div className={locals.flexWrapper}>
        <Input className={locals.input} readOnly type="text" id={fieldName} value={value} autoComplete="off" />
        <CopyToClipboardButton getText={() => value} />
      </div>
    </FormGroup>
  );
}
