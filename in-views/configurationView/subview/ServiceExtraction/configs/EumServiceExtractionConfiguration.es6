import { defaultsDeep } from 'lodash';
import React from 'react';

import GenericServiceExtractionConfiguration
  from 'in-views/configurationView/subview/ServiceExtraction/ServiceExtraction';
import commonHelpTexts from 'in-views/configurationView/subview/ServiceExtraction/configs/serviceExtractionHelpTexts';
import { eumServiceExtractionConfigViewPath } from 'in-stores/navigation/configuration';

export const pathname = eumServiceExtractionConfigViewPath;

export const helpTexts = defaultsDeep(
  {
    viewHelp: 'EUM view help.',

    matchesHelp: 'eum matches help.'
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
        text.
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
        text.
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
    label: 'Request Path',
    value: 'path'
  }
];

export default function EUMServiceExtractionConfiguration() {
  return (
    <GenericServiceExtractionConfiguration ruleType="eum" title="EUM Service Extraction Rules" helpTexts={helpTexts} />
  );
}
