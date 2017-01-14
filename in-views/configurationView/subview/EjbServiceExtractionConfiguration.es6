import {defaultsDeep} from 'lodash';
import React from 'react';

import GenericServiceExtractionConfiguration
  from 'in-views/configurationView/subview/GenericServiceExtractionConfiguration/GenericServiceExtractionConfiguration';
import commonHelpTexts from 'in-views/configurationView/subview/serviceExtractionHelpTexts';

const helpTexts = defaultsDeep(
  {
    viewHelp: 'Configure how Instana uses EJB attributes to extract services. You can define multiple rules ' +
    'which will be executed in order, i.e. the first rule of which all match expression match, will be used to extract ' +
    'a service name.',
    matchesHelp: 'TODO'
  },
  commonHelpTexts
);

export default function EjbServiceExtractionConfiguration() {
  return (
    <GenericServiceExtractionConfiguration ruleType='ejb'
                                           title='EJB Service Extraction Rules'
                                           helpTexts={helpTexts} />
  );
}
