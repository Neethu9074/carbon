/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, createListForm } from 'formalistic';
import React, { Fragment } from 'react';
import { get } from 'lodash';

import { Button } from '@instana/components';

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
import { t } from 'in-i18n';

import locals from './SyntheticCallConfigView.mless';

export default function SyntheticCallConfigDialog() {
  return (
    <BasicForm
      title={t('in-applications:titleConfigureSyntheticEndpoints')}
      saveButtonLabel={t('in-applications:buttonSave')}
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
                  stepTitle: t('in-applications:forms.customSyntheticRule.stepTitleConfigureSyntheticEndpoints'),
                  content: (
                    <Fragment>
                      <DescriptionText>
                        {t('in-applications:forms.customSyntheticRule.descriptionConfigureSyntheticEndpoints')}
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
                          {t('in-applications:buttonAddSyntheticEndpointRule')}
                        </Button>
                      </div>

                      <div className={locals.ruleWrapper}>
                        <Rule
                          key="default"
                          name="Auto-Detected Health/Ping Checks"
                          content={
                            <RuleDescription
                              description={t('in-applications:forms.customSyntheticRule.descriptionEndpointsRule')}
                            />
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
    return <div className={locals.message}>{t('in-applications:forms.customSyntheticRule.messageNoRule')}</div>;
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
