import {defaultsDeep} from 'lodash';
import React from 'react';

import GenericServiceExtractionConfiguration
  from 'in-views/configurationView/subview/GenericServiceExtractionConfiguration/GenericServiceExtractionConfiguration';
import commonHelpTexts from 'in-views/configurationView/subview/serviceExtractionHelpTexts';

const helpTexts = defaultsDeep(
  {
    viewHelp: 'Configure how Instana uses HTTP request attributes to extract services. You can define multiple rules ' +
    'which will be executed in order, i.e. the first rule of which all match expression match, will be used to extract ' +
    'a service name.',

    matchesHelp: 'Select here which HTTP request attributes should be used to match and extract a service. At least one match ' +
    'expression is required. HTTP request attributes such as HTTP host headers and request paths can be matched ' +
    'to extract services. When all of the configured match expressions match an HTTP request\'s attributes, a ' +
    'service will be extracted.'
  },
  commonHelpTexts
);

const matchSpecificationOptions = {
  path: {
    titleName: 'Request Path',
    placeholder: '(.*)',
    testPlaceholder: '/',
    initialValue: '(/shop($|/))',
    help: (
      <span>
        Define a regular expression to match requests paths. Capture groups from matches of this regular{' '}
        expression are available in the service name field via the prefix <code>path</code>, e.g. {' '}
        <code>{'{path-1}'}</code> references the first capture group.
      </span>
    )
  },

  host: {
    titleName: 'Host Header',
    placeholder: '(.*)',
    testPlaceholder: 'example.com',
    initialValue: '(.*)',
    help: (
      <span>
        Define a regular expression to match HTTP host headers. Capture groups from matches of this regular {' '}
        expression are available in the service name field via the prefix <code>host</code>, e.g. {' '}
        <code>{'{host-1}'}</code> references the first capture group.
      </span>
    )
  }
};

const matchSpecificationOptionsTree = [
  {
    label: 'Headers',
    children: [
      {
        label: 'Host',
        value: 'host'
      }
    ]
  },
  {
    label: 'Request Path',
    value: 'path'
  }
];

export default function HttpServiceExtractionConfiguration() {
  return (
    <GenericServiceExtractionConfiguration ruleType='webapp'
                                           title='HTTP Service Extraction Rules'
                                           helpTexts={helpTexts}
                                           matchSpecificationOptions={matchSpecificationOptions}
                                           matchSpecificationOptionsTree={matchSpecificationOptionsTree} />
  );
}
