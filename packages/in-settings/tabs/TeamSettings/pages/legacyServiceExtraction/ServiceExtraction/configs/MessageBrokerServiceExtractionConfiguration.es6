import { defaults } from 'lodash';
import React from 'react';

import {
  matchSpecificationOptions as generalMatchSpecificationOptions,
  matchSpecificationOptionsTree as generalMatchSpecificationOptionsTree
} from 'in-settings/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/GeneralServiceExtractionConfiguration';
import { messageBrokerServiceExtractionPath, generalServiceExtractionView$ } from 'in-settings/navigation/paths';
import GenericServiceExtractionConfiguration from 'in-settings/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/ServiceExtraction';
import commonHelpTexts from 'in-settings/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/serviceExtractionHelpTexts';
import Link from 'in-components/Link';

export const ruleType = 'messagebroker';

export const pathname = messageBrokerServiceExtractionPath;

export const helpTexts = defaults(
  {
    viewHelp: (
      <span>
        Configure how Instana uses message broker span attributes to extract services. You can define multiple rules{' '}
        which will be executed in order, i.e. the first rule of which all match expression match, will be used to
        extract a service name. Message brokers are HornetQ, JMS, Kafka and RabbitMQ. Should no rule match, the defaults
        from the <Link href$={generalServiceExtractionView$}>General config</Link> apply. Should these not match as
        well, a default service name using the destination is used.
        <br />
        View our{' '}
        <Link href="https://docs.instana.io/products/application_service_management/#configuration" external>
          documentation
        </Link>{' '}
        for further information.
      </span>
    ),

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
    label: 'Destination / Queue / Topic',
    value: 'destination'
  }
].concat(generalMatchSpecificationOptionsTree);

export const matchSpecificationOptions = defaults(
  {
    destination: {
      titleName: 'Destination / Queue / Topic',
      placeholder: '',
      testPlaceholder: '',
      initialValue: '',
      help: (
        <span>
          Define a regular expression to match destinations / queues. Capture groups from matches of this regular{' '}
          expression are available in the service name field via the prefix <code>destination</code>, e.g.{' '}
          <code>{'{destination-1}'}</code> references the first capture group.
        </span>
      )
    }
  },
  generalMatchSpecificationOptions
);

export default function MessageBrokerServiceExtractionConfiguration() {
  return (
    <GenericServiceExtractionConfiguration
      ruleType="messagebroker"
      title="Message Broker Service Extraction Rules"
      link="messageBrokerServiceExtraction"
      helpTexts={helpTexts}
    />
  );
}
