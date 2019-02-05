import { fromJS } from 'immutable';
import React from 'react';

import { unmapConditionValue } from 'in-views/configurationView/tabs/TeamSettings/pages/knowledgeManagement/CustomRules/components/RuleDetails';
import RuleForm, {
  ruleFormDefinition
} from 'in-views/configurationView/tabs/TeamSettings/pages/knowledgeManagement/CustomRules/RuleForm';
import { teamSettingsKnowledgeManagementCustomRules } from 'in-views/configurationView/navigation/paths';
import SettingsDetailPage from 'in-views/configurationView/components/SettingsDetailPage';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import SaveCancel from 'in-views/configurationView/components/SaveCancel';
import Section from 'in-views/configurationView/components/Section';
import { getRule, saveRule, createRule } from 'in-api/rules';
import Notification from 'in-components/form/Notification';
import { goToPath } from 'in-stores/navigation';
import entityForm from 'in-hoc/entityForm';

export default function Rule(props) {
  const entityId = props.match.params.id;

  return (
    <Form
      title="Custom Rule"
      entityId={entityId}
      createDefaultEntity={createRule}
      createForm={createForm}
      getEntityFromApi={getRule}
      openEntities={() => goToPath(teamSettingsKnowledgeManagementCustomRules)}
      saveEntity={save}
    />
  );
}

const Form = entityForm(function IntegrationForm(props) {
  const { entity, form, message, error, loading, isCreate } = props;
  return (
    <SettingsDetailPage>
      <SubViewHeader>{isCreate ? 'Create A New Custom Rule' : `Configure Rule: ${entity.get('name')}`}</SubViewHeader>

      {message ? (
        <Section>
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        </Section>
      ) : null}

      <RuleForm {...props} />

      <SaveCancel
        form={form}
        message={message}
        loading={loading}
        isCreate={isCreate}
        listPath={teamSettingsKnowledgeManagementCustomRules}
      />
    </SettingsDetailPage>
  );
});

function save(rule, form) {
  const formatterType = form.get('formatter').value;

  let conditionValue = Number(form.get('conditionValue').value);
  conditionValue = unmapConditionValue(conditionValue, formatterType);

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
