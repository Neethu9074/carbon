/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment, useState } from 'react';

import { combineLatest, just } from '@instana/observables';
import { Card, Stack, Button } from '@instana/components';
import { ButtonGroup } from '@instana/components';

import {
  getSourceMapDownloadConfigurations,
  removeSourceMapDownloadConfiguration,
  getSourceMapUploadConfigurations,
  removeSourceMapUploadConfiguration
} from 'in-websites/api/websites';
import FileDownloadConfigurationDialogPresenter from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/FileDownloadConfigurationDialogPresenter';
import FileUploadConfigurationDialog from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/FileUploadConfigurationDialog';
import WideRow from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/WideRow';
import HelpParagraph from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/HelpParagraph';
import TemporaryMessage from 'in-components/TemporaryMessage/TemporaryMessage';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { formatDateTime } from 'in-services/formatters/date';
import { isNotBlank } from 'in-services/util/string';
import { seconds } from 'in-services/time';
import { t, Trans } from 'in-i18n';

import locals from './StackTraceTranslation.mless';

const columnDefinitionsDownload = [
  {
    id: 'configuration',
    label: t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationLabelConfiguration'),
    width: '4rem',
    widthInAbsoluteUnit: true,
    getValue: toDownloadLabel,
    getContent: toDownloadLabel
  }
];

const columnDefinitionsUpload = [
  {
    id: 'configuration',
    label: t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationLabelConfiguration'),
    getValue: toUploadLabel,
    getContent: toUploadLabel
  },
  {
    id: 'fileCount',
    label: t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationLabelFiles'),
    width: '8rem',
    widthInAbsoluteUnit: true,
    getValue: toUploadFileCountValue,
    getContent: toUploadFileCount
  },
  {
    id: 'totalSize',
    label: t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationLabelTotalSize'),
    width: '8rem',
    widthInAbsoluteUnit: true,
    getValue: toUploadTotalSizeValue,
    getContent: toUploadTotalSize
  },
  {
    id: 'lastModified',
    label: t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationLabelLastModified'),
    width: '14rem',
    widthInAbsoluteUnit: true,
    getValue: toUploadLastModified,
    getContent: toUploadLastModified
  }
];

const fileConfigTypes = {
  upload: 'upload',
  download: 'download'
};

