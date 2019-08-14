import {compose, withState} from 'recompose';
import React, {Fragment} from 'react';

import {
  addSourceMapConfiguration,
  updateSourceMapConfiguration,
  getSourceMapConfigurations,
  removeSourceMapConfiguration
} from 'in-websites/api/websites';
import FileDownloadConfigurationDialog from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/FileDownloadConfigurationDialog';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import TemporaryMessage from 'in-components/TemporaryMessage';
import List, {reload} from 'in-settings/components/List';
import { isNotBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';

import locals from './StackTraceTranslation.mless';

const columnDefinitions = [
  {
    id: 'configuration',
    label: 'Configuration',
    sortable: false,
    width: '4rem',
    widthInAbsoluteUnit: true,
    getContent: toLabel
  }
];

export default compose(
  withState('message', 'setMessage', null),
)(function StackTraceTranslationConfigurationPresenter({message, setMessage, websiteId}) {
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
        searchAttributes={['configuration']}
        rightHeader={(
          <Button
            className={locals.button}
            kind="action"
            onClick={() => {
              setActiveDialog(<FileDownloadConfigurationDialog onSubmit={config => onSubmit(config, setMessage, websiteId)} />);
            }}
            icon="lib_openclose_add_circle_outline"
          >
            Add Configuration
          </Button>
        )}
        onRowClick={config => {
          setActiveDialog(<FileDownloadConfigurationDialog config={config} onSubmit={config => onSubmit(config, setMessage, websiteId)} />);
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
        label = `${label}/${rule.pathEquality}`;
      } else {
        label = `${label}/${rule.pathPrefix || ''}*${rule.pathSuffix || ''}`;
      }

      return label;
    })
    .join(' or ');
}

function onSubmit(config, setMessage, websiteId) {
  close();
  setMessage({ message: 'Saving configuration…', type: 'success' });
  let response$;
  let successMessage;
  if (config.id) {
    response$ = updateSourceMapConfiguration(websiteId, config);
    successMessage = 'Configuration updated.';
  } else {
    response$ = addSourceMapConfiguration(websiteId, config);
    successMessage = 'New configuration saved.';
  }
  response$.once(() => {
    setMessage({ message: successMessage, type: 'success' });
    reload();
  }, error => {
    setMessage({ message: `Failed to save configuration: ${error.message}`, type: 'error' });
    // TODO
    // setActiveDialog(<FileDownloadConfigurationDialog config={config} onSubmit={config => onSubmit(config, setMessage, websiteId)} />);
  });
}
