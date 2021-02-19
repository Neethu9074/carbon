/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField, createMapForm, createListForm } from 'formalistic';
import { just } from '@instana/observables';
import React, { useState } from 'react';
import { get } from 'lodash';
import { t } from 'in-i18n';

import EndpointExtractionRuleDialog from 'in-applications/Forms/CustomEndpointMapping/EndpointExtractionRuleDialog/EndpointExtractionRuleDialog';
import {
  createNewEndpointConfig,
  updateEndpointConfig,
  addEndpointConfig,
  getEndpointConfig
} from 'in-api/endpointConfiguration';
import UnspecifiedExtractionRule from 'in-applications/Forms/CustomEndpointMapping/UnspecifiedExtractionRule';
import DragAndDropRuleList from 'in-applications/Forms/CustomEndpointMapping/DragAndDropRuleList';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { serviceId as serviceIdMatrixParameter } from 'in-applications/navigation/matrix';
import ExtractionRule from 'in-applications/Forms/CustomEndpointMapping/ExtractionRule';
import RemoveSection from 'in-applications/Forms/CustomEndpointMapping/Remove';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { routeIdOverPathTplEnabled } from 'in-services/featureFlags';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import { serviceDashboard } from 'in-applications/navigation/paths';
import DescriptionText from 'in-components/form/DescriptionText';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation';
import Steps from 'in-applications/Forms/components/Steps';
import BasicForm from 'in-applications/Forms/BasicForm';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';

import locals from './CustomEndpointMappingDialog.mless';

function PathTemplateRule({ form, setValue }) {
  return (
    <Tooltip
      align="topMiddle"
      themeStyle="light"
      content={t('in-applications:forms.tooltipExtractsEndpointsAsSpecified')}
    >
      <ExtractionRule
        rule={{
          query: t('in-applications:forms.rulePathTemplate'),
          enabled: form.get('endpointNameByCollectedPathTemplateRuleEnabled').value
        }}
        onToggleEnable={enabled => setValue(['endpointNameByCollectedPathTemplateRuleEnabled'], enabled, form)}
        reorderable={false}
        isInstanaDefaultRule
      />
    </Tooltip>
  );
}

function FirstParameterRule({ form, setValue }) {
  return (
    <Tooltip
      align="topMiddle"
      themeStyle="light"
      content={t('in-applications:forms.tooltipExtractsEndpointsOnFirstPath')}
    >
      <ExtractionRule
        rule={{
          query: t('in-applications:forms.ruleFirstPathSegment'),
          enabled: form.get('endpointNameByFirstPathSegmentRuleEnabled').value
        }}
        onToggleEnable={enabled => setValue(['endpointNameByFirstPathSegmentRuleEnabled'], enabled, form)}
        reorderable={false}
        isInstanaDefaultRule
      />
    </Tooltip>
  );
}

function RouteIdRule() {
  return (
    <Tooltip
      align="topMiddle"
      themeStyle="light"
      content={t('in-applications:forms.tooltipExtractsEndpointsOnRouteId')}
    >
      <ExtractionRule
        rule={{ query: t('in-applications:forms.ruleRouteId'), enabled: true }}
        reorderable={false}
        isInstanaDefaultRule
      />
    </Tooltip>
  );
}

export default function CustomEndpointMappingDialog({ location }) {
  const [isNewConfig, setIsNewConfig] = useState(false);

  const serviceId = getMatrixParameter(location, serviceDashboard, serviceIdMatrixParameter);
  return (
    <MaxWidthFullscreenContainer className={locals.maxWidthFullscreenContainer}>
      <BasicForm
        title={t('in-applications:forms.titleConfigureEndpointExtraction')}
        saveButtonLabel={isNewConfig ? t('in-applications:buttonAdd') : t('in-applications:buttonSave')}
        onCancelHref$={getModifiedUrlStream(p => (p.pathname = `${serviceDashboard}/endpoints`))}
        getOnSavePath={() => `${serviceDashboard}/endpoints`}
        getEntity={() => {
          if (isNewConfig) {
            return just(isNewConfig);
          }
          return getEndpointConfig(serviceId).map(result => {
            const errors = result.errors || [];
            for (let i = 0; i < errors.length; i++) {
              const error = errors[i];
              if (error.code === 'NOT_FOUND') {
                const newConfig = {
                  progress: { loading: false },
                  errors: [],
                  data: createNewEndpointConfig(serviceId)
                };
                setIsNewConfig(newConfig);
                return newConfig;
              }
            }
            return result;
          });
        }}
        updateEntity={config => (isNewConfig ? addEndpointConfig(config) : updateEndpointConfig(config))}
        getInitialForm={getInitialForm}
        renderFormContent={(config, form, setValue, updateForm) => {
          return (
            <>
              <ViewTrackingMeta
                data={{
                  productArea: 'Applications',
                  pageRootName: 'Service'
                }}
              />

              <Steps
                steps={[
                  {
                    stepTitle: t('in-applications:forms.titleConfigureEndpointsExtract'),
                    content: (
                      <>
                        <DescriptionText>
                          {t('in-applications:forms.descriptionConfigureEndpointsExtract')}
                        </DescriptionText>

                        <div className={locals.addRuleButtonWrapper}>
                          <Button
                            kind="action"
                            onClick={() =>
                              addActiveDialog(
                                <EndpointExtractionRuleDialog
                                  ruleIndex={0}
                                  rules={form.get('rules')}
                                  onSave={_rule =>
                                    updateForm(
                                      form.updateIn(['rules'], list =>
                                        list.unshift(getConfigRuleForm(_rule)).setTouched(true)
                                      )
                                    )
                                  }
                                />
                              )
                            }
                            icon="lib_openclose_add_circle_outline"
                          >
                            {t('in-applications:buttonAddCustomHTTPRule')}
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

                        {routeIdOverPathTplEnabled && <RouteIdRule />}
                        <PathTemplateRule form={form} setValue={setValue} />
                        <FirstParameterRule form={form} setValue={setValue} />

                        <Tooltip
                          align="topMiddle"
                          themeStyle="light"
                          content={t('in-applications:forms.tooltipEndpointCallsNotMatch')}
                        >
                          <UnspecifiedExtractionRule />
                        </Tooltip>
                      </>
                    )
                  }
                ]}
              />
              {!isNewConfig && <RemoveSection config={config} />}
            </>
          );
        }}
      />
    </MaxWidthFullscreenContainer>
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
