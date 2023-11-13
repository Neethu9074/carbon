/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
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
  mobileAppId: string;
  message?: MessageType | null;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onChange: (path: Array<string>, value: string) => void;
}

export default function FileUploadConfigurationDialogPresenter(props: Props) {
  const { form, message, onSubmit, onChange, mobileAppId } = props;

  const apiBaseUrl = `${baseUrl}/api/mobile-app-monitoring/config/${encodeURIComponent(mobileAppId)}/sourcemap-upload`;
  const apiUploadUrl = `${apiBaseUrl}/${(form.get('id') as Field<string>).value}/form`;
  const apiCommitUrl = `${apiBaseUrl}/${(form.get('id') as Field<string>).value}/commit`;
  const apiClearUrl = `${apiBaseUrl}/${(form.get('id') as Field<string>).value}/clear`;

  const lines = [`# examples`];
  lines.push(``);
  lines.push(`# Upload iOS app symbolication file (Compress dSYM folder into one tgz file.)`);
  lines.push(
    `# If the compressed file is larger than 10MB, split the file into multiple blob and upload each part with blob index.`
  );
  lines.push(`curl --location --request PUT \\`);
  lines.push(`    '${apiUploadUrl}' \\`);
  lines.push(`    --header 'authorization: apiToken xxxxxxxxxxxxxxxx' \\`);
  lines.push(`    --form 'fileId="unique_id_of_symbol_file"' \\`);
  lines.push(`    --form 'fileType="dSYM"' \\`);
  lines.push(`    --form 'blobIndex=1' \\`);
  lines.push(`    --form 'sourceMap=@"/path-to-your-symbol-file/example.symbol.file.tgz.1"'`);
  lines.push(``);
  lines.push(`# After the tgz file or all blobs are uploaded, call the commit API to finish the uploading.`);
  lines.push(`curl --location --request PUT \\`);
  lines.push(`    '${apiCommitUrl}' \\`);
  lines.push(`    --header 'authorization: apiToken xxxxxxxxxxxxxxxx' \\`);
  lines.push(`    --form 'fileId="unique_id_of_symbol_file"' \\`);
  lines.push(`    --form 'fileType="dSYM"' \\`);
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
          ? t('in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.fileUploadConfigurationDialogTitleEdit')
          : t('in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.fileUploadConfigurationDialogTitleNew')
      }
      onClose={close}
      className={locals.dialog}
    >
      <form onSubmit={onSubmit}>
        {message && <TemporaryMessage type={message.type} message={message.message} duration={5000} />}

        <SectionHeading withoutTopSpacing>
          {t(
            'in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.fileUploadConfigurationDialogHeadingDescription'
          )}
        </SectionHeading>
        <SectionHelp>
          <p>
            {t(
              'in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.fileUploadConfigurationDialogDescriptionHelp'
            )}
          </p>
        </SectionHelp>
        <Row>
          <Col md={12}>
            <FormGroup>
              <Label htmlFor={`config-headers-desc-key`}>
                {t(
                  'in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.fileUploadConfigurationDialogLabelDescription'
                )}
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
              {t(
                'in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.fileUploadConfigurationDialogHeadingOpenAPI'
              )}
            </SectionHeading>
            <SectionHelp>
              <Trans
                i18nKey="in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.fileUploadConfigurationDialogOpenAPIHelp"
                components={{
                  documentation: (
                    <Link href="https://ibm.biz/ios-symbol-file-upload" external>
                      null
                    </Link>
                  )
                }}
              />
            </SectionHelp>
            <Row>
              <Col xs={12}>
                <CopyableText
                  title={t('in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.fileUploadUrl')}
                  value={apiUploadUrl}
                  fieldName="sourceMapUploadFormUrl"
                />
              </Col>
              <Col xs={12}>
                <CopyableText
                  title={t('in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.fileCommitUrl')}
                  value={apiCommitUrl}
                  fieldName="sourceMapUploadCommitUrl"
                />
              </Col>
              <Col xs={12}>
                <CopyableText
                  title={t('in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.clearUploadedFilesUrl')}
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
