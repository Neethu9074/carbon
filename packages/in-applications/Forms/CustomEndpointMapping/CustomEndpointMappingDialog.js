/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, createListForm } from 'formalistic';
import React, { useState } from 'react';
import { get } from 'lodash';

import { Typography, RadioButton, Button } from '@instana/components';
import { just } from '@instana/observables';

import EndpointExtractionRuleDialog from 'in-applications/Forms/CustomEndpointMapping/EndpointExtractionRuleDialog/EndpointExtractionRuleDialog';
import {
  createNewEndpointConfig,
  updateEndpointConfig,
  addEndpointConfig,
  getEndpointConfig
} from 'in-api/endpointConfiguration';
import {
  serviceId as serviceIdMatrixParameter,
  hasHttpType as hasHttpTypeMatrixParameter
} from 'in-applications/navigation/matrix';
import UnspecifiedExtractionRule from 'in-applications/Forms/CustomEndpointMapping/UnspecifiedExtractionRule';
import DragAndDropRuleList from 'in-applications/Forms/CustomEndpointMapping/DragAndDropRuleList';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import ExtractionRule from 'in-applications/Forms/CustomEndpointMapping/ExtractionRule';
import { serviceDashboard, endpointsTab } from 'in-applications/navigation/paths';
import RemoveSection from 'in-applications/Forms/CustomEndpointMapping/Remove';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { routeIdOverPathTplEnabled } from 'in-services/featureFlags';
import { productAreas } from 'in-services/tracking/productAreas';
import DescriptionText from 'in-components/form/DescriptionText';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import Steps from 'in-applications/Forms/components/Steps';
import BasicForm from 'in-applications/Forms/BasicForm';
import Tooltip from 'in-components/Tooltip';
import { t, Trans } from 'in-i18n';

import locals from './CustomEndpointMappingDialog.mless';

function PathTemplateRule({ form, setValue }) {
  return (
    <Tooltip
      align="topMiddle"
      themeStyle="light"
      content={t('in-applications:forms.tooltipExtractsEndpointsAsSpecified')}
      overwriteBlock
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
      overwriteBlock
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
      overwriteBlock
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
  const { createHrefToPath } = useNavigation();
  const [isNewConfig, setIsNewConfig] = useState(false);
  const serviceId = getMatrixParameter(location, serviceDashboard, serviceIdMatrixParameter);
  const hasHttpType = getMatrixParameter(location, endpointsTab, hasHttpTypeMatrixParameter) === 'true' ? true : false;
  const endpointCaseConfig = {
    original: 'ORIGINAL',
    lower: 'LOWER',
    upper: 'UPPER'
  };
  return (
    <MaxWidthFullscreenContainer className={locals.maxWidthFullscreenContainer}>
      <BasicForm
        title={t('in-applications:forms.titleConfigureEndpointMapping')}
        saveButtonLabel={t('in-applications:buttonSave')}
        onCancelHref={createHrefToPath(`${serviceDashboard}/endpoints`)}
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

            return {
              ...result,
              data: {
                ...result.data,
                rules: result.data?.rules ?? []
              }
            };
          });
        }}
        updateEntity={config => {
          if (!config.rules.length) {
            delete config['rules'];
          }
          return isNewConfig ? addEndpointConfig(config) : updateEndpointConfig(config);
        }}
        getInitialForm={getInitialForm}
        renderFormContent={(config, form, setValue, updateForm) => {
          const endpointCase = form.get('endpointCase').value;
          return (
            <>
              <ViewTrackingMeta
                data={{
                  productArea: productAreas.applications,
                  pageRootName: pageNames.custom_end_point_config
                }}
              />
              <div className={locals.endpointCaseContainer}>
                <Typography variant="heading-200">{t('in-applications:forms.endpointNameCaseSensitivity')}</Typography>
                <RadioButton
                  size={'large'}
                  label={t('in-applications:forms.titleKeepTheOriginalCase')}
                  explanation={
                    <Trans
                      i18nKey="in-applications:forms.descriptionKeepTheOriginalCase"
                      components={{ bold: <strong />, wrapper: <div className={locals.explanation} /> }}
                    />
                  }
                  checked={endpointCase === endpointCaseConfig.original}
                  onChange={() => {
                    updateForm(form.updateIn(['endpointCase'], f => f.setValue('ORIGINAL')));
                  }}
                  className={locals.radioButton}
                  wrapperClassName={locals.wrapperClassName}
                />
                <RadioButton
                  size={'large'}
                  label={t('in-applications:forms.titleConvertToLowercase')}
                  explanation={
                    <Trans
                      i18nKey="in-applications:forms.descriptionConvertToLowercase"
                      components={{ bold: <strong />, wrapper: <div className={locals.explanation} /> }}
                    />
                  }
                  checked={endpointCase === endpointCaseConfig.lower}
                  onChange={() => {
                    updateForm(form.updateIn(['endpointCase'], f => f.setValue('LOWER')));
                  }}
                  className={locals.radioButton}
                  wrapperClassName={locals.wrapperClassName}
                />
                <RadioButton
                  size={'large'}
                  label={t('in-applications:forms.titleConvertToUppercase')}
                  explanation={
                    <Trans
                      i18nKey="in-applications:forms.descriptionConvertToUppercase"
                      components={{ bold: <strong />, wrapper: <div className={locals.explanation} /> }}
                    />
                  }
                  checked={endpointCase === endpointCaseConfig.upper}
                  onChange={() => {
                    updateForm(form.updateIn(['endpointCase'], f => f.setValue('UPPER')));
                  }}
                  className={locals.radioButton}
                  wrapperClassName={locals.wrapperClassName}
                />
              </div>

              {hasHttpType && (
                <Steps
                  steps={[
                    {
                      stepTitle: t('in-applications:forms.titleConfigureEndpointsMapping'),
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
                            content={[
                              t('in-applications:forms.tooltipEndpointCallsNotMatch'),
                              t('in-applications:forms.tooltipEndpointFallbackRule')
                            ]}
                            overwriteBlock
                          >
                            <UnspecifiedExtractionRule />
                          </Tooltip>
                        </>
                      )
                    }
                  ]}
                />
              )}
              {!isNewConfig && hasHttpType && <RemoveSection config={config} />}
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
      'endpointCase',
      createField({
        value: get(config, 'endpointCase') ?? 'ORIGINAL'
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
