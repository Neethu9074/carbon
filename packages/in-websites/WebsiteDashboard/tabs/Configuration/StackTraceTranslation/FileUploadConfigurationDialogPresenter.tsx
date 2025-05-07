/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

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
import Code from 'in-components/Code';
import { t, Trans } from 'in-i18n';

import locals from './FileUploadConfigurationDialogPresenter.mless';

export interface MessageType {
  type: 'success' | 'error';
  message: string;
  isSaving?: boolean;
}

interface Props {
  form: MapForm<any>;
  websiteId: string;
  message?: MessageType | null;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onChange: (path: Array<string>, value: string) => void;
}

export default function FileUploadConfigurationDialogPresenter(props: Props) {
  const { form, message, onSubmit, onChange, websiteId } = props;

  const apiBaseUrl = `${baseUrl}/api/website-monitoring/config/${encodeURIComponent(websiteId)}/sourcemap-upload`;
  const apiUploadUrl = `${apiBaseUrl}/${(form.get('id') as Field<string>).value}/form`;
  const apiClearUrl = `${apiBaseUrl}/${(form.get('id') as Field<string>).value}/clear`;

  const lines = [`# examples`];
  lines.push(``);
  lines.push(
    `# upload source map file (Use compressed file if the file size is larger than 10MB. See documentation for details)`
  );
  lines.push(`curl --location --request PUT \\`);
  lines.push(`    '${apiUploadUrl}' \\`);
  lines.push(`    --header 'authorization: apiToken xxxxxxxxxxxxxxxx' \\`);
  lines.push(`    --form 'url="https://example.com/main.aeb907d6.js"' \\`);
  lines.push(`    --form 'sourceMap=@"/path-to-your-sourcemap-file/main.aeb907d6.js.map"'`);
  lines.push(``);
  lines.push(`# remove all files in the upload configuration`);
  lines.push(`curl --location --request PUT \\`);
  lines.push(`    '${apiClearUrl}' \\`);
  lines.push(`    --header 'authorization: apiToken xxxxxxxxxxxxxxxx'`);
  const uploadAPISnippet = lines.join('\n');

  return (
    <Dialog
      title={
        (form.get('id') as Field<string>).value
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
                value={(form.get('description') as Field<string>).value}
                onChange={e => onChange(['description'], e.target.value)}
              />
            </FormGroup>
          </Col>
        </Row>

        {(form.get('id') as Field<string>).value && (
          <>
            <SectionHeading withoutTopSpacing>
              {t('in-websites:websiteDashboard.tabs.configuration.fileUploadConfigurationDialogHeadingOpenAPI')}
            </SectionHeading>
            <SectionHelp>
              <Trans
                i18nKey="in-websites:websiteDashboard.tabs.configuration.fileUploadConfigurationDialogOpenAPIHelp"
                components={{
                  documentation: (
                    <Link href="https://ibm.biz/javascript-source-maps" externalWithIcon>
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
                  value={apiUploadUrl}
                  fieldName="sourceMapUploadFormUrl"
                />
              </Col>
              <Col xs={12}>
                <CopyableText
                  title={t('in-websites:websiteDashboard.tabs.configuration.clearUploadedFilesUrl')}
                  value={apiClearUrl}
                  fieldName="sourceMapUploadClearUrl"
                />
              </Col>
              <Col xs={12}>
                <div className={locals.snippetWrapper}>
                  <div className={locals.snippet}>
                    <Code
                      code={uploadAPISnippet}
                      lang="bash"
                      showLineNumbers={false}
                      softWrap
                      useDark
                      withoutCopyButton
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )}

        <SaveCancel
          form={form}
          onClickCancelButton={close}
          isCreate={isBlank((form.get('id') as Field<string>).value)}
        />
      </form>
    </Dialog>
  );
}

interface CopyableTextProps {
  title: string;
  value: string;
  fieldName: string;
}

function CopyableText({ title, value, fieldName }: CopyableTextProps) {
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
