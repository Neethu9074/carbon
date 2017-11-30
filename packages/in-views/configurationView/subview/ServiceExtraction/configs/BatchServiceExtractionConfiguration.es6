import { defaults } from 'lodash';
import React from 'react';

import GenericServiceExtractionConfiguration from 'in-views/configurationView/subview/ServiceExtraction/ServiceExtraction';
import commonHelpTexts from 'in-views/configurationView/subview/ServiceExtraction/configs/serviceExtractionHelpTexts';
import {
  matchSpecificationOptions as generalMatchSpecificationOptions,
  matchSpecificationOptionsTree as generalMatchSpecificationOptionsTree
} from 'in-views/configurationView/subview/ServiceExtraction/configs/GeneralServiceExtractionConfiguration';
import { generalServiceExtractionConfigurationViewLink$ } from 'in-stores/navigation/configuration';
import { batchServiceExtractionConfigViewPath } from 'in-stores/navigation/configuration';
import Link from 'in-components/Link';

export const ruleType = 'batch';

export const pathname = batchServiceExtractionConfigViewPath;

export const helpTexts = defaults(
  {
    viewHelp: (
      <span>
        Configure how Instana uses batch job attributes to extract services. You can define multiple rules which will be
        executed in order, i.e. the first rule of which all match expression match, will be used to extract a service
        name. Should no rule match, the defaults from the{' '}
        <Link href$={generalServiceExtractionConfigurationViewLink$}>General config</Link> apply. Should these not match
        as well, a default service name using the batch job is used.
        <br />
        View our{' '}
        <Link href="https://docs.instana.io/products/application_service_management/#configuration" external>
          documentation
        </Link>{' '}
        for further information.
      </span>
    ),
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
].concat(generalMatchSpecificationOptionsTree);

export const matchSpecificationOptions = defaults(
  {
    job: {
      titleName: 'Job',
      placeholder: '',
      testPlaceholder: '',
      initialValue: '',
      help: (
        <span>
          Define a regular expression to job name. Capture groups from matches of this regular expression are available
          in the service name field via the prefix <code>job</code>, e.g. <code>{'{job-1}'}</code> references the first
          capture group.
        </span>
      )
    }
  },
  generalMatchSpecificationOptions
);

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
