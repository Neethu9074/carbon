import React from 'react';

import {addNewRule, rules$} from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/stores/rules';
import Rule from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/components/Rule';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  rules: rules$
}, function HttpServiceExtractionConfiguration({rules}) {
  return (
    <div>
      <SubViewHeader>
        HTTP Service Extraction Rules
      </SubViewHeader>

      <Button kind='primary'
              onClick={() => addNewRule()}>
        Add Rule
      </Button>

      {rules.toArray().map(rule =>
        <Rule key={rule.get('id')}
              rule={rule} />
      )}
    </div>
  );
});
