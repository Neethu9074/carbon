import React from 'react';

import {
  ruleForms$,
  addNewRule
} from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/stores/ruleForms';
import Rule from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/components/Rule';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  ruleForms: ruleForms$
}, function HttpServiceExtractionConfiguration({ruleForms}) {
  return (
    <div>
      <SubViewHeader>
        HTTP Service Extraction Rules
      </SubViewHeader>

      <Button kind='primary'
              onClick={() => addNewRule()}>
        Add Rule
      </Button>
      {' '}
      <Button kind='primary'
              disabled={!ruleForms.valid}>
        Save
      </Button>

      <p>
        SAVING AND LOADING RULES IS CURRENTLY IN REFACTORING AND THEREFORE NOT WORKING1
      </p>

      {ruleForms.map((ruleForm, i) =>
        <Rule key={ruleForm.getItem('id').value}
              ruleForm={ruleForm}
              path={[i]}/>
      )}
    </div>
  );
});
