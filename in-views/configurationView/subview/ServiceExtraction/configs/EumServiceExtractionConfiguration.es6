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
  appName: {
    titleName: 'App Name',
    placeholder: '(.*)',
    testPlaceholder: '/',
    initialValue: '(/bar($|/))',
    help: (
      <span>
        help text here.
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
    <GenericServiceExtractionConfiguration ruleType="eum" title="EUM Service Extraction Rules" helpTexts={helpTexts} />
  );
}
