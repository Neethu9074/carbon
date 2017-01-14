import React from 'react';

import {
  ruleForms$,
  addNewRule,
  enable,
  disable,
  saveRules
} from 'in-views/configurationView/subview/GenericServiceExtractionConfiguration/stores/ruleForms';
import {notification$} from 'in-views/configurationView/subview/GenericServiceExtractionConfiguration/stores/notification';
import {viewHelp} from 'in-views/configurationView/subview/GenericServiceExtractionConfiguration/components/helpTexts';
import {openEditor} from 'in-views/configurationView/subview/GenericServiceExtractionConfiguration/stores/editAsJson';
import Rule from 'in-views/configurationView/subview/GenericServiceExtractionConfiguration/components/Rule';
import StoreAwareTemporaryPresenter from 'in-components/StoreAwareTemporaryPresenter';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import LifecycleObserver from 'in-components/LifecycleObserver';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './GenericServiceExtractionConfiguration.less';

const block = 'in-config-generic-ex';

export default connectTo({
  ruleForms: ruleForms$
}, function GenericServiceExtractionConfiguration({ruleForms, ruleType, title}) {
  return (
    <div className={block}>
      <LifecycleObserver onWillMount={() => enable(ruleType)}
                         onWillUnmount={disable} />

      <SubViewHeader>
        {title}
      </SubViewHeader>

      <Section>
        {ruleForms != null ?
          <span>
            <Button kind='info'
                    onClick={() => addNewRule()}>
              Add Rule
            </Button>
            {' '}
            <Button kind='info'
                    onClick={openEditor}>
              Edit as JSON
            </Button>
            {' '}
            <Button kind='success'
                    disabled={!ruleForms.valid}
                    onClick={() => saveRules(ruleForms)}>
              Save
            </Button>
          </span>
        : null}

        <StoreAwareTemporaryPresenter config$={notification$} />

        <p>
          {viewHelp}
        </p>
      </Section>

      {ruleForms && ruleForms.map((ruleForm, i) =>
        <Rule key={ruleForm.getItem('id').value}
              ruleForm={ruleForm}
              path={[i]} />
      )}
    </div>
  );
});
