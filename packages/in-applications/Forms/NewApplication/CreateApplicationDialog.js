/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField, createMapForm, createListForm, notBlankValidator } from 'formalistic';
import { just } from '@instana/observables';
import React, { Fragment } from 'react';
import classNames from 'classnames';
import { Trans, t } from 'in-i18n';
import { get } from 'lodash';

import {
  createNewApplicationConfig,
  getApplicationConfig,
  addApplicationConfig,
  updateApplicationConfig
} from 'in-api/applicationConfigs';
import InboundOrAllCallsChoiceVertical from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsChoiceVertical';
import {
  getSecondLevelKeySuggestions,
  getValueSuggestions
} from 'in-analyze/AnalyzeView/components/AnalyzeEditTagFilterDialog';
import CreateApplicationQueryBuilder from 'in-applications/creation/components/CreateApplicationQueryBuilder';
import EditTagFilterDialog from 'in-analyze/components/EditTagFilterDialog/EditTagFilterDialog';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import BasicForm, { matchSpecificationValidator } from 'in-applications/Forms/BasicForm';
import { newAnalyticsEnabled, qb2InAPCreationEnabled } from 'in-services/featureFlags';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import TagFilterList from 'in-analyze/AnalyzeView/components/TagFilterList';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getApplicationCreationTagKeys } from 'in-applications/tags';
import { applicationSubmitTracker } from 'in-applications/tracker';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import OptionBox from 'in-applications/components/OptionBox';
import Steps from 'in-applications/Forms/components/Steps';
import { entityTypes } from 'in-analyze/applicationFilter';
import { getColor } from 'in-applications/endpointTypes';
import FormGroup from 'in-components/form/FormGroup';
import HelpText from 'in-components/form/HelpText';
import { isBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Pill from 'in-new-components/Pill';
import Card from 'in-new-components/Card';

import locals from './CreateApplicationDialog.mless';

export default function CreateApplicationDialog({ timeConfig, applicationId, onCancelHref$, getOnSavePath }) {
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
            const tagFiltersForSubscription =
              (!newAnalyticsEnabled || !qb2InAPCreationEnabled) &&
              getTagFilterListForBackendSubscription(form.get('matchSpecification').toJS());
            const filters = {
              timeConfig,
              tagFilter: tagFiltersForSubscription
            };
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
                      stepTitle: t('in-applications:forms.newApplication.stepTitleDefineApplicationName'),
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
                              {newAnalyticsEnabled && qb2InAPCreationEnabled
                                ? t('in-applications:forms.newApplication.descriptionOperatorsCreationEnabled')
                                : t('in-applications:forms.newApplication.descriptionOperators')}
                            </strong>
                          </DescriptionText>
                          {newAnalyticsEnabled && qb2InAPCreationEnabled ? (
                            <div className={locals.queryBuilder}>
                              <CreateApplicationQueryBuilder
                                value={form.get('tagFilterExpression')?.value || []}
                                onChange={tagFilterExpression =>
                                  setTagFilterExpression(tagFilterExpression, form, updateForm)
                                }
                              />
                            </div>
                          ) : (
                            <>
                              <div className={locals.addRuleButtonWrapper}>
                                <Button
                                  kind="action"
                                  onClick={() =>
                                    addActiveDialog(
                                      <EditTagFilterDialog
                                        tagFilters={filters.tagFilter}
                                        timeConfig={filters.timeConfig}
                                        tagSuggestions={getApplicationCreationTagKeys()}
                                        getKeySuggestions={getSecondLevelKeySuggestions}
                                        getValueSuggestions={getValueSuggestions}
                                        addTagFilter={_tag => {
                                          const additionalSubForm = getEnrichedMatchSpecificationForm({
                                            key: _tag.name,
                                            entity: _tag.entity,
                                            secondLevelName: _tag.secondLevelName || '',
                                            value: _tag.value || '',
                                            operator: _tag.operator
                                          });
                                          updateForm(
                                            form.updateIn(['matchSpecification'], list =>
                                              list.push(additionalSubForm).setTouched(true)
                                            )
                                          );
                                        }}
                                        forAnalyzeCalls
                                      />
                                    )
                                  }
                                  icon="lib_openclose_add_circle_outline"
                                >
                                  {t('in-applications:buttonAddTag')}
                                </Button>
                              </div>
                              <TagFilterList
                                filterConnectionOperators={['OR', 'AND']}
                                onOperatorChanged={(i, operator) => {
                                  updateForm(
                                    form.updateIn(['matchSpecification', i, 'conjunction'], field =>
                                      field.setValue(operator).setTouched(true)
                                    )
                                  );
                                }}
                                tagFilters={form.get('matchSpecification').map((matchSpecification, i) => ({
                                  tag: {
                                    name: matchSpecification.get('key').value,
                                    entity: matchSpecification.get('entity').value,
                                    value: matchSpecification.get('value').value,
                                    operator: matchSpecification.get('operator').value,
                                    secondLevelName: matchSpecification.get('secondLevelName').value,
                                    conjunction: matchSpecification.get('conjunction').value
                                  },
                                  onClick: () =>
                                    addActiveDialog(
                                      <EditTagFilterDialog
                                        tagFilter={{
                                          name: matchSpecification.get('key').value,
                                          entity: matchSpecification.get('entity').value,
                                          value: matchSpecification.get('value').value,
                                          operator: matchSpecification.get('operator').value,
                                          secondLevelName: matchSpecification.get('secondLevelName').value
                                        }}
                                        tagFilters={filters.tagFilter}
                                        timeConfig={filters.timeConfig}
                                        tagSuggestions={getApplicationCreationTagKeys()}
                                        getKeySuggestions={getSecondLevelKeySuggestions}
                                        getValueSuggestions={getValueSuggestions}
                                        updateTagFilter={_tag => {
                                          form = form.updateIn(['matchSpecification', i, 'value'], field =>
                                            field.setValue(_tag.value || '').setTouched(true)
                                          );
                                          form = form.updateIn(['matchSpecification', i, 'key'], field =>
                                            field.setValue(_tag.name).setTouched(true)
                                          );
                                          form = form.updateIn(['matchSpecification', i, 'entity'], field =>
                                            field.setValue(_tag.entity).setTouched(true)
                                          );
                                          form = form.updateIn(['matchSpecification', i, 'operator'], field =>
                                            field.setValue(_tag.operator).setTouched(true)
                                          );
                                          form = form.updateIn(['matchSpecification', i, 'secondLevelName'], field =>
                                            field.setValue(_tag.secondLevelName).setTouched(true)
                                          );

                                          updateForm(form);
                                        }}
                                        removeTagFilter={() => removeMatchSpecification(i, form, updateForm)}
                                        forAnalyzeCalls
                                      />
                                    ),
                                  onRemove: () => removeMatchSpecification(i, form, updateForm)
                                }))}
                              />
                            </>
                          )}
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
                    }
                  ]}
                />
              </Fragment>
            );
          }}
        />
      </Card>
    </MaxWidthFullscreenContainer>
  );
}

