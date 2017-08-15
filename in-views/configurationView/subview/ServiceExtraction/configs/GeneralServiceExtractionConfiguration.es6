import { defaults } from 'lodash';
import React from 'react';

import GenericServiceExtractionConfiguration from 'in-views/configurationView/subview/ServiceExtraction/ServiceExtraction';
import { generalServiceExtractionConfigViewPath } from 'in-stores/navigation/configuration';
import commonHelpTexts from 'in-views/configurationView/subview/ServiceExtraction/configs/serviceExtractionHelpTexts';

export const ruleType = 'general';

export const pathname = generalServiceExtractionConfigViewPath;

export const helpTexts = defaults(
  {
    viewHelp:
      'Configure how Instana uses message broker span attributes to extract services. You can define multiple rules ' +
        'which will be executed in order, i.e. the first rule of which all match expression match, will be used to extract ' +
        'a service name. Message brokers are HornetQ, JMS, Kafka and RabbitMQ.',
    matchesHelp:
      'Select here which message broker attributes should be used to match and extract a service. At least one match ' +
        'expression is required. The message broker destination / queue / topic can be matched ' +
        "to extract services. When all of the configured match expressions match a message broker span's attributes, a " +
        'service will be extracted.'
  },
  commonHelpTexts
);

export const matchSpecificationOptionsTree = [
  {
    label: 'Host Tag',
    value: 'tag'
  }
];

export const matchSpecificationOptions = {
  tag: {
    titleName: 'Host Tag',
    placeholder: '',
    testPlaceholder: '',
    initialValue: '',
    help: (
      <span>
        Define a regular expression to match destinations / queues. Capture groups from matches of this regular{' '}
        expression are available in the service name field via the prefix <code>destination</code>, e.g. {' '}
        <code>{'{destination-1}'}</code> references the first capture group.
      </span>
    )
  }
};

export default function GeneralServiceExtractionConfiguration() {
  return (
    <GenericServiceExtractionConfiguration
      ruleType="general"
      title="General Service Extraction Rules"
      link="generalServiceExtraction"
      helpTexts={helpTexts}
    />
  );
}
