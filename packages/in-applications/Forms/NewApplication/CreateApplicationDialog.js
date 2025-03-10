/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm } from 'formalistic';
import React from 'react';

import {
  Card,
  Message,
  Pill,
  Typography,
  CarbonTextInput as TextInput,
  CarbonFormGroup as FormGroup,
  CarbonStack as Stack
} from '@instana/components';
import { just } from '@instana/observables';

import {
  getApplicationConfigWithAlerting,
  addApplicationConfigWithAlerting,
  updateApplicationConfigWithAlerting,
  createNewApplicationConfig
} from 'in-api/applicationConfigs';
import { hasPermissionToAddBuiltInSmartAlerts } from 'in-alerting/smart-alerts/applications/apCreation/BuiltInGlobalSmartAlertsPermissionWrapper';
import ConfigTabBuiltInSmartAlertsSelectionList from 'in-alerting/smart-alerts/applications/apCreation/ConfigTabBuiltInSmartAlertsSelectionList';
import CreateApplicationQueryBuilder from 'in-applications/creation/components/CreateApplicationQueryBuilder';
import ContributionFilterDropdown from 'in-applications/creation/components/ContributionFilterDropdown';
import { DownstreamScopeSelector } from 'in-applications/Forms/shared/DownstreamScopeSelector';
import { BoundaryScopeSelector } from 'in-applications/Forms/shared/BoundaryScopeSelector';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import Steps from 'in-applications/Forms/components/Steps';
import { getColor } from 'in-applications/endpointTypes';
import BasicForm from 'in-applications/Forms/BasicForm';
import { isBlank } from 'in-services/util/string';
import { noop } from 'in-services/fixedObjects';
import { t, Trans } from 'in-i18n';

import locals from './CreateApplicationDialog.mless';

// FIXME: this is only used in AP config... we should make it re-usable for creation as well
export default function CreateApplicationDialog({ applicationId, onCancelHref, getOnSavePath }) {
  const { trackApplicationSubmitted } = useApplicationTracker();
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
          onCancelHref={onCancelHref}
          getOnSavePath={getOnSavePath}
          getEntity={() =>
            applicationId
              ? getApplicationConfigWithAlerting(applicationId)
              : just({ progress: { loading: false }, errors: [], data: createNewApplicationConfig() })
          }
          updateEntity={applicationConfig => {
            trackApplicationSubmitted({
              name: applicationConfig.label,
              downstreamEnabled: applicationConfig.scope === 'INCLUDE_ALL_DOWNSTREAM',
              tags: applicationConfig.matchSpecification?.map(spec => spec.key) || []
            });
            const isNewConfig = !applicationConfig.id ? true : false;
            if (isNewConfig) {
              return addApplicationConfigWithAlerting(applicationConfig);
            }
            return updateApplicationConfigWithAlerting(applicationConfig);
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
              <FormGroup legendText={t('in-applications:forms.newApplication.helpApplicationPerspectives')}>
                <Steps
                  steps={[
                    {
                      stepTitle: t('in-applications:forms.newApplication.stepTitleDefineApplicationName'),
                      content: form.get('label').map(field => (
                        <Stack>
                          <Typography variant="label-01">
                            {t('in-applications:forms.newApplication.descriptionApplicationName')}
                          </Typography>
                          <TextInput
                            id="label"
                            labelText={t('in-applications:creation.simple.step3.apName')}
                            helperText={
                              <Trans
                                i18nKey="in-applications:forms.newApplication.helpRenameApplication"
                                components={{ italic: <em /> }}
                              />
                            }
                            value={field.value}
                            onChange={e => setValue(['label'], e.target.value, form)}
                            invalid={field.touched && !field.valid}
                            invalidText={field.messages?.[0]?.message}
                          />
                        </Stack>
                      ))
                    },
                    {
                      stepTitle: t('in-applications:forms.newApplication.stepTitleDefineTags'),
                      content: (
                        <Stack>
                          <Typography variant="label-01">
                            <Trans
                              i18nKey="in-applications:forms.newApplication.descriptionTags"
                              components={{
                                pillDatabase: (
                                  <Pill color={getColor('DATABASE')}>
                                    {t('in-applications:creation.advanced.database')}
                                  </Pill>
                                ),
                                pillMessage: (
                                  <Pill color={getColor('MESSAGING')}>
                                    {t('in-applications:creation.advanced.messaging')}
                                  </Pill>
                                )
                              }}
                            />
                          </Typography>
                          <Typography variant="heading-compact-01">
                            {t('in-applications:forms.newApplication.descriptionOperatorsCreationEnabled')}
                          </Typography>
                          {applicationId && appConfig.groupId && !appConfig.contributionFilter && (
                            <Message
                              description={t(
                                'in-applications:forms.newApplication.warningMessageForContributionFilter'
                              )}
                            />
                          )}
                          {appConfig.contributionFilter != null && (
                            <ContributionFilterDropdown
                              form={form}
                              updateForm={noop}
                              userRestrictedApplications={createUserRestrictedApplication(appConfig)}
                              disabled={false}
                              className={locals.contributionFilterDropdownItem}
                            />
                          )}
                          <div className={locals.queryBuilder}>
                            <CreateApplicationQueryBuilder
                              value={form.get('tagFilterExpression')?.value || []}
                              getSuggestionsProps={{
                                contributionFilter: appConfig.contributionFilter?.tagFilterExpression
                              }}
                              onChange={tagFilterExpression =>
                                setTagFilterExpression(tagFilterExpression, form, updateForm)
                              }
                            />
                          </div>
                        </Stack>
                      )
                    },
                    {
                      stepTitle: t('in-applications:forms.newApplication.stepTitleDownstreamServices'),
                      content: form
                        .get('scope')
                        .map(field => (
                          <DownstreamScopeSelector
                            formField={field}
                            onChange={value => setValue(['scope'], value, form)}
                            maxScope={getMaxScope(appConfig)}
                          />
                        ))
                    },
                    {
                      stepTitle: t('in-applications:forms.newApplication.stepTitleApplicationScope'),
                      content: form
                        .get('boundaryScope')
                        .map(field => (
                          <BoundaryScopeSelector
                            formField={field}
                            onChange={value => setValue(['boundaryScope'], value, form)}
                          />
                        ))
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
                                applicationId={appConfig.id}
                              />
                            );
                          })
                        }
                      : null
                  ].filter(Boolean)}
                />
              </FormGroup>
            );
          }}
        />
      </Card>
    </MaxWidthFullscreenContainer>
  );
}

function getMaxScope(appConfig) {
  return appConfig.contributionFilter?.scope ?? 'INCLUDE_ALL_DOWNSTREAM';
}

export function createUserRestrictedApplication(appConfig) {
  return [
    {
      filter: appConfig.contributionFilter,
      restrictedApplications: [appConfig.id]
    }
  ];
}

function getInitialForm(application) {
  const optionalTagFilterExpression = application.restrictingApplicationId != null;
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
      'restrictingApplicationId',
      createField({
        value: application.restrictingApplicationId
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
        validator: optionalTagFilterExpression
          ? undefined
          : tagFilterExpression => tagFilterExpressionValidator(tagFilterExpression)
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
