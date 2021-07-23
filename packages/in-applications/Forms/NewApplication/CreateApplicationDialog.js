/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm } from 'formalistic';
import React, { Fragment } from 'react';
import classNames from 'classnames';

import { just } from '@instana/observables';
import { Card } from '@instana/components';

import {
  addApplicationConfig,
  createNewApplicationConfig,
  getApplicationConfig,
  updateApplicationConfig
} from 'in-api/applicationConfigs';
import { hasPermissionToAddBuiltInSmartAlerts } from 'in-alerting/smart-alerts/applications/apCreation/BuiltInGlobalSmartAlertsPermissionWrapper';
import ConfigTabBuiltInSmartAlertsSelectionList from 'in-alerting/smart-alerts/applications/apCreation/ConfigTabBuiltInSmartAlertsSelectionList';
import InboundOrAllCallsChoiceVertical from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsChoiceVertical';
import CreateApplicationQueryBuilder from 'in-applications/creation/components/CreateApplicationQueryBuilder';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { applicationSubmitTracker } from 'in-applications/tracker';
import DescriptionText from 'in-components/form/DescriptionText';
import TouchedMessages from 'in-components/form/TouchedMessages';
import OptionBox from 'in-applications/components/OptionBox';
import Steps from 'in-applications/Forms/components/Steps';
import { getColor } from 'in-applications/endpointTypes';
import BasicForm from 'in-applications/Forms/BasicForm';
import FormGroup from 'in-components/form/FormGroup';
import HelpText from 'in-components/form/HelpText';
import { isBlank } from 'in-services/util/string';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Pill from 'in-components/Pill';
import { t, Trans } from 'in-i18n';

import locals from './CreateApplicationDialog.mless';