function removeMatchSpecification(i, form, updateForm) {
  updateForm(form.updateIn(['matchSpecification'], list => list.remove(i).setTouched(true)));
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
    );

  if (newAnalyticsEnabled && qb2InAPCreationEnabled) {
    return form.put(
      'tagFilterExpression',
      createField({
        value: application.tagFilterExpression ?? [],
        validator: tagFilterExpression => tagFilterExpressionValidator(tagFilterExpression)
      })
    );
  } else {
    return form.put(
      'matchSpecification',
      get(application, 'matchSpecification', []).reduce(
        (form, matchSpecification) => form.push(getEnrichedMatchSpecificationForm(matchSpecification)),
        createListForm({
          validator: matchSpecificationValidator
        })
      )
    );
  }
}

function getMatchSpecificationForm(matchSpecification = {}) {
  return createMapForm()
    .put(
      'key',
      createField({
        value: get(matchSpecification, 'key', ''),
        validator: notBlankValidator
      })
    )
    .put(
      'entity',
      createField({
        value: get(matchSpecification, 'entity', entityTypes.NOT_APPLICABLE),
        validator: notBlankValidator
      })
    )
    .put(
      'secondLevelName',
      createField({
        value: get(matchSpecification, 'secondLevelName', '')
      })
    )
    .put(
      'value',
      createField({
        value: get(matchSpecification, 'value', '')
      })
    )
    .put(
      'operator',
      createField({
        value: get(matchSpecification, 'operator', 'EQUALS')
      })
    );
}

function getEnrichedMatchSpecificationForm(matchSpecification) {
  return getMatchSpecificationForm(matchSpecification).put(
    'conjunction',
    createField({
      value: get(matchSpecification, 'conjunction', 'AND')
    })
  );
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
