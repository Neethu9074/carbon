import { createField, createMapForm, createListForm } from 'formalistic';
import { get } from 'lodash';
import React, { Fragment } from 'react';

import { getSyntheticCallConfig, updateSyntheticCallConfig } from 'in-api/syntheticCallConfiguration';
import CustomSyntheticRuleDialog, {
  getInitialForm as getConfigRuleForm
} from 'in-applications/Forms/SyntheticCallConfig/CustomSyntheticRuleDialog';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import DescriptionText from 'in-components/form/DescriptionText';
import { servicesList } from 'in-applications/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation';
import Steps from 'in-applications/Forms/components/Steps';
import Rule from 'in-applications/Forms/components/Rule';
import BasicForm from 'in-applications/Forms/BasicForm';
import Button from 'in-new-components/Button';

import locals from './SyntheticCallConfigView.mless';

export default function SyntheticCallConfigDialog() {
  return (
    <BasicForm
      title="Configure Synthetic Endpoints"
      saveButtonLabel="Save"
      onCancelHref$={getModifiedUrlStream(p => (p.pathname = servicesList))}
      getEntity={() =>
        getSyntheticCallConfig().map(result => {
          return result;
        })
      }
      updateEntity={config => updateSyntheticCallConfig(config)}
      getInitialForm={getInitialForm}
      renderFormContent={(config, form, setValue, updateForm) => {
        const defaultRulesEnabled = form.get('defaultRulesEnabled').value;
        const customRules = form.get('customRules').toJS();

        return (
          <Fragment>
            <Steps
              steps={[
                {
                  stepTitle:
                    'Configure what endpoints are ignored from the underlying calls to services. The order below does not matter',
                  content: (
                    <Fragment>
                      <DescriptionText>
                        Synthetic calls like Health Checks, and Load Tests, do not contribute to the KPI’s of your
                        application, and services, dashboards. Instana auto-detects these calls, and ignores them, to
                        give you a more accurate data reporting on authentic traffic to your site.
                      </DescriptionText>

                      <div className={locals.addRuleButtonWrapper}>
                        <Button
                          kind="action"
                          onClick={() =>
                            setActiveDialog(
                              <CustomSyntheticRuleDialog
                                onSave={newRule =>
                                  updateForm(
                                    form.updateIn(['customRules'], list =>
                                      list.push(getConfigRuleForm(newRule)).setTouched(true)
                                    )
                                  )
                                }
                                form={form}
                              />
                            )
                          }
                          icon="lib_openclose_add_circle_outline"
                        >
                          Add Synthetic Endpoint Rule
                        </Button>
                      </div>

                      <div className={locals.ruleWrapper}>
                        <Rule
                          key="default"
                          name="Auto-Detected Health/Ping Checks"
                          content={
                            <RuleDescription description="Calls to the endpoints matching this auto-generated rule do not contribute to your application, or service KPIs within Instana and are disregarded." />
                          }
                          enabled={defaultRulesEnabled}
                          isInstanaDefaultRule
                          onToggleEnable={enabled => {
                            updateForm(
                              form.updateIn(['defaultRulesEnabled'], field => field.setValue(enabled).setTouched(true))
                            );
                          }}
                        />

                        {customRules.map((rule, index) => (
                          <Rule
                            key={index}
                            name={rule.name}
                            content={<RuleDescription description={rule.description} />}
                            enabled={rule.enabled}
                            onToggleEnable={enabled => {
                              updateForm(
                                form.updateIn(['customRules', index, 'enabled'], field =>
                                  field.setValue(enabled).setTouched(true)
                                )
                              );
                            }}
                            onEdit={() =>
                              setActiveDialog(
                                <CustomSyntheticRuleDialog
                                  rule={rule}
                                  form={form}
                                  onSave={updatedRule =>
                                    updateForm(
                                      form.updateIn(['customRules'], list =>
                                        list.set(index, getConfigRuleForm(updatedRule).setTouched(true))
                                      )
                                    )
                                  }
                                  onRemove={() =>
                                    updateForm(form.updateIn(['customRules'], list => list.remove(index)))
                                  }
                                />
                              )
                            }
                          />
                        ))}
                      </div>
                    </Fragment>
                  )
                }
              ]}
            />
          </Fragment>
        );
      }}
    />
  );
}

function RuleDescription({ description }) {
  return <div className={locals.ruleDescription}>{description}</div>;
}

function getInitialForm(config) {
  return createMapForm()
    .put(
      'defaultRulesEnabled',
      createField({
        value: get(config, 'defaultRulesEnabled', true)
      })
    )
    .put(
      'customRules',
      get(config, 'customRules', []).reduce((form, rule) => form.push(getConfigRuleForm(rule)), createListForm({}))
    );
}