export default function CreateApplicationDialog({ applicationId, onCancelHref$, getOnSavePath }) {
  return (
    <MaxWidthFullscreenContainer className={locals.maxWidthFullscreenContainer}>
      <Card
        title={
          applicationId
            ? t('in-applications:titleUpdateApplicationPerspective')
            : t('in-applications:titleCreateApplicationPerspective')
        }
      >
        <BasicForm
          saveButtonLabel={applicationId ? t('in-applications:buttonSave') : t('in-applications:buttonCreate')}
          onCancelHref$={onCancelHref$}
          getOnSavePath={getOnSavePath}
          getEntity={() =>
            applicationId
              ? getApplicationConfig(applicationId)
              : just({ progress: { loading: false }, errors: [], data: createNewApplicationConfig() })
          }
          updateEntity={applicationConfig => {
            applicationSubmitTracker({
              name: applicationConfig.label,
              downstreamEnabled: applicationConfig.scope === 'INCLUDE_ALL_DOWNSTREAM',
              tags: applicationConfig.matchSpecification?.map(spec => spec.key) || []
            });
            const isNewConfig = !applicationConfig.id ? true : false;
            if (isNewConfig) {
              return addApplicationConfig(applicationConfig);
            }
            return updateApplicationConfig(applicationConfig);
          }}
          updateFormOnSubmit={form => {
            const labelField = form.get('label');
            if (labelField && labelField.touched) {
              return form.updateIn(['label'], field => field.setValue(labelField.value.trim()));
            }
            return form;
          }}
          getInitialForm={getInitialForm}
          renderFormContent={(appConfig, form, setValue, updateForm) => {
            return (
              <Fragment>
                <HelpText>{t('in-applications:forms.newApplication.helpApplicationPerspectives')}</HelpText>
                <Steps
                  steps={[
                    {
                      stepTitle: t('in-applications:forms.newApplication.stepTitleDefineApplicationName'),
                      content: form.get('label').map(field => (
                        <FormGroup>
                          <Label htmlFor="label" hasError={!field.valid && field.touched}>
                            {t('in-applications:creation.simple.step3.apName')}
                          </Label>
                          <Input
                            type="text"
                            id="label"
                            value={field.value}
                            onChange={e => setValue(['label'], e.target.value, form)}
                            autoComplete="off"
                            hasError={!field.valid && field.touched}
                            autoFocus
                          />
                          <TouchedMessages field={field} />

                          {applicationId && (
                            <HelpText>
                              <Trans
                                i18nKey="in-applications:forms.newApplication.helpRenameApplication"
                                components={{ italic: <em /> }}
                              />
                            </HelpText>
                          )}

                          <DescriptionText className={locals.applicationNameText}>
                            {t('in-applications:forms.newApplication.descriptionApplicationName')}
                          </DescriptionText>
                        </FormGroup>
                      ))
                    },
                    {
                      stepTitle: t('in-applications:forms.newApplication.stepTitleDefineTags'),
                      content: (
                        <Fragment>
                          <DescriptionText>
                            <Trans
                              i18nKey="in-applications:forms.newApplication.descriptionTags"
                              components={{
                                pillDatabase: <Pill color={getColor('DATABASE')} kind="light" />,
                                pillMessage: <Pill color={getColor('MESSAGING')} kind="light" />
                              }}
                            />
                            <br />
                            <br />
                            <strong>
                              {t('in-applications:forms.newApplication.descriptionOperatorsCreationEnabled')}
                            </strong>
                          </DescriptionText>
                          <div className={locals.queryBuilder}>
                            <CreateApplicationQueryBuilder
                              value={form.get('tagFilterExpression')?.value || []}
                              onChange={tagFilterExpression =>
                                setTagFilterExpression(tagFilterExpression, form, updateForm)
                              }
                            />
                          </div>
                        </Fragment>
                      )
                    },
                    {
                      stepTitle: t('in-applications:forms.newApplication.stepTitleDownstreamServices'),
                      content: form.get('scope').map(field => (
                        <FormGroup>
                          <OptionBox
                            className={classNames({
                              [locals.optionBox]: true,
                              [locals.optionBoxUnchecked]: field.value !== 'INCLUDE_NO_DOWNSTREAM'
                            })}
                            title={t('in-applications:forms.newApplication.optionNoDownstreamServices')}
                            asRadioButton
                            checked={field.value == 'INCLUDE_NO_DOWNSTREAM'}
                            onChange={() => setValue(['scope'], 'INCLUDE_NO_DOWNSTREAM', form)}
                          />
                          <OptionBox
                            className={classNames({
                              [locals.optionBox]: true,
                              [locals.optionBoxUnchecked]:
                                field.value !== 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING'
                            })}
                            title={t('in-applications:forms.newApplication.optionImmediateDownstreamServices')}
                            asRadioButton
                            checked={field.value == 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING'}
                            onChange={() =>
                              setValue(['scope'], 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING', form)
                            }
                          />
                          <OptionBox
                            className={classNames({
                              [locals.optionBox]: true,
                              [locals.optionBoxUnchecked]: field.value !== 'INCLUDE_ALL_DOWNSTREAM'
                            })}
                            title={t('in-applications:forms.newApplication.optionAllDownstreamServices')}
                            asRadioButton
                            checked={field.value == 'INCLUDE_ALL_DOWNSTREAM'}
                            onChange={() => setValue(['scope'], 'INCLUDE_ALL_DOWNSTREAM', form)}
                          />
                        </FormGroup>
                      ))
                    },
                    {
                      stepTitle: t('in-applications:forms.newApplication.stepTitleApplicationScope'),
                      content: form.get('boundaryScope').map(field => {
                        return (
                          <FormGroup>
                            <InboundOrAllCallsChoiceVertical
                              boundaryScope={field.value}
                              onBoundaryStateChange={value => setValue(['boundaryScope'], value.boundaryScope, form)}
                            />
                          </FormGroup>
                        );
                      })
                    },
                    hasPermissionToAddBuiltInSmartAlerts()
                      ? {
                          stepTitle: t('in-applications:forms.newApplication.stepTitleBuiltInSmartAlertsScope'),
                          content: form.get('builtInAlertIds').map(field => {
                            return (
                              <ConfigTabBuiltInSmartAlertsSelectionList
                                onChange={alertIds =>
                                  updateForm(
                                    form.updateIn(['builtInAlertIds'], field =>
                                      field.setValue(alertIds).setTouched(true)
                                    )
                                  )
                                }
                                alertIds={field.value}
                              />
                            );
                          })
                        }
                      : null
                  ].filter(Boolean)}
                />
              </Fragment>
            );
          }}
        />
      </Card>
    </MaxWidthFullscreenContainer>
  );
}

function getInitialForm(application) {
  const form = createMapForm()
    .put(
      'id',
      createField({
        value: application.id
      })
    )
    .put(
      'label',
      createField({
        value: application.label,
        validator: applicationLabelValidator
      })
    )
    .put(
      'scope',
      createField({
        value: application.scope
      })
    )
    .put(
      'boundaryScope',
      createField({
        value: application.boundaryScope
      })
    )
    .put(
      'tagFilterExpression',
      createField({
        value: application.tagFilterExpression ?? [],
        validator: tagFilterExpression => tagFilterExpressionValidator(tagFilterExpression)
      })
    )
    .put(
      'builtInAlertIds',
      createField({
        value: application.builtInAlertIds ?? []
      })
    );

  return form;
}

function applicationLabelValidator(name) {
  if (isBlank(name)) {
    return [
      {
        severity: 'error',
        message: t('in-applications:forms.newApplication.errorApplicationNameBlank')
      }
    ];
  }

  if (name.length > 128) {
    return [
      {
        severity: 'error',
        message: t('in-applications:forms.newApplication.errorNameLengthExceeded')
      }
    ];
  }

  return null;
}

function setTagFilterExpression(tagFilterExpression, form, updateForm) {
  updateForm(form.updateIn(['tagFilterExpression'], field => field.setValue(tagFilterExpression)));
}

function tagFilterExpressionValidator(tagFilterExpression) {
  if (tagFilterExpression.length === 0) {
    return [
      {
        severity: 'error',
        message: t('in-applications:forms.newApplication.errorInvalidQuery')
      }
    ];
  }
}
