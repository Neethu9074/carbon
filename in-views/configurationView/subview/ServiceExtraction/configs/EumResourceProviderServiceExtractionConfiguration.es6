import { defaults } from 'lodash';
import React from 'react';

import GenericServiceExtractionConfiguration from 'in-views/configurationView/subview/ServiceExtraction/ServiceExtraction';
import commonHelpTexts from 'in-views/configurationView/subview/ServiceExtraction/configs/serviceExtractionHelpTexts';
import { eumResourceProviderExtractionConfigViewPath } from 'in-stores/navigation/configuration';

export const ruleType = 'page.res';

export const pathname = eumResourceProviderExtractionConfigViewPath;

export const supportsEndpoints = false;

export const helpTexts = defaults(
  {
    viewHelp:
      'Configure how Instana uses attributes from resource requests, e.g. JS and CSS file requests, to extract resource domain entities.. You can define multiple rules which will be executed in order.',

    matchesHelp: "Select the resource provider's host name the rule should be applied on.",

    serviceNameHelp: (
      <span>
        Give this entity a name. This entity name will be used throughout Instana. You can reference capture groups
        {' '}
        {' '}
        extracted from the match expressions to dynamically build an entity name.
      </span>
    ),

    serviceEndpointNameHelp: null
  },
  commonHelpTexts
);

export const matchSpecificationOptions = {
  host: {
    titleName: 'Host',
    placeholder: '(.*)',
    testPlaceholder: 'example.com',
    initialValue: '(.*)',
    help: (
      <span>
        Define a regular expression to match the resource providers host, e.g. <code>example.com</code>. Capture {' '}
        groups from matches of this regular expression are available in the service name field via the {' '}
        prefix <code>host</code>, e.g. <code>{'{host-1}'}</code> references the first capture group.
      </span>
    )
  }
};

export const matchSpecificationOptionsTree = [
  {
    label: 'Host',
    value: 'host'
  }
];

export default function EUMServiceExtractionConfiguration() {
  return (
    <GenericServiceExtractionConfiguration
      ruleType={ruleType}
      title="EUM Resource Provider Rules"
      link="eumResourceProviderServiceExtraction"
      helpTexts={helpTexts}
    />
  );
}
