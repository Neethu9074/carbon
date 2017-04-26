import React from 'react';

import {
  ruleForms$,
  addNewRule,
  enable,
  disable,
  saveRules
} from 'in-views/configurationView/subview/GenericServiceExtractionConfiguration/stores/ruleForms';
import {
  notification$
} from 'in-views/configurationView/subview/GenericServiceExtractionConfiguration/stores/notification';
import { openEditor } from 'in-views/configurationView/subview/GenericServiceExtractionConfiguration/stores/editAsJson';
import Rule from 'in-views/configurationView/subview/GenericServiceExtractionConfiguration/components/Rule';
import StoreAwareTemporaryPresenter from 'in-components/StoreAwareTemporaryPresenter';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import LifecycleObserver from 'in-components/LifecycleObserver';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    ruleForms: ruleForms$
  },
  function GenericServiceExtractionConfiguration({
    ruleForms,
    ruleType,
    title,
    helpTexts,
    matchSpecificationOptionsTree,
    matchSpecificationOptions
  }) {
    return (
      <SubViewWrapper>
        <LifecycleObserver onWillMount={() => enable(ruleType)} onWillUnmount={disable} />

        <SubViewHeader>
          {title}
        </SubViewHeader>

        <Section>
          {ruleForms != null
            ? <span>
                <Button kind="info" onClick={() => addNewRule()}>
                  Add Rule
                </Button>
                {' '}
                <Button kind="info" onClick={openEditor}>
                  Edit as JSON
                </Button>
                {' '}
                <Button kind="success" disabled={!ruleForms.hierarchyValid} onClick={() => saveRules(ruleForms)}>
                  Save
                </Button>
              </span>
            : null}

          <StoreAwareTemporaryPresenter config$={notification$} />

          <p>
            {helpTexts.viewHelp}
          </p>
        </Section>

        {ruleForms &&
          ruleForms.map(i => i).map((ruleForm, i) => ( //map doesn't take an index in formalistic. Maybe make a PR?
            <Rule
              key={ruleForm.get('id').value}
              ruleForm={ruleForm}
              path={[i]}
              helpTexts={helpTexts}
              matchSpecificationOptionsTree={matchSpecificationOptionsTree}
              matchSpecificationOptions={matchSpecificationOptions}
            />
          ))}
      </SubViewWrapper>
    );
  }
);
