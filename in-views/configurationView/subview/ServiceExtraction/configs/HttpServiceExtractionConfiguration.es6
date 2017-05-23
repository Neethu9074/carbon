import { defaultsDeep } from 'lodash';
import React from 'react';

import GenericServiceExtractionConfiguration
  from 'in-views/configurationView/subview/ServiceExtraction/ServiceExtraction';
import commonHelpTexts from 'in-views/configurationView/subview/ServiceExtraction/configs/serviceExtractionHelpTexts';
import { httpServiceExtractionConfigViewPath } from 'in-stores/navigation/configuration';

export const ruleType = 'webapp';

export const pathname = httpServiceExtractionConfigViewPath;

export const helpTexts = defaultsDeep(
  {
    viewHelp: 'Configure how Instana uses HTTP request attributes to extract services. You can define multiple rules ' +
      'which will be executed in order, i.e. the first rule of which all match expression match, will be used to extract ' +
      'a service name.',

    matchesHelp: 'Select here which HTTP request attributes should be used to match and extract a service. At least one match ' +
      'expression is required. HTTP request attributes such as HTTP host headers and request paths can be matched ' +
      "to extract services. When all of the configured match expressions match an HTTP request's attributes, a " +
      'service will be extracted.'
  },
  commonHelpTexts
);

export const matchSpecificationOptions = {
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
  },

  method: {
    titleName: 'Request Method',
    placeholder: 'GET',
    testPlaceholder: 'GET',
    initialValue: '(.*)',
    help: (
      <span>
        Define a regular expression to match HTTP request methods. Capture groups from matches of this regular {' '}
        expression are available in the service name field via the prefix <code>method</code>, e.g. {' '}
        <code>{'{method-1}'}</code> references the first capture group.
      </span>
    )
  },

  params: {
    titleName: 'Query Parameters',
    placeholder: '',
    testPlaceholder: 'user=123&foo=bar',
    initialValue: '',
    help: (
      <span>
        Define a regular expression to match HTTP query parameters. Capture groups from matches of this regular {' '}
        expression are available in the service name field via the prefix <code>params</code>, e.g. {' '}
        <code>{'{params-1}'}</code> references the first capture group. Query parameters are captured in the form{' '}
        <code>key=value&otherKey=otherValue</code>
      </span>
    )
  }
};

export const matchSpecificationOptionsTree = [
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
    label: 'Query Parameters',
    value: 'params'
  },
  {
    label: 'Request Method',
    value: 'method'
  },
  {
    label: 'Request Path',
    value: 'path'
  }
];

export default function HttpServiceExtractionConfiguration() {
  return (
    <GenericServiceExtractionConfiguration
      ruleType="webapp"
      link="httpServiceExtraction"
      title="HTTP Service Extraction Rules"
      helpTexts={helpTexts}
    />
  );
}
