/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment, useState } from 'react';
import { isNumber } from 'lodash';

import { combineLatest, just } from '@instana/observables';
import { Button, Card, Stack } from '@instana/components';

import {
  getSourceMapDownloadConfigurations,
  removeSourceMapDownloadConfiguration,
  getSourceMapUploadConfigurations,
  removeSourceMapUploadConfiguration
} from 'in-websites/api/websites';
import FileDownloadConfigurationDialog from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/FileDownloadConfigurationDialog';
import FileUploadConfigurationDialog from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/FileUploadConfigurationDialog';
import WideRow from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/WideRow';
import HelpParagraph from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/HelpParagraph';
import TemporaryMessage from 'in-components/TemporaryMessage/TemporaryMessage';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { formatDateTime } from 'in-services/formatters/date';
import { isNotBlank } from 'in-services/util/string';
import ButtonGroup from 'in-components/ButtonGroup';
import List from 'in-settings/components/List';
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
  const [uploadConfigsCount, setUploadConfigsCount] = useState(0);
  const [downloadConfigsCount, setDownloadConfigsCount] = useState(0);
  const [allConfigs, setAllConfigs] = useState(null);

  const onFinished = message => {
    setAllConfigs(null);
    setMessage(message);
  };

  const onLoadEntities = () => {
    if (allConfigs) {
      return allConfigs;
    }
    const allData = combineLatest([
      getSourceMapUploadConfigurations(websiteId),
      getSourceMapDownloadConfigurations(websiteId)
    ])
      .map(([uploadConfigs, downloadConfigs]) => [
        uploadConfigs.map(it => {
          it.category = fileConfigTypes.upload;
          return it;
        }),
        downloadConfigs.map(it => {
          it.category = fileConfigTypes.download;
          return it;
        })
      ])
      .flatMap(([uploadConfigs, downloadConfigs]) => {
        setUploadConfigsCount(uploadConfigs?.length);
        setDownloadConfigsCount(downloadConfigs?.length);
        return just([...uploadConfigs, ...downloadConfigs]);
      });
    setAllConfigs(allData);
    return allData;
  };

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
            <Trans i18nKey="in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationExplanation" />
          </HelpParagraph>

          <Stack direction="horizontal">
            <Button
              href="https://www.ibm.com/docs/en/obi/current?topic=websites-website-monitoring-faq#what-is-javascript-stack-trace-translation"
              kind="primaryv2"
              target="_blank"
            >
              {t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationLearnMoreLabel')}
            </Button>
          </Stack>
        </Card>
      </WideRow>

      <WideRow>
        <Card>
          <List
            getCustomHeader={() => (
              <ButtonGroup
                segmented
                buttonPropsList={[
                  {
                    text: configHeaderWithCount(
                      t(
                        'in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationHeaderFileDownloadConfigurations'
                      ),
                      downloadConfigsCount || 0
                    ),
                    key: fileConfigTypes.download,
                    onClick() {
                      setFileConfigType(fileConfigTypes.download);
                    }
                  },
                  {
                    text: configHeaderWithCount(
                      t(
                        'in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationHeaderFileUploadConfigurations'
                      ),
                      uploadConfigsCount || 0
                    ),
                    key: fileConfigTypes.upload,
                    onClick() {
                      setFileConfigType(fileConfigTypes.upload);
                    }
                  }
                ]}
                activeKey={fileConfigType}
              />
            )}
            getEntityName={fileConfigType === fileConfigTypes.download ? getDownloadEntityName : getUploadEntityName}
            columnDefinitions={
              fileConfigType === fileConfigTypes.download ? columnDefinitionsDownload : columnDefinitionsUpload
            }
            tableActions={{
              delete: {
                deleteEntity(entity) {
                  return fileConfigType === fileConfigTypes.download
                    ? removeSourceMapDownloadConfiguration(websiteId, entity.id)
                    : removeSourceMapUploadConfiguration(websiteId, entity.id);
                }
              }
            }}
            initialOrderBy="configuration"
            loadEntities={onLoadEntities}
            extraFilters={[it => it.category === fileConfigType]}
            pageSize={15}
            searchAttributes={[fileConfigType === fileConfigTypes.download ? toDownloadLabel : toUploadLabel]}
            noDataMessage={t(
              fileConfigType === fileConfigTypes.download
                ? 'in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationNoDataMessage'
                : 'in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationNoUploadDataMessage'
            )}
            rightHeader={
              <Button
                className={locals.button}
                kind="action"
                onClick={() => {
                  addActiveDialog(
                    fileConfigType === fileConfigTypes.download ? (
                      <FileDownloadConfigurationDialog onFinished={onFinished} websiteId={websiteId} />
                    ) : (
                      <FileUploadConfigurationDialog onFinished={onFinished} websiteId={websiteId} />
                    )
                  );
                }}
                icon="lib_openclose_add_circle_outline"
              >
                {t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationButtonAddConfiguration')}
              </Button>
            }
            onRowClick={config => {
              addActiveDialog(
                fileConfigType === fileConfigTypes.download ? (
                  <FileDownloadConfigurationDialog config={config} websiteId={websiteId} onFinished={onFinished} />
                ) : (
                  <FileUploadConfigurationDialog config={config} websiteId={websiteId} onFinished={onFinished} />
                )
              );
            }}
          />
        </Card>
      </WideRow>
    </Fragment>
  );
}

function configHeaderWithCount(title, totalHits) {
  if (totalHits === 0) {
    return title;
  }
  return `${title} (${totalHits})`;
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
  return isNumber(config.modifiedAt) ? formatDateTime(config.modifiedAt * 1000) : '';
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
        label = `${label}${rule.pathPrefix.startsWith('/') ? '' : '/'}${rule.pathPrefix || ''}*${rule.pathSuffix ||
          ''}`;
      }

      return label;
    })
    .join(t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationLabelOr'));
}
