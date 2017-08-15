import { defaults } from 'lodash';
import React from 'react';

import GenericServiceExtractionConfiguration from 'in-views/configurationView/subview/ServiceExtraction/ServiceExtraction';
import commonHelpTexts from 'in-views/configurationView/subview/ServiceExtraction/configs/serviceExtractionHelpTexts';
import { batchServiceExtractionConfigViewPath } from 'in-stores/navigation/configuration';

export const ruleType = 'batch';

export const pathname = batchServiceExtractionConfigViewPath;

export const helpTexts = defaults(
  {
    viewHelp:
      'Configure how Instana uses batch job attributes to extract services. You can define multiple rules ' +
        'which will be executed in order, i.e. the first rule of which all match expression match, will be used to extract ' +
        'a service name.',
    matchesHelp:
      'Select here which batch job attributes should be used to match and extract a service. At least one match ' +
        'expression is required. The batch job attribute can be matched to extract services. ' +
        "When the configured match expression matches a batch job's attribute, a service will be extracted."
  },
  commonHelpTexts
);

export const matchSpecificationOptionsTree = [
  {
    label: 'Job',
    value: 'job'
  }
];

export const matchSpecificationOptions = {
  module: {
    titleName: 'Job',
    placeholder: '',
    testPlaceholder: '',
    initialValue: '',
    help: (
      <span>
        Define a regular expression to job name. Capture groups from matches of this regular{' '}
        expression are available in the service name field via the prefix <code>job</code>, e.g. {' '}
        <code>{'{job-1}'}</code> references the first capture group.
      </span>
    )
  }
};

export default function EjbServiceExtractionConfiguration() {
  return (
    <GenericServiceExtractionConfiguration
      ruleType="batch"
      link="batchServiceExtraction"
      title="Batch Service Extraction Rules"
      helpTexts={helpTexts}
    />
  );
}
