import { createMapForm, createField, notBlankValidator } from 'formalistic';
import React from 'react';

import CustomDynamicRuleForm from 'in-settings/tabs/TeamSettings/pages/legacyKnowledgeManagement/CustomDynamicRules/CustomDynamicRuleForm';
import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import { teamSettingsKnowledgeManagementCustomDynamicRules } from 'in-settings/navigation/paths';
import { getDynamicRule, saveDynamicRule, createDynamicRule } from 'in-api/dynamicRules';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { queryValidator } from 'in-stores/search/validations';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import entityForm from 'in-hoc/entityForm';

export default function DynamicRule(props) {
  const entityId = props.match.params.id;

  return (
    <Form
      title="Dynamic Rule"
      entityId={entityId}
      createDefaultEntity={createDynamicRule}
      createForm={createForm}
      getEntityFromApi={getDynamicRule}
      openEntities={() => goToPath(teamSettingsKnowledgeManagementCustomDynamicRules)}
      saveEntity={save}
    />
  );
}

const Form = entityForm(
  class Form extends React.Component {
    static displayName = 'Rule';

    render() {
      const { entity, form, entityId, onChange, message, error, loading, setForm, isCreate } = this.props;

      return (
        <SettingsDetailPage>
          {DashboardNavigationRoute}

          <SubViewHeader>
            {isCreate ? 'Create Dynamic Rule' : `Configure Dynamic Rule: ${entity.get('name')}`}
          </SubViewHeader>

          {message ? (
            <Section>
              <Notification failure={error} loading={loading}>
                {message}
              </Notification>
            </Section>
          ) : null}

          <CustomDynamicRuleForm
            isNewRuleDialog={entityId ? false : true}
            form={form}
            onChange={onChange}
            excludeEntity={id => this.excludeEntity(id, form, setForm)}
            includeEntity={id => this.includeEntity(id, form, setForm)}
          />

          {/* The form is rather long so we repeat the message down here just so it is visible when saving fails. */}
          {message ? (
            <Section>
              <Notification failure={error} loading={loading}>
                {message}
              </Notification>
            </Section>
          ) : null}

          {form ? (
            <SaveCancel
              form={form}
              message={message}
              loading={loading}
              isCreate={isCreate}
              listPath={teamSettingsKnowledgeManagementCustomDynamicRules}
            />
          ) : null}
        </SettingsDetailPage>
      );
    }

    includeEntity = (id, form, setForm) => {
      let updatedForm = form;
      updatedForm = updatedForm.updateIn(['excludedSnapshotIds'], field =>
        field.setValue(field.value.filter(value => value !== id)).setTouched(true)
      );

      setForm(this.enrichForm(updatedForm));
    };

    excludeEntity = (id, form, setForm) => {
      let updatedForm = form;
      updatedForm = updatedForm.updateIn(['excludedSnapshotIds'], field =>
        field.setValue(field.value.push(id)).setTouched(true)
      );

      setForm(this.enrichForm(updatedForm));
    };

    enrichForm = form => {
      const matchingEntities = form.get('matchingEntities').value;
      const excludedSnapshotIds = form.get('excludedSnapshotIds').value;
      if (matchingEntities && matchingEntities.snapshots) {
        const selectedEntities = matchingEntities.snapshots.filter(
          snapshot => excludedSnapshotIds.indexOf(snapshot.get('id')) < 0
        );
        form = form.updateIn(['selectedEntities'], field => field.setValue(selectedEntities).setTouched(true));
      }

      return form;
    };
  }
);

function createForm(rule) {
  return createMapForm()
    .put(
      'entityType',
      createField({
        value: rule ? rule.getIn(['match', 'entityType']) : undefined,
        validator: notBlankValidator
      })
    )
    .put(
      'metricName',
      createField({
        value: rule ? rule.getIn(['match', 'metricName']) : '',
        validator: metricName => {
          return metricName && metricName != '-1' && metricName.length > 0
            ? null
            : [
                {
                  severity: 'error',
                  message: `Please enter a valid Metric.`
                }
              ];
        }
      })
    )
    .put(
      'query',
      createField({
        value: rule.getIn(['match', 'query']),
        validator: queryValidator
      })
    )
    .put(
      'violationDirection',
      createField({
        value: rule.getIn(['rule', 'violationDirection'], '').toLowerCase()
      })
    )
    .put(
      'sensitivity',
      createField({
        value: rule.getIn(['rule', 'sensitivity'])
      })
    )
    .put(
      'severity',
      createField({
        value: rule.getIn(['event', 'severity'])
      })
    )
    .put(
      'triggering',
      createField({
        value: rule.getIn(['event', 'triggering'])
      })
    )
    .put(
      'text',
      createField({
        value: rule.getIn(['event', 'text']),
        validator: notBlankValidator
      })
    )
    .put(
      'description',
      createField({
        value: rule.getIn(['event', 'description'])
      })
    )
    .put(
      'enabled',
      createField({
        value: rule.get('enabled')
      })
    )
    .put(
      'excludedSnapshotIds',
      createField({
        value: rule.getIn(['match', 'excludedSnapshotIds'])
      })
    )
    .put(
      'matchingEntities',
      createField({
        value: null
      })
    )
    .put(
      'selectedEntities',
      createField({
        value: [],
        validator: entities => {
          if (entities.length > 10) {
            return [
              {
                severity: 'error',
                message: `The number of Entities is limited to 10.`
              }
            ];
          }
        }
      })
    )
    .put(
      'timeOpened',
      createField({
        value: Date.now()
      })
    );
}

function save(rule, form) {
  const ruleTest = createDynamicRule(
    rule ? rule.get('id') : null,
    form.get('text').value,
    form.get('enabled').value,
    form.get('entityType').value,
    form.get('metricName').value,
    1000 * 60 * 60, // rollup,
    form.get('query').value,
    Date.now(), // queryEvaluationTimestamp
    'anomaly', // ruleType
    form.get('sensitivity').value,
    form.get('violationDirection').value,
    form.get('triggering').value,
    form.get('severity').value,
    form.get('text').value,
    form.get('description').value,
    1000 * 60 * 60, // expirationTime
    form.get('excludedSnapshotIds').value.toJS()
  );

  return saveDynamicRule(ruleTest);
}
