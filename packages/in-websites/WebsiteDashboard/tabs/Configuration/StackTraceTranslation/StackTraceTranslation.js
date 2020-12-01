import { compose, withState } from 'recompose';
import React, { Fragment } from 'react';

import FileDownloadConfigurationDialog from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/FileDownloadConfigurationDialog';
import { getSourceMapConfigurations, removeSourceMapConfiguration } from 'in-websites/api/websites';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import LearnMoreCard from 'in-new-components/Card/LearnMoreCard';
import TemporaryMessage from 'in-components/TemporaryMessage';
import { isNotBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';

import locals from './StackTraceTranslation.mless';

const columnDefinitions = [
  {
    id: 'configuration',
    label: 'Configuration',
    width: '4rem',
    widthInAbsoluteUnit: true,
    getValue: toLabel,
    getContent: toLabel
  }
];

const explanation = (
  <Fragment>
    To make JavaScript stack traces more readable, e.g. to show references to non minified files and lines, Instana
    needs to access JavaScript and source map files. Adding a configuration here allows Instana
    {`'`}s server to authenticate and download these files in order to provide more insights into JavaScript errors.
  </Fragment>
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
        title="JavaScript Stack Trace Translation"
        explanation={explanation}
        learnMoreHref="https://instana.com/docs/website_monitoring/faq/#javascript-stack-trace-translation"
        learnMoreLabel="Learn more about JavaScript Stack Trace Translation"
      />

      <List
        title="JS Stack Trace Translation Configurations"
        getHeader={defaultHeaderWithCount('File Download Configurations')}
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
        noDataMessage="No file download configurations available."
        rightHeader={
          <Button
            className={locals.button}
            kind="action"
            onClick={() => {
              addActiveDialog(<FileDownloadConfigurationDialog onFinished={onFinished} websiteId={websiteId} />);
            }}
            icon="lib_openclose_add_circle_outline"
          >
            Add Configuration
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
  return `File Download Configuration ${toLabel(config)}`;
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
    .join(' or ');
}
