import {defaultsDeep} from 'lodash';
import React from 'react';

import GenericServiceExtractionConfiguration
  from 'in-views/configurationView/subview/GenericServiceExtractionConfiguration/GenericServiceExtractionConfiguration';
import commonHelpTexts from 'in-views/configurationView/subview/serviceExtractionHelpTexts';

const helpTexts = defaultsDeep(
  {
    viewHelp: 'Configure how Instana uses Elasticsearch attributes to extract services. You can define multiple rules ' +
    'which will be executed in order, i.e. the first rule of which all match expression match, will be used to extract ' +
    'a service name.',
    matchesHelp: 'Select here which Elasticsearch query\'s attributes should be used to match and extract a service. ' +
    'At least one match expression is required. Query attributes such as index and cluster name can be matched ' +
    'to extract services. When all of the configured match expressions match a query\'s attributes, a ' +
    'service will be extracted.'
  },
  commonHelpTexts
);

const matchSpecificationOptionsTree = [
  {
    label: 'Index',
    value: 'index'
  },
  {
    label: 'Cluster',
    value: 'cluster'
  }
];

const matchSpecificationOptions = {
  index: {
    titleName: 'Index',
    placeholder: '',
    testPlaceholder: '',
    initialValue: '',
    help: (
      <span>
        Define a regular expression to indices. Capture groups from matches of this regular{' '}
        expression are available in the service name field via the prefix <code>index</code>, e.g. {' '}
        <code>{'{index-1}'}</code> references the first capture group.
      </span>
    )
  },

  cluster: {
    titleName: 'Cluster',
    placeholder: '',
    testPlaceholder: '',
    initialValue: '',
    help: (
      <span>
        Define a regular expression to clusters. Capture groups from matches of this regular {' '}
        expression are available in the service name field via the prefix <code>cluster</code>, e.g. {' '}
        <code>{'{cluster-1}'}</code> references the first capture group.
      </span>
    )
  }
};

export default function ElasticsearchServiceExtractionConfiguration() {
  return (
    <GenericServiceExtractionConfiguration ruleType='elasticsearchindex'
                                           title='Elasticsearch Service Extraction Rules'
                                           helpTexts={helpTexts}
                                           matchSpecificationOptionsTree={matchSpecificationOptionsTree}
                                           matchSpecificationOptions={matchSpecificationOptions} />
  );
}
