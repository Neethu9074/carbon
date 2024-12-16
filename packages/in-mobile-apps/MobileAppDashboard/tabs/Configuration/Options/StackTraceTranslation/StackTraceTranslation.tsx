/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Card, Stack, Button } from '@instana/components';

import FileUploadConfigurationDialog from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/StackTraceTranslation/FileUploadConfigurationDialog';
import { MessageType } from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/StackTraceTranslation/FileUploadConfigurationDialogPresenter';
import { getSourceMapUploadConfigurations, removeSourceMapUploadConfiguration } from 'in-mobile-apps/api/mobileApps';
import HelpParagraph from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/HelpParagraph';
import List, { defaultHeaderWithCount, ColumnDefinition } from 'in-settings/components/List';
import TemporaryMessage from 'in-components/TemporaryMessage/TemporaryMessage';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { formatDateTime } from 'in-services/formatters/date';
import { SourceMapUploadConfig } from 'in-types';
import { seconds } from 'in-services/time';
import { t, Trans } from 'in-i18n';

import locals from './StackTraceTranslation.mless';

const columnDefinitionsUpload: Array<ColumnDefinition<SourceMapUploadConfig>> = [
  {
    id: 'configuration',
    label: t('in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.stackTraceTranslationLabelConfiguration'),
    getValue: toUploadLabel,
    getContent: toUploadLabel
  },
  {
    id: 'fileCount',
    label: t('in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.stackTraceTranslationLabelFiles'),
    width: '8rem',
    widthInAbsoluteUnit: true,
    getValue: toUploadFileCountValue,
    getContent: toUploadFileCount
  },
  {
    id: 'totalSize',
    label: t('in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.stackTraceTranslationLabelTotalSize'),
    width: '8rem',
    widthInAbsoluteUnit: true,
    getValue: toUploadTotalSizeValue,
    getContent: toUploadTotalSize
  },
  {
    id: 'lastModified',
    label: t('in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.stackTraceTranslationLabelLastModified'),
    width: '14rem',
    widthInAbsoluteUnit: true,
    getValue: toUploadLastModified,
    getContent: toUploadLastModified
  }
];

export default function StackTraceTranslationConfigurationPresenter({ mobileAppId }: { mobileAppId: string }) {
  const [message, setMessage] = useState<MessageType | null>(null);

  const onFinished = (message: MessageType) => {
    setMessage(message);
  };

  return (
    <>
      {message && <TemporaryMessage type={message.type} message={message.message} duration={5000} />}

      <Stack direction="vertical" gap="large">
        <Card
          title={t(
            'in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.stackTraceTranslationTitleJavaScriptStackTraceTranslation'
          )}
        >
          <HelpParagraph>
            <Trans
              i18nKey={
                'in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.stackTraceTranslationExplanationWithUploadFeature'
              }
            />
          </HelpParagraph>

          <Stack direction="horizontal">
            <Button href="https://ibm.biz/-stack-trace-translation" kind="primaryv2" target="_blank">
              {t('in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.stackTraceTranslationLearnMoreLabel')}
            </Button>
          </Stack>
        </Card>
        <Card>
          <List
            title={t(
              'in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.stackTraceTranslationTitleJSStackTraceTranslationConfigurations'
            )}
            getHeader={defaultHeaderWithCount(
              t(
                'in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.stackTraceTranslationHeaderFileUploadConfigurations'
              )
            )}
            getEntityName={getUploadEntityName}
            columnDefinitions={columnDefinitionsUpload}
            tableActions={{
              delete: {
                deleteEntity(entity) {
                  return removeSourceMapUploadConfiguration(mobileAppId, entity.id);
                }
              }
            }}
            initialOrderBy="configuration"
            loadEntities={() => getSourceMapUploadConfigurations(mobileAppId)}
            pageSize={15}
            searchAttributes={[toUploadLabel]}
            noDataMessage={t(
              'in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.stackTraceTranslationNoUploadDataMessage'
            )}
            rightHeader={
              <Button
                className={locals.button}
                kind="action"
                onClick={() => {
                  addActiveDialog(<FileUploadConfigurationDialog onFinished={onFinished} mobileAppId={mobileAppId} />);
                }}
                icon="lib_openclose_add_circle_outline"
              >
                {t(
                  'in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.stackTraceTranslationButtonAddConfiguration'
                )}
              </Button>
            }
            onRowClick={config => {
              addActiveDialog(
                <FileUploadConfigurationDialog config={config} mobileAppId={mobileAppId} onFinished={onFinished} />
              );
            }}
          />
        </Card>
      </Stack>
    </>
  );
}

function getUploadEntityName(config: SourceMapUploadConfig) {
  return t(
    'in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.stackTraceTranslationLabelFileUploadConfiguration',
    {
      config: toUploadLabel(config)
    }
  );
}

export function toUploadLabel(config: SourceMapUploadConfig): string {
  return config.description ?? '';
}

export function toUploadFileCountValue(config: SourceMapUploadConfig) {
  return config.metadata?.length || 0;
}

export function toUploadFileCount(config: SourceMapUploadConfig) {
  return config.metadata?.length || '-';
}

export function toUploadLastModified(config: SourceMapUploadConfig) {
  return formatDateTime(seconds.toMillis(config.modifiedAt ?? config.createdAt ?? 0));
}

export function toUploadTotalSizeValue(config: SourceMapUploadConfig) {
  if (!config.metadata?.length) {
    return 0;
  }
  return config.metadata.reduce((prev, curr) => prev + (curr.size ?? 0), 0);
}

export function toUploadTotalSize(config: SourceMapUploadConfig) {
  const v = toUploadTotalSizeValue(config);
  if (!v) {
    return '-';
  }
  return bytesTwoDecimalPlaces(v);
}
