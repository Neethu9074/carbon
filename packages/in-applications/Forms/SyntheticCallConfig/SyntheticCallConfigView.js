/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField, createMapForm, createListForm } from 'formalistic';
import React, { Fragment } from 'react';
import { get } from 'lodash';

import CustomSyntheticRuleDialog, {
  getInitialForm as getConfigRuleForm
} from 'in-applications/Forms/SyntheticCallConfig/CustomSyntheticRuleDialog';
import MatchedSyntheticEndpoints from 'in-applications/Forms/SyntheticCallConfig/MatchedSyntheticEndpoints';
import { getSyntheticCallConfig, updateSyntheticCallConfig } from 'in-api/syntheticCallConfiguration';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
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
        const defaultRules = form.get('defaultRules').toJS();
        const customRules = form.get('customRules').toJS();

        return (
          <Fragment>
            <Steps
              steps={[
                {
                  stepTitle: 'Configure synthetic endpoints to ignore calls to them from service and application KPIs',
                  content: (
                    <Fragment>
                      <DescriptionText>
                        Calls to synthetic endpoints will continue to be captured, but will not contribute to service
                        and application KPIs. Our built-in rule will auto-detect and ignore your health checks, but
                        additional endpoints can be manually added with new rules
                      </DescriptionText>

                      <div className={locals.addRuleButtonWrapper}>
                        <Button
                          kind="action"
                          onClick={() =>
                            addActiveDialog(
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
                          expandableContent={
                            defaultRulesEnabled ? (
                              <ExpandableContent
                                matchSpecifications={defaultRules.map(rule => rule.matchSpecification)}
                              />
                            ) : null
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
                            expandableContent={
                              rule.enabled ? (
                                <ExpandableContent matchSpecifications={[rule.matchSpecification]} />
                              ) : null
                            }
                            enabled={rule.enabled}
                            onToggleEnable={enabled => {
                              updateForm(
                                form.updateIn(['customRules', index, 'enabled'], field =>
                                  field.setValue(enabled).setTouched(true)
                                )
                              );
                            }}
                            onEdit={() =>
                              addActiveDialog(
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

function ExpandableContent({ matchSpecifications }) {
  const tagFilters = matchSpecifications.map(matchSpecification =>
    matchSpecification.key && matchSpecification.key.toLowerCase().startsWith('call.http.header.')
      ? {
          key: 'call.http.header',
          operator: matchSpecification.operator,
          value: `${matchSpecification.key.substring('call.http.header.'.length)}=${matchSpecification.value}`
        }
      : {
          key: matchSpecification.key,
          operator: matchSpecification.operator,
          value: matchSpecification.value
        }
  );

  if (tagFilters.length === 0) {
    return <div className={locals.message}>No rules are specified.</div>;
  } else {
    return <MatchedSyntheticEndpoints tagFilters={tagFilters} />;
  }
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
      'defaultRules',
      get(config, 'defaultRules', []).reduce((form, rule) => form.push(getConfigRuleForm(rule)), createListForm({}))
    )
    .put(
      'customRules',
      get(config, 'customRules', []).reduce((form, rule) => form.push(getConfigRuleForm(rule)), createListForm({}))
    );
}
