import { defaultsDeep } from 'lodash';
import React from 'react';

import GenericServiceExtractionConfiguration
  from 'in-views/configurationView/subview/GenericServiceExtractionConfiguration/GenericServiceExtractionConfiguration';
import commonHelpTexts from 'in-views/configurationView/subview/serviceExtractionHelpTexts';

const helpTexts = defaultsDeep(
  {
    viewHelp: 'Configure how Instana uses message broker span attributes to extract services. You can define multiple rules ' +
      'which will be executed in order, i.e. the first rule of which all match expression match, will be used to extract ' +
      'a service name. Message brokers are HornetQ, JMS, Kafka and RabbitMQ.',
    matchesHelp: 'Select here which message broker attributes should be used to match and extract a service. At least one match ' +
      'expression is required. The message broker destination / queue / topic can be matched ' +
      "to extract services. When all of the configured match expressions match a message broker span's attributes, a " +
      'service will be extracted.'
  },
  commonHelpTexts
);

const matchSpecificationOptionsTree = [
  {
    label: 'Destination / Queue / Topic',
    value: 'destination'
  }
];

const matchSpecificationOptions = {
  destination: {
    titleName: 'Destination / Queue / Topic',
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

export default function MessageBrokerServiceExtractionConfiguration() {
  return (
    <GenericServiceExtractionConfiguration
      ruleType="messagebroker"
      title="Message Broker Service Extraction Rules"
      helpTexts={helpTexts}
      matchSpecificationOptionsTree={matchSpecificationOptionsTree}
      matchSpecificationOptions={matchSpecificationOptions}
    />
  );
}
