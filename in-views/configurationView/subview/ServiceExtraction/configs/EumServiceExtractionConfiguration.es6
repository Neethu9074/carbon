import { defaultsDeep } from 'lodash';
import React from 'react';

import GenericServiceExtractionConfiguration
  from 'in-views/configurationView/subview/ServiceExtraction/ServiceExtraction';
import commonHelpTexts from 'in-views/configurationView/subview/ServiceExtraction/configs/serviceExtractionHelpTexts';
import { eumServiceExtractionConfigViewPath } from 'in-stores/navigation/configuration';

export const pathname = eumServiceExtractionConfigViewPath;

export const helpTexts = defaultsDeep(
  {
    viewHelp: 'Configure how Instana uses EUM attributes to extract services and endpoints. You can define multiple rules which will be executed in order.',

    matchesHelp: 'Select the App name the rule should be applied on. You can review and set it in End User Monitoring.',

    serviceNameHelp: (
      <span>
        Give this service a name. This service name will be used throughout Instana. You can reference capture groups extracted from the match expressions to dynamically build a service name. Additionally, EUM meta tags can be used.
      </span>
    )
  },
  commonHelpTexts
);

export const matchSpecificationOptions = {
  appName: {
    titleName: 'App Name',
    placeholder: '(.*)',
    testPlaceholder: '/',
    initialValue: '(/bar($|/))',
    help: (
      <span>
        Define a regular expression to match the App name. Capture groups from matches of this regular expression are available in the service name field via the prefix path, e.g.
        {' '}
        <code>{'{EUM app - 1}'}</code>
        {' '}
        references the first capture group.
      </span>
    )
  }
};

export const matchSpecificationOptionsTree = [
  {
    label: 'App Name',
    value: 'appName'
  }
];

export default function EUMServiceExtractionConfiguration() {
  return (
    <GenericServiceExtractionConfiguration
      ruleType="browser"
      title="EUM Service Extraction Rules"
      helpTexts={helpTexts}
    />
  );
}
