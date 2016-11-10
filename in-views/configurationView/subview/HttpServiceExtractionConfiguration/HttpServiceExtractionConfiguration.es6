import React from 'react';

import {
  addNewRule,
  rules$,
  enable,
  disable,
  save
} from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/stores/rules';
import Rule from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/components/Rule';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import LifecycleObserver from 'in-components/LifecycleObserver';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  rules: rules$
}, function HttpServiceExtractionConfiguration({rules}) {
  return (
    <div>
      <LifecycleObserver onWillMount={enable}
                         onWillUnmount={disable}/>
      <SubViewHeader>
        HTTP Service Extraction Rules
      </SubViewHeader>

      <Button kind='primary'
              onClick={() => addNewRule()}>
        Add Rule
      </Button>

      <Button kind='primary'
              onClick={() => save()}>
        Save
      </Button>

      {rules.toArray().map(rule =>
        <Rule key={rule.get('id')}
              rule={rule} />
      )}
    </div>
  );
});
