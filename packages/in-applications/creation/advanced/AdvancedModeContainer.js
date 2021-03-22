/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, notBlankValidator } from 'formalistic';
import { get } from 'lodash';
import React from 'react';

import {
  getSecondLevelKeySuggestions,
  getValueSuggestions
} from 'in-analyze/AnalyzeView/components/AnalyzeEditTagFilterDialog';
import CreateApplicationQueryBuilder from 'in-applications/creation/components/CreateApplicationQueryBuilder';
import ApplicationScopeSelector from 'in-applications/creation/components/ApplicationScopeSelector';
import EditTagFilterDialog from 'in-analyze/components/EditTagFilterDialog/EditTagFilterDialog';
import FormFooter, { SaveButton, CancelButton } from 'in-components/form/FormFooter/FormFooter';
import { newAnalyticsEnabled, qb2InAPCreationEnabled } from 'in-services/featureFlags';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import InboundAllCalls from 'in-applications/creation/components/InboundAllCalls';
import TagFilterList from 'in-analyze/AnalyzeView/components/TagFilterList';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getApplicationCreationTagKeys } from 'in-applications/tags';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import Spacer from 'in-applications/Forms/components/Spacer';
import { entityTypes } from 'in-analyze/applicationFilter';
import { getColor } from 'in-applications/endpointTypes';
import { error } from 'in-new-components/Message/types';
import FormGroup from 'in-components/form/FormGroup';
import Message from 'in-new-components/Message';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Pill from 'in-new-components/Pill';
import { t, Trans } from 'in-i18n';

import locals from './AdvancedModeContainer.mless';

export default function AdvancedModeContainer({
  form,
  updateForm,
  timeConfig,
  onClose,
  onCreate,
  isSaving,
  isValidTagFilterExpression,
  errorMessage
}) {
  const labelField = form.get('label');

  const tagFiltersForSubscription =
    (!newAnalyticsEnabled || !qb2InAPCreationEnabled) &&
    getTagFilterListForBackendSubscription(form.get('matchSpecification').toJS());
  const filters = {
    timeConfig,
    tagFilter: tagFiltersForSubscription
  };

  const conjunctions = form.toJS().matchSpecification?.map(item => item.conjunction);

  const tagFilterExpressionField = form.get('tagFilterExpression');

  return (
    <>
      <div className={locals.container}>
        <h1 className={locals.heading}>{t('in-applications:creation.advanced.defineName')}</h1>
        <FormGroup>
          <Label htmlFor="label" hasError={!labelField.valid && labelField.touched}>
            {t('in-applications:creation.advanced.apName')}
          </Label>
          <Input
            type="text"
            id="label"
            value={labelField.value}
            onChange={e =>
              updateForm(form.updateIn(['label'], field => field.setValue(e.target.value || '').setTouched(true)))
            }
            autoComplete="off"
            hasError={(!labelField.valid || errorMessage) && labelField.touched}
            autoFocus
          />
          <TouchedMessages field={labelField} />
          {errorMessage && (
            <Message className={locals.errorMessage} type={error} withIcon small>
              {errorMessage}
            </Message>
          )}

          <DescriptionText className={locals.descriptionText}>
            {t('in-applications:creation.advanced.apNameDescription')}
          </DescriptionText>
        </FormGroup>
        <Spacer type="dark" />

        <>
          <h1 className={locals.heading}>{t('in-applications:creation.advanced.defineUsingTags')}</h1>
          <DescriptionText className={locals.descriptionText}>
            <Trans
              i18nKey="in-applications:creation.advanced.defineUsingTagsDescription"
              components={{
                'pill-database': (
                  <Pill color={getColor('DATABASE')} kind="light">
                    {t('in-applications:creation.advanced.database')}
                  </Pill>
                ),
                'pill-messaging': (
                  <Pill color={getColor('MESSAGING')} kind="light">
                    {t('in-applications:creation.advanced.messaging')}
                  </Pill>
                )
              }}
            />
            <br />
            <br />
            <strong>
              {newAnalyticsEnabled && qb2InAPCreationEnabled
                ? t('in-applications:creation.advanced.andOperatorsPrecedenceBrackets')
                : t('in-applications:creation.advanced.andOperatorsPrecedence')}
            </strong>
          </DescriptionText>

          {newAnalyticsEnabled && qb2InAPCreationEnabled ? (
            <div className={locals.queryBuilder}>
              <div className={locals.queryBuilderExpression}>
                <CreateApplicationQueryBuilder
                  value={tagFilterExpressionField.value}
                  onChange={tagFilterExpression => setTagFilterExpression(tagFilterExpression, form, updateForm)}
                />
              </div>

              <HorizontalFlexWrapper>
                {tagFilterExpressionField.value.length > 0 && (
                  <Button
                    kind="subtle"
                    icon="lib_openclose_cancel"
                    size="compact"
                    onClick={() => setTagFilterExpression([], form, updateForm)}
                  >
                    {t('in-applications:creation.advanced.clear')}
                  </Button>
                )}
              </HorizontalFlexWrapper>
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
                            form.updateIn(['matchSpecification'], list => list.push(additionalSubForm).setTouched(true))
                          );
                        }}
                        forAnalyzeCalls
                        conjunctions={conjunctions}
                      />
                    )
                  }
                  icon="lib_openclose_add_circle_outline"
                >
                  {t('in-applications:creation.advanced.addTag')}
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
                        conjunctions={conjunctions}
                        forAnalyzeCalls
                      />
                    ),
                  onRemove: () => removeMatchSpecification(i, form, updateForm)
                }))}
              />
            </>
          )}
        </>
        <Spacer type="dark" />
        <h1 className={locals.heading}>{t('in-applications:creation.advanced.downstreamCalls')}</h1>
        <DescriptionText className={locals.descriptionText}>
          {t('in-applications:creation.advanced.downstreamCallsDescription')}
        </DescriptionText>
        <ApplicationScopeSelector form={form} updateForm={updateForm} />
        <Spacer type="dark" />
        <h1 className={locals.heading}>{t('in-applications:creation.advanced.defaultDashboardView')}</h1>
        <InboundAllCalls form={form} updateForm={updateForm} apCreation />
      </div>
      <FormFooter className={locals.controls}>
        <CancelButton onClick={() => onClose()} />
        <SaveButton
          onClick={() => onCreate()}
          isSaving={isSaving}
          form={form}
          disabled={
            !form.hierarchyValid || (newAnalyticsEnabled && qb2InAPCreationEnabled && !isValidTagFilterExpression)
          }
        >
          {t('in-applications:creation.advanced.create')}
        </SaveButton>
      </FormFooter>
    </>
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

function removeMatchSpecification(i, form, updateForm) {
  updateForm(form.updateIn(['matchSpecification'], list => list.remove(i).setTouched(true)));
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

function setTagFilterExpression(tagFilterExpression, form, updateForm) {
  updateForm(form.updateIn(['tagFilterExpression'], field => field.setValue(tagFilterExpression)));
}
