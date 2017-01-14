import React from 'react';

import GenericServiceExtractionConfiguration
  from 'in-views/configurationView/subview/GenericServiceExtractionConfiguration/GenericServiceExtractionConfiguration';

export default function EjbServiceExtractionConfiguration() {
  return (
    <GenericServiceExtractionConfiguration ruleType='ejb'
                                           title='EJB Service Extraction Rules' />
  );
}
