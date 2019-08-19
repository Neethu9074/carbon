import { compose, withState } from 'recompose';
import React, { Fragment } from 'react';

import { getSourceMapConfigurations, removeSourceMapConfiguration } from 'in-websites/api/websites';
import FileDownloadConfigurationDialog from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/FileDownloadConfigurationDialog';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import TemporaryMessage from 'in-components/TemporaryMessage';
import { isNotBlank } from 'in-services/util/string';
import List from 'in-settings/components/List';
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

      <List
        title="File Download Configurations"
        getHeader={getHeader}
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
        rightHeader={
          <Button
            className={locals.button}
            kind="action"
            onClick={() => {
              setActiveDialog(<FileDownloadConfigurationDialog onFinished={onFinished} websiteId={websiteId} />);
            }}
            icon="lib_openclose_add_circle_outline"
          >
            Add Configuration
          </Button>
        }
        onRowClick={config => {
          setActiveDialog(
            <FileDownloadConfigurationDialog config={config} websiteId={websiteId} onFinished={onFinished} />
          );
        }}
      />
    </Fragment>
  );
});

function getHeader(totalHits) {
  return totalHits ? `File Download Configurations (${totalHits})` : 'File Download Configurations';
}

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
