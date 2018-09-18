import { fromJS } from 'immutable';
import React from 'react';

import RuleForm, { ruleFormDefinition } from 'in-views/configurationView/subview/Rule/RuleForm';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import { rulesPath } from 'in-stores/navigation/paths/settingPaths';
import { getRule, saveRule, createRule } from 'in-api/rules';
import Notification from 'in-components/form/Notification';
import { goToPath } from 'in-stores/navigation';
import entityForm from 'in-hoc/entityForm';
import Button from 'in-components/Button';

export default function Rule(props) {
  const entityId = props.match.params.ruleId;

  return (
    <Form
      title="Custom Rule"
      entityId={entityId}
      createDefaultEntity={createRule}
      createForm={createForm}
      getEntityFromApi={getRule}
      openEntities={() => goToPath(rulesPath)}
      saveEntity={save}
    />
  );
}

const Form = entityForm(function IntegrationForm(props) {
  const { entity, form, message, error, loading } = props;
  return (
    <div>
      <SubViewHeader>Configure Rule: {entity.get('name')}</SubViewHeader>

      <Section>
        <Button kind="success" type="submit" disabled={!form.hierarchyValid && form.touched}>
          Save
        </Button>

        {message ? (
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        ) : null}
      </Section>

      <RuleForm {...props} />
    </div>
  );
});

function save(rule, form) {
  const metricFormatter = form.get('formatter').value;

  let conditionValue = Number(form.get('conditionValue').value);
  if (metricFormatter === 'PERCENTAGE') {
    // for simplified use, we use a scale of [0, 100.0], but we only store the value in range [0, 1.0]
    conditionValue /= 100.0;
  }

  return saveRule(
    fromJS(
      createRule(
        rule ? rule.get('id') : null,
        form.get('name').value,
        form.get('entityType').value,
        form.get('metricName').value,
        form.get('rollup') ? Number(form.get('rollup').value) : '',
        form.get('window') ? Number(form.get('window').value) : '',
        form.get('aggregation') ? form.get('aggregation').value : null,
        form.get('conditionOperator').value,
        conditionValue
      )
    )
  );
}

function createForm(rule) {
  return ruleFormDefinition(rule);
}
