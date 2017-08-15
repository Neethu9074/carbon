import { defaults } from 'lodash';
import React from 'react';

import GenericServiceExtractionConfiguration from 'in-views/configurationView/subview/ServiceExtraction/ServiceExtraction';
import commonHelpTexts from 'in-views/configurationView/subview/ServiceExtraction/configs/serviceExtractionHelpTexts';
import { generalServiceExtractionConfigViewPath } from 'in-stores/navigation/configuration';

export const ruleType = 'general';

export const pathname = generalServiceExtractionConfigViewPath;

export const helpTexts = defaults(
  {
    viewHelp: (
      <span>
        Configure how Instana uses attributes of underlying components to extract services. You can define multiple
        rules{' '}
        which will be executed in order, i.e. the first rule of which all match expression match, will be used to
        extract{' '}
        a service name. More specific rules like HTTP or MessageBrokers are evaluated first.
        TODO: link http and MB
      </span>
    ),
    matchesHelp:
      'Select here which attributes should be used to match and extract a service. At least one match ' +
        'expression is required.'
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
    key: {
      placeholder: 'key placeholder',
      testPlaceholder: '',
      initialValue: '',
      help: (
        <span>
          Key value match
        </span>
      )
    },
    value: {
      placeholder: 'value placeholder',
      testPlaceholder: '',
      initialValue: '',
      help: (
        <span>
          Key value match
        </span>
      )
    }
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
