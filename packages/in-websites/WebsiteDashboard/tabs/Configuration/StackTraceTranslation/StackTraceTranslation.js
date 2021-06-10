/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, withState } from 'recompose';
import React, { Fragment } from 'react';

import { Button } from '@instana/components';

import FileDownloadConfigurationDialog from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/FileDownloadConfigurationDialog';
import { getSourceMapConfigurations, removeSourceMapConfiguration } from 'in-websites/api/websites';
import TemporaryMessage from 'in-components/TemporaryMessage/TemporaryMessage';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import LearnMoreCard from 'in-websites/LearnMoreCard/LearnMoreCard';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

import locals from './StackTraceTranslation.mless';

const columnDefinitions = [
  {
    id: 'configuration',
    label: t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationLabelConfiguration'),
    width: '4rem',
    widthInAbsoluteUnit: true,
    getValue: toLabel,
    getContent: toLabel
  }
];

const explanation = (
  <Fragment>{t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationExplanation')}</Fragment>
);

export default compose(withState('message', 'setMessage', null))(function StackTraceTranslationConfigurationPresenter({
  websiteId,
  setMessage,
  message
}) {
  const onFinished = message => {
    setMessage(message);
  };

  return (
    <Fragment>
      {message && <TemporaryMessage type={message.type} message={message.message} duration={5000} />}

      <LearnMoreCard
        title={t(
          'in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationTitleJavaScriptStackTraceTranslation'
        )}
        explanation={explanation}
        learnMoreHref="https://instana.com/docs/website_monitoring/faq/#javascript-stack-trace-translation"
        learnMoreLabel={t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationLearnMoreLabel')}
      />

      <List
        title={t(
          'in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationTitleJSStackTraceTranslationConfigurations'
        )}
        getHeader={defaultHeaderWithCount(
          t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationHeaderFileDownloadConfigurations')
        )}
        getEntityName={getEntityName}
        columnDefinitions={columnDefinitions}
        tableActions={{
          delete: {
            deleteEntity(entity) {
              return removeSourceMapConfiguration(websiteId, entity.id);
            }
          }
        }}
        initialOrderBy="configuration"
        loadEntities={() => getSourceMapConfigurations(websiteId)}
        pageSize={15}
        searchAttributes={[toLabel]}
        noDataMessage={t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationNoDataMessage')}
        rightHeader={
          <Button
            className={locals.button}
            kind="action"
            onClick={() => {
              addActiveDialog(<FileDownloadConfigurationDialog onFinished={onFinished} websiteId={websiteId} />);
            }}
            icon="lib_openclose_add_circle_outline"
          >
            {t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationButtonAddConfiguration')}
          </Button>
        }
        onRowClick={config => {
          addActiveDialog(
            <FileDownloadConfigurationDialog config={config} websiteId={websiteId} onFinished={onFinished} />
          );
        }}
      />
    </Fragment>
  );
});

function getEntityName(config) {
  return t('in-websites:websiteDashboard.tabs.configuration.stackTraceTranslationLabelFileDownloadConfiguration', {
    config: toLabel(config)
  });
}

function toLabel(config) {
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
