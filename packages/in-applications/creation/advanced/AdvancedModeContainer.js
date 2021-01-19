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
import ApplicationScopeSelector from 'in-applications/creation/components/ApplicationScopeSelector';
import EditTagFilterDialog from 'in-analyze/components/EditTagFilterDialog/EditTagFilterDialog';
import FormFooter, { SaveButton, CancelButton } from 'in-components/form/FormFooter/FormFooter';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import InboundAllCalls from 'in-applications/creation/components/InboundAllCalls';
import TagFilterList from 'in-analyze/AnalyzeView/components/TagFilterList';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getApplicationCreationTagKeys } from 'in-applications/tags';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import Spacer from 'in-applications/Forms/components/Spacer';
import { entityTypes } from 'in-analyze/applicationFilter';
import { getColor } from 'in-applications/endpointTypes';
import FormGroup from 'in-components/form/FormGroup';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Pill from 'in-new-components/Pill';

import locals from './AdvancedModeContainer.mless';

export default function AdvancedModeContainer({ form, updateForm, timeConfig, onClose, onCreate, isSaving }) {
  const labelField = form.get('label');

  const tagFiltersForSubscription = getTagFilterListForBackendSubscription(form.get('matchSpecification').toJS());
  const filters = {
    timeConfig,
    tagFilter: tagFiltersForSubscription
  };

  const conjunctions = form.toJS().matchSpecification?.map(item => item.conjunction);

  return (
    <>
      <div className={locals.container}>
        <h1 className={locals.heading}>1. Define a name for your Application Perspective.</h1>
        <FormGroup>
          <Label htmlFor="label" hasError={!labelField.valid && labelField.touched}>
            Application Perspective Name
          </Label>
          <Input
            type="text"
            id="label"
            value={labelField.value}
            onChange={e =>
              updateForm(form.updateIn(['label'], field => field.setValue(e.target.value || '').setTouched(true)))
            }
            autoComplete="off"
            hasError={!labelField.valid && labelField.touched}
            autoFocus
          />
          <TouchedMessages field={labelField} />

          <DescriptionText className={locals.descriptionText}>
            {`Application Perspective names should have a well established definition within an organization. For example,
                      to model an environment: "Production Blue", to model a set of services: "Payment", or to model a
                      tenant: "ACME Customer".`}
          </DescriptionText>
        </FormGroup>
        <Spacer type="dark" />

        <>
          <h1 className={locals.heading}>2. Define the Application Perspective using one or more tags.</h1>
          <DescriptionText className={locals.descriptionText}>
            {`For example where key is "docker.label" and value is "environment=Production Blue",
                            or key is "call.http.params" and value is "tenant=ACMECustomer". Note that any calls to a`}
            <Pill color={getColor('DATABASE')} kind="light">
              DATABASE
            </Pill>
            service or
            <Pill color={getColor('MESSAGING')} kind="light">
              MESSAGING
            </Pill>
            service from services matching this definition will automatically be included.
            <br />
            <br />
            <strong>AND operators take precedence and are evaluated before OR operators</strong>
          </DescriptionText>

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
              Add Tag
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
        <Spacer type="dark" />
        <h1 className={locals.heading}>3. Store Calls of Downstream Services</h1>
        <ApplicationScopeSelector
          form={form}
          updateForm={updateForm}
          description={
            <DescriptionText className={locals.descriptionText}>
              Choose which downstream services to include in the Application Perspective.
            </DescriptionText>
          }
        />
        <Spacer type="dark" />
        <h1 className={locals.heading}>4. Select the Default Dashboard View</h1>
        <InboundAllCalls form={form} updateForm={updateForm} apCreation />
      </div>
      <FormFooter className={locals.controls}>
        <CancelButton onClick={() => onClose()} />
        <SaveButton onClick={() => onCreate()} isSaving={isSaving} form={form} disabled={!form.hierarchyValid}>
          Create
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
