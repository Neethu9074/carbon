import React from 'react';

import Rule from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/components/Rule';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Button from 'in-components/Button';

export default function HttpServiceExtractionConfiguration() {
  return (
    <div>
      <SubViewHeader>
        HTTP Service Extraction Rules
      </SubViewHeader>

      <Button kind='primary'>
        Add Rule
      </Button>

      <Rule />
    </div>
  );
}
