import { defaultsDeep } from 'lodash';
import React from 'react';

import GenericServiceExtractionConfiguration from 'in-views/configurationView/subview/ServiceExtraction/ServiceExtraction';
import commonHelpTexts from 'in-views/configurationView/subview/serviceExtractionHelpTexts';
import {ejbServiceExtractionConfigViewPath} from 'in-stores/navigation/configuration';

export const pathname = ejbServiceExtractionConfigViewPath;

export const helpTexts = defaultsDeep(
  {
    viewHelp: 'Configure how Instana uses EJB attributes to extract services. You can define multiple rules ' +
      'which will be executed in order, i.e. the first rule of which all match expression match, will be used to extract ' +
      'a service name.',
    matchesHelp: 'Select here which EJB attributes should be used to match and extract a service. At least one match ' +
      'expression is required. EJB attributes such as Module and Bean name can be matched ' +
      "to extract services. When all of the configured match expressions match an EJB's attributes, a " +
      'service will be extracted.'
  },
  commonHelpTexts
);

export const matchSpecificationOptionsTree = [
  {
    label: 'Module',
    value: 'module'
  },
  {
    label: 'App',
    value: 'app'
  },
  {
    label: 'Bean',
    value: 'bean'
  }
];

export const matchSpecificationOptions = {
  module: {
    titleName: 'Module',
    placeholder: '',
    testPlaceholder: '',
    initialValue: '',
    help: (
      <span>
        Define a regular expression to modules. Capture groups from matches of this regular{' '}
        expression are available in the service name field via the prefix <code>module</code>, e.g. {' '}
        <code>{'{module-1}'}</code> references the first capture group.
      </span>
    )
  },

  app: {
    titleName: 'App',
    placeholder: '',
    testPlaceholder: '',
    initialValue: '',
    help: (
      <span>
        Define a regular expression to match application names. Capture groups from matches of this regular {' '}
        expression are available in the service name field via the prefix <code>app</code>, e.g. {' '}
        <code>{'{app-1}'}</code> references the first capture group.
      </span>
    )
  },

  bean: {
    titleName: 'Bean',
    placeholder: '',
    testPlaceholder: '',
    initialValue: '',
    help: (
      <span>
        Define a regular expression to match beans. Capture groups from matches of this regular {' '}
        expression are available in the service name field via the prefix <code>bean</code>, e.g. {' '}
        <code>{'{bean-1}'}</code> references the first capture group.
      </span>
    )
  }
};

export default function EjbServiceExtractionConfiguration() {
  return (
    <GenericServiceExtractionConfiguration
      ruleType="ejb"
      title="EJB Service Extraction Rules"
      helpTexts={helpTexts}
    />
  );
}
