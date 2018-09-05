import { createField, createMapForm, createListForm } from 'formalistic';
import React, { Fragment } from 'react';
import { get } from 'lodash';

import {
  createNewEndpointConfig,
  updateEndpointConfig,
  addEndpointConfig,
  getEndpointConfig
} from 'in-api/endpointConfiguration';
import { serviceId as serviceIdMatrixParameter } from 'in-applications/navigation/matrix';
import EndpointExtractionRuleDialog from 'in-applications/Forms/CustomEndpointMapping/EndpointExtractionRuleDialog/EndpointExtractionRuleDialog';
import UnspecifiedExtractionRule from 'in-applications/Forms/CustomEndpointMapping/UnspecifiedExtractionRule';
import DragAndDropRuleList from 'in-applications/Forms/CustomEndpointMapping/DragAndDropRuleList';
import ExtractionRule from 'in-applications/Forms/CustomEndpointMapping/ExtractionRule';
import RemoveSection from 'in-applications/Forms/CustomEndpointMapping/Remove';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { serviceDashboard } from 'in-applications/navigation/paths';
import DescriptionText from 'in-components/form/DescriptionText';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation';
import Steps from 'in-applications/Forms/components/Steps';
import BasicForm from 'in-applications/Forms/BasicForm';
import Button from 'in-new-components/Button';

import locals from './CustomEndpointMappingDialog.mless';

export default function CustomEndpointMappingDialog({ location }) {
  const serviceId = getMatrixParameter(location, serviceDashboard, serviceIdMatrixParameter);
  return (
    <BasicForm
      title="Configure Endpoint Extraction"
      saveButtonLabel="Save"
      onCancelHref$={getModifiedUrlStream(p => (p.pathname = `${serviceDashboard}/endpoints`))}
      getOnSavePath={() => `${serviceDashboard}/endpoints`}
      getEntity={() =>
        getEndpointConfig(serviceId).map(result => {
          const errors = result.errors || [];
          for (let i = 0; i < errors.length; i++) {
            const error = errors[i];
            if (error.code === 'NOT_FOUND') {
              return {
                progress: { loading: false },
                errors: [],
                data: createNewEndpointConfig(serviceId)
              };
            }
          }
          return result;
        })
      }
      updateEntity={config => (config.isNewRule ? addEndpointConfig(config) : updateEndpointConfig(config))}
      getInitialForm={getInitialForm}
      renderFormContent={(config, form, setValue, updateForm) => {
        return (
          <Fragment>
            <Steps
              steps={[
                {
                  stepTitle: 'Define the application through as many filters (key/value pairs) as desired.',
                  content: (
                    <Fragment>
                      <DescriptionText>
                        For example: key as
                        {` "docker.label" `}
                        and value as
                        {` "environment=Production Blue"`}. Regular expressions can be used for the value. When all
                        conditions specified here match a call, it will be considered part of this application.
                      </DescriptionText>

                      <div className={locals.addRuleButtonWrapper}>
                        <Button
                          kind="action"
                          onClick={() =>
                            setActiveDialog(
                              <EndpointExtractionRuleDialog
                                ruleIndex={form.get('rules').size}
                                rules={form.get('rules')}
                                onSave={_rule => {
                                  const additionalSubForm = getConfigRuleForm(_rule);
                                  updateForm(
                                    form.updateIn(['rules'], list => list.push(additionalSubForm).setTouched(true))
                                  );
                                }}
                              />
                            )
                          }
                          icon="lib_openclose_add_circle_outline"
                        >
                          Add Custom Rule
                        </Button>
                      </div>

                      <DragAndDropRuleList
                        rules={form.get('rules')}
                        form={form}
                        setValue={setValue}
                        onSave={(_rule, i) => {
                          form = form.updateIn(['rules', i, 'pathSegments'], field =>
                            field.setValue(_rule.pathSegments).setTouched(true)
                          );
                          form = form.updateIn(['rules', i, 'testCases'], field =>
                            field.setValue(_rule.testCases).setTouched(true)
                          );
                          updateForm(form);
                        }}
                        onRemove={i => removeRule(i, form, updateForm)}
                        switchIndices={(sourceIndex, destinationIndex) =>
                          switchIndices(sourceIndex, destinationIndex, form, updateForm)
                        }
                      />

                      <ExtractionRule
                        rule={{
                          query: 'Collected Path Template',
                          enabled: form.get('endpointNameByCollectedPathTemplateRuleEnabled').value
                        }}
                        onToggleEnable={enabled =>
                          setValue(['endpointNameByCollectedPathTemplateRuleEnabled'], enabled, form)
                        }
                        reorderable={false}
                        isInstanaDefaultRule
                      />
                      <ExtractionRule
                        rule={{
                          query: '/*',
                          enabled: form.get('endpointNameByFirstPathSegmentRuleEnabled').value
                        }}
                        onToggleEnable={enabled =>
                          setValue(['endpointNameByFirstPathSegmentRuleEnabled'], enabled, form)
                        }
                        reorderable={false}
                        isInstanaDefaultRule
                      />
                      <UnspecifiedExtractionRule />
                    </Fragment>
                  )
                }
              ]}
            />
            {!config.isNewRule && <RemoveSection config={config} />}
          </Fragment>
        );
      }}
    />
  );
}

function switchIndices(sourceIndex, destinationIndex, form, updateForm) {
  updateForm(
    form.updateIn(['rules'], originalList => {
      const result = originalList.toJS();
      const [removed] = result.splice(sourceIndex, 1);
      result.splice(destinationIndex, 0, removed);

      for (let i = 0; i < result.length; i++) {
        originalList = originalList.set(i, getConfigRuleForm(result[i]));
      }
      return originalList;
    })
  );
}

function removeRule(i, form, updateForm) {
  updateForm(form.updateIn(['rules'], list => list.remove(i).setTouched(true)));
}

function getInitialForm(config) {
  return createMapForm()
    .put(
      'serviceId',
      createField({
        value: config.serviceId
      })
    )
    .put(
      'isNewRule',
      createField({
        value: config.isNewRule
      })
    )
    .put(
      'endpointNameByFirstPathSegmentRuleEnabled',
      createField({
        value: get(config, 'endpointNameByFirstPathSegmentRuleEnabled')
      })
    )
    .put(
      'endpointNameByCollectedPathTemplateRuleEnabled',
      createField({
        value: get(config, 'endpointNameByCollectedPathTemplateRuleEnabled')
      })
    )
    .put(
      'rules',
      get(config, 'rules', []).reduce((form, rule) => form.push(getConfigRuleForm(rule)), createListForm({}))
    );
}

export function getConfigRuleForm(rule = {}) {
  return createMapForm()
    .put(
      'pathSegments',
      createField({
        value: get(rule, 'pathSegments', [])
      })
    )
    .put(
      'testCases',
      createField({
        value: get(rule, 'testCases', [])
      })
    )
    .put(
      'enabled',
      createField({
        value: get(rule, 'enabled', true)
      })
    );
}
