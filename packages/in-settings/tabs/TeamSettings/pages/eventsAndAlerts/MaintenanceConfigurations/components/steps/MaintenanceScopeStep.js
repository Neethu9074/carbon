/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Link } from '@instana/components';

import Applications, {
  applicationSelectionTableActions,
  getSelectedApplicationsForAlert,
  submitApplicationSelection,
  noRightHeader
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/components/Applications';
import InputWithDFQSelectionList from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/components/InputWithDFQSelectionList';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import BackendValidationMessages from 'in-components/form/BackendValidationMessages';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import DescriptionText from 'in-components/form/DescriptionText';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import { t, Trans } from 'in-i18n';

import locals from '../../MaintenanceConfigurationForm.mless';

export default function MaintenanceScopeStep(props) {
  const { form, onChange, onChangeApplyOn, setForm } = props;
  const selectedApplicationIds = form.get('applicationIds') ? form.get('applicationIds').value : [];

  return (
    <FormGroup className={locals.mwWrapper}>
      <div className={locals.inputContainer}>
        <h2 className={locals.stepTitle}>{t('in-settings:tabs.scope')}</h2>
        {form.get('applyOn').map(field => (
          <FormGroup>
            <Label htmlFor="maintenance-applyOn" hasError={!field.valid && field.touched}>
              {t('in-settings:tabs.applyOn')}
            </Label>
            <ComboBox
              name="maintenance-applyOn"
              value={field.value}
              options={[
                { value: 'application', label: t('in-settings:tabs.applicationPerspective') },
                {
                  value: 'dfq',
                  label: t('in-settings:tabs.selectedEntitiesDynamicFocusQuery')
                },
                { value: 'all', label: t('in-settings:tabs.allAvailableEntities') }
              ]}
              isClearable={false}
              onChange={e => {
                const updatedForm = onChangeApplyOn(form, e ? e.value : null);
                if (updatedForm) {
                  setForm(updatedForm);
                }
              }}
            />
            <TouchedMessages field={field} />
            {form.get('applyOn').value === 'all' && (
              <DescriptionText>
                <Trans i18nKey="in-settings:tabs.allAlertsWillBeMutedForTheDurationOfThisMaintenanceWindow" />
              </DescriptionText>
            )}
          </FormGroup>
        ))}
        {form.get('applyOn').value === 'dfq' &&
          form.get('query').map(field => (
            <FormGroup className={locals.dfqForm}>
              <Label htmlFor="maintenance-query" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.dynamicFocusQuery')}
              </Label>
              <InputWithDFQSelectionList
                id="maintenance-query"
                type="text"
                placeholder={t('in-settings:tabs.formatExample', {
                  format: 'entity.zone:"dev" AND NOT entity.host.fqdn:ip-172*'
                })}
                value={field.value}
                onChange={value => onChange('query', value)}
                hasError={form.get('validationResult') && !form.get('validationResult').value.valid}
                maxLength={2048}
              />
              {form.get('queryValidationInProgress').value && (
                <LoadingIndicator className={locals.queryLoading} inline />
              )}
              <BackendValidationMessages validationResult={form.get('validationResult').value} />
              <TouchedMessages field={field} />
              <DescriptionText>
                <Trans
                  i18nKey="in-settings:tabs.aNonEmptyFilterQueryWhichDefinesTheMatchingAlerts"
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

        {form.get('applyOn').value === 'application' &&
          form.get('applicationIds').map(field => (
            <FormGroup>
              <Applications
                setTitle={false}
                loadEntities={() => getSelectedApplicationsForAlert(selectedApplicationIds)}
                hasRowNavigation={false}
                noDataMessage={t('in-settings:tabs.noApplicationPerspectivesSelected')}
                tableActions={applicationSelectionTableActions(form, setForm)}
                rightHeader={
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
                }
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
      </div>
    </FormGroup>
  );
}