export default function StackTraceTranslationConfigurationPresenter({ websiteId }) {
  const [message, setMessage] = useState();
  const [fileConfigType, setFileConfigType] = useState(fileConfigTypes.download);
  const [allConfigs, setAllConfigs] = useState(null);

  const onFinished = message => {
    setAllConfigs(null);
    setMessage(message);
  };

  const onLoadEntities = () => {
    if (allConfigs) {
      return just(fileConfigTypes.download === fileConfigType ? allConfigs.downloadConfigs : allConfigs.uploadConfigs);
    }
    return combineLatest([
      getSourceMapUploadConfigurations(websiteId),
      getSourceMapDownloadConfigurations(websiteId)
    ]).map(([uploadConfigs, downloadConfigs]) => {
      setAllConfigs({ uploadConfigs: uploadConfigs, downloadConfigs: downloadConfigs });
      return fileConfigTypes.download === fileConfigType ? downloadConfigs : uploadConfigs;
    });
  };

  const headerWithCount = (cfgType, totalHitsBeforeFilter, totalHitsAfterFilter) => {
    const title =
      cfgType === fileConfigTypes.download
        ? t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationHeaderFileDownloadConfigurations')
        : t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationHeaderFileUploadConfigurations');

    if (fileConfigType === cfgType) {
      return defaultHeaderWithCount(title)(totalHitsBeforeFilter, totalHitsAfterFilter);
    }
    const totalHits =
      cfgType === fileConfigTypes.download
        ? allConfigs?.downloadConfigs?.length ?? 0
        : allConfigs?.uploadConfigs?.length ?? 0;

    return totalHits === 0 ? title : `${title} (${totalHits})`;
  };

  const buttonGroup = (totalHitsBeforeFilter, totalHitsAfterFilter) => (
    <ButtonGroup
      id="button-group-web-ul-dl"
      segmented
      buttonPropsList={[
        {
          text: headerWithCount(fileConfigTypes.download, totalHitsBeforeFilter, totalHitsAfterFilter),
          key: fileConfigTypes.download,
          onClick() {
            setFileConfigType(fileConfigTypes.download);
          }
        },
        {
          text: headerWithCount(fileConfigTypes.upload, totalHitsBeforeFilter, totalHitsAfterFilter),
          key: fileConfigTypes.upload,
          onClick() {
            setFileConfigType(fileConfigTypes.upload);
          }
        }
      ]}
      activeKey={fileConfigType}
    />
  );

  return (
    <Fragment>
      {message && <TemporaryMessage type={message.type} message={message.message} duration={5000} />}

      <WideRow>
        <Card
          title={t(
            'in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationTitleJavaScriptStackTraceTranslation'
          )}
        >
          <HelpParagraph>
            <Trans
              i18nKey={
                'in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationExplanationWithUploadFeature'
              }
            />
          </HelpParagraph>

          <Stack direction="horizontal">
            <Button
              href="https://ibm.biz/-stack-trace-translation"
              kind="primaryv2"
              target="_blank"
              icon="lib_views_external_link"
            >
              {t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationLearnMoreLabel')}
            </Button>
          </Stack>
        </Card>
      </WideRow>

      <WideRow>
        <Card>
          {fileConfigType === fileConfigTypes.download && (
            <List
              title={t(
                'in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationTitleJSStackTraceTranslationConfigurations'
              )}
              getHeader={null}
              getCustomHeader={buttonGroup}
              getEntityName={getDownloadEntityName}
              columnDefinitions={columnDefinitionsDownload}
              tableActions={{
                delete: {
                  deleteEntity(entity) {
                    return removeSourceMapDownloadConfiguration(websiteId, entity.id);
                  }
                }
              }}
              initialOrderBy="configuration"
              loadEntities={onLoadEntities}
              pageSize={15}
              searchAttributes={[toDownloadLabel]}
              noDataMessage={t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationNoDataMessage')}
              rightHeader={
                <Button
                  className={locals.button}
                  kind="action"
                  onClick={() => {
                    addActiveDialog(
                      <FileDownloadConfigurationDialogPresenter onFinished={onFinished} websiteId={websiteId} />
                    );
                  }}
                  icon="lib_openclose_add_circle_outline"
                >
                  {t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationButtonAddConfiguration')}
                </Button>
              }
              onRowClick={config => {
                addActiveDialog(
                  <FileDownloadConfigurationDialogPresenter
                    config={config}
                    websiteId={websiteId}
                    onFinished={onFinished}
                  />
                );
              }}
            />
          )}
          {fileConfigType === fileConfigTypes.upload && (
            <List
              title={t(
                'in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationTitleJSStackTraceTranslationConfigurations'
              )}
              getCustomHeader={buttonGroup}
              getEntityName={getUploadEntityName}
              columnDefinitions={columnDefinitionsUpload}
              tableActions={{
                delete: {
                  deleteEntity(entity) {
                    return removeSourceMapUploadConfiguration(websiteId, entity.id);
                  }
                }
              }}
              initialOrderBy="configuration"
              loadEntities={onLoadEntities}
              pageSize={15}
              searchAttributes={[toUploadLabel]}
              noDataMessage={t(
                'in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationNoUploadDataMessage'
              )}
              rightHeader={
                <Button
                  className={locals.button}
                  kind="action"
                  onClick={() => {
                    addActiveDialog(<FileUploadConfigurationDialog onFinished={onFinished} websiteId={websiteId} />);
                  }}
                  icon="lib_openclose_add_circle_outline"
                >
                  {t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationButtonAddConfiguration')}
                </Button>
              }
              onRowClick={config => {
                addActiveDialog(
                  <FileUploadConfigurationDialog config={config} websiteId={websiteId} onFinished={onFinished} />
                );
              }}
            />
          )}
        </Card>
      </WideRow>
    </Fragment>
  );
}

function getDownloadEntityName(config) {
  return t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationLabelFileDownloadConfiguration', {
    config: toDownloadLabel(config)
  });
}

function getUploadEntityName(config) {
  return t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationLabelFileUploadConfiguration', {
    config: toUploadLabel(config)
  });
}

function toUploadLabel(config) {
  return config.description;
}

function toUploadFileCountValue(config) {
  return config.metadata?.length || 0;
}

function toUploadFileCount(config) {
  return config.metadata?.length || '-';
}

function toUploadLastModified(config) {
  return formatDateTime(seconds.toMillis(config.modifiedAt));
}

function toUploadTotalSizeValue(config) {
  if (!config.metadata?.length) {
    return 0;
  }
  return config.metadata.reduce((prev, curr) => prev + curr.size, 0);
}

function toUploadTotalSize(config) {
  const v = toUploadTotalSizeValue(config);
  if (!v) {
    return '-';
  }
  return bytesTwoDecimalPlaces(v);
}

function toDownloadLabel(config) {
  return config.matchingRules
    .map(rule => {
      let label = '';

      if (rule.allowTransmissionViaInsecureChannel) {
        label = 'http(s)://';
      } else {
        label = 'https://';
      }

      if (isNotBlank(rule.hostEquality)) {
        label = `${label}${rule.hostEquality}`;
      } else {
        label = `${label}${rule.hostPrefix || ''}*${rule.hostSuffix || ''}`;
      }
      if (isNotBlank(rule.pathEquality)) {
        label = `${label}${rule.pathEquality.startsWith('/') ? '' : '/'}${rule.pathEquality}`;
      } else {
        label = `${label}${rule.pathPrefix.startsWith('/') ? '' : '/'}${rule.pathPrefix || ''}*${
          rule.pathSuffix || ''
        }`;
      }

      return label;
    })
    .join(t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationLabelOr'));
}
