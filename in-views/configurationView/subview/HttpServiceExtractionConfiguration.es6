import React from 'react';

import GenericServiceExtractionConfiguration
  from 'in-views/configurationView/subview/GenericServiceExtractionConfiguration/GenericServiceExtractionConfiguration';

export default function HttpServiceExtractionConfiguration() {
  return (
    <GenericServiceExtractionConfiguration ruleType='webapp'
                                           title='HTTP Service Extraction Rules' />
  );
}
