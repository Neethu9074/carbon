/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Link } from '@instana/components';

import Applications, {
  getSelectedApplicationsForAlert,
  applicationSelectionTableActions,
  submitApplicationSelection,
  noRightHeader
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/components/Applications';
import {
  applyOnOptionsForHostAvailability,
  applyOnOptions,
  scopeEverything,
  scopeDfq,
  scopeHostsByTag,
  scopeApplication
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/shared';
import {
  onChangeApplyOn,
  isHostAvailabilitySystemRule
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import InputWithDFQSelectionList from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/components/InputWithDFQSelectionList';
import ScopeHostsByTagFormGroup from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/ScopeHostsByTagFormGroup';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import BackendValidationMessages from 'in-components/form/BackendValidationMessages';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import FormGroup from 'in-settings/components/FormGroup';
import { Row, Col } from 'in-components/layout/Grid';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import { t, Trans } from 'in-i18n';

import locals from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/ScopeSelection.mless';

export default function ScopeSelection({
  form,
  selectedApplicationIds,
  disabled,
  onChange,
  queryValidationInProgress,
  setQueryValidationInProgress,
  startQueryValidation,
  setSaveEnabled,
  setForm
}) {
  return (
    <>
      <Row>
        <Col lg={6}>
          {form.get('applyOn').map(field => (
            <FormGroup>
              <Label htmlFor="event-apply-on" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.applyOnRequired')}
              </Label>
              <ComboBox
                name="event-apply-on"
                value={field.value}
                options={isHostAvailabilitySystemRule(form) ? applyOnOptionsForHostAvailability : applyOnOptions}
                isClearable={false}
                onChange={e => onChangeApplyOn(e ? e.value : null, onChange)}
                isDisabled={disabled}
              />
              <TouchedMessages field={field} />
              {form.get('applyOn').value === scopeEverything && (
                <DescriptionText>
                  <Trans i18nKey="in-settings:tabs.thisWillMatchAndCreateIssuesOnAllAvailableEntitiesForTheConditionsSpecified" />
                </DescriptionText>
              )}
            </FormGroup>
          ))}
        </Col>
        <Col lg={6}>
          {form.get('applyOn').value === scopeDfq &&
            form.get('query').map(field => (
              <FormGroup>
                <Label htmlFor="event-query" hasError={!field.valid && field.touched}>
                  {t('in-settings:tabs.dynamicFocusQuery')}
                </Label>
                <InputWithDFQSelectionList
                  disabled={disabled}
                  id={'event-query'}
                  placeholder={t('in-settings:tabs.formatExample', {
                    format: 'entity.zone:"prod" AND entity.service.name:"Shop"'
                  })}
                  value={field.value || ''}
                  hasError={form.get('validationResult') && !form.get('validationResult').value.valid}
                  onChange={value => {
                    onChange('query', value, updatedForm => {
                      return startQueryValidation(
                        value,
                        updatedForm,
                        onChange,
                        setQueryValidationInProgress,
                        setSaveEnabled
                      );
                    });
                  }}
                  positionAbove
                />
                {queryValidationInProgress && <LoadingIndicator className={locals.queryLoading} inline />}
                <BackendValidationMessages validationResult={form.get('validationResult').value} />
                <TouchedMessages field={field} />
                <DescriptionText>
                  <Trans
                    i18nKey="in-settings:tabs.aNonEmptyFilterQueryWhichDefinesForWhichEntitiesTheRuleWillBeApplied"
                    components={{
                      docLink: (
                        <Link
                          href="https://www.ibm.com/docs/en/obi/current?topic=instana-filtering-dynamic-focus#syntax"
                          external
                        />
                      )
                    }}
                  />
                </DescriptionText>
              </FormGroup>
            ))}
          {isHostAvailabilitySystemRule(form) && form.get('applyOn').value === scopeHostsByTag && (
            <ScopeHostsByTagFormGroup form={form} onChange={onChange} disabled={disabled} />
          )}
        </Col>
      </Row>
      {form.get('applyOn').value === scopeApplication &&
        form.get('applicationIds').map(field => (
          <FormGroup>
            <Applications
              setTitle={false}
              loadEntities={() => getSelectedApplicationsForAlert(selectedApplicationIds)}
              hasRowNavigation={false}
              noDataMessage={t('in-settings:tabs.noApplicationPerspectivesSelected')}
              tableActions={!disabled && applicationSelectionTableActions(form, setForm)}
              rightHeader={
                !disabled && (
                  <SelectListDialogButton
                    form={form}
                    onSubmit={selectedIds => submitApplicationSelection(form, setForm, selectedIds)}
                    title={t('in-settings:tabs.addApplicationPerspectives')}
                    label={t('in-settings:tabs.addApplicationPerspectives')}
                    listComponent={Applications}
                    listComponentRightHeader={noRightHeader}
                    limit={10}
                    hiddenIds={selectedApplicationIds}
                    createSubmitLabel={numberOfItems =>
                      numberOfItems > 0
                        ? t('in-settings:tabs.addNumberOfItemsApplicationPerspective', { count: numberOfItems })
                        : t('in-settings:tabs.add')
                    }
                    requiresAtLeastOneMessage={t('in-settings:tabs.pleaseSelectAtLeastOneApplicationPerspectives')}
                  />
                )
              }
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
    </>
  );
}
