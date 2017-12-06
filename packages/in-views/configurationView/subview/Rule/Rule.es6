import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { fromJS } from 'immutable';
import React from 'react';

import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import RuleForm from 'in-views/configurationView/subview/Rule/RuleForm';
import { getRule, saveRule, createRule } from 'in-services/api/rules';
import Section from 'in-views/configurationView/components/Section';
import { openRules } from 'in-stores/navigation/configuration';
import Notification from 'in-components/form/Notification';
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
      openEntities={openRules}
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
  return saveRule(
    fromJS(
      createRule(
        rule ? rule.get('id') : null,
        form.get('name').value,
        form.get('entityType').value,
        form.get('metricName').value,
        1000, // 1s
        Number(form.get('window').value),
        form.get('aggregation').value,
        form.get('conditionOperator').value,
        Number(form.get('conditionValue').value)
      )
    )
  );
}

function createForm(rule) {
  return createMapForm()
    .put(
      'name',
      createField({
        value: rule ? rule.get('name') : '',
        validator: notBlankValidator
      })
    )
    .put(
      'entityType',
      createField({
        value: rule ? rule.get('entityType') : undefined,
        validator: notBlankValidator
      })
    )
    .put(
      'metricName',
      createField({
        value: rule ? rule.get('metricName') : '',
        validator: metricName => {
          return metricName && metricName != '-1' && metricName.length > 0
            ? null
            : [
                {
                  severity: 'error',
                  message: `Please enter a valid metric.`
                }
              ];
        }
      })
    )
    .put(
      'window',
      createField({
        value: String(rule.get('window')),
        validator: notBlankValidator
      })
    )
    .put(
      'aggregation',
      createField({
        value: rule.get('aggregation'),
        validator: notBlankValidator
      })
    )
    .put(
      'conditionOperator',
      createField({
        value: rule.get('conditionOperator'),
        validator: notBlankValidator
      })
    )
    .put(
      'conditionValue',
      createField({
        value: String(rule.get('conditionValue')),
        validator(value) {
          const n = Number(value);
          if (isNaN(n)) {
            return [
              {
                severity: 'error',
                message: 'Please enter a number (use . as a decimal separator).'
              }
            ];
          }
          return null;
        }
      })
    );
}
