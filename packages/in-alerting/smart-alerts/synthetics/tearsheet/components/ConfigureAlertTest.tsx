/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm, Item, Field } from 'formalistic';
import React from 'react';

import { Result, SyntheticTest } from '@instana/types';
import { Button } from '@instana/components';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import { alertTestSelectionTableActions } from 'in-alerting/smart-alerts/synthetics/components/ConfigureAlertTest';
import SelectListDialogContentComponent from 'in-settings/tabs/GlobalSettings/components/SelectListDialogContent';
import TestSummaryList from 'in-alerting/smart-alerts/synthetics/components/TestSummaryList';
import AlertTestsList from 'in-alerting/smart-alerts/synthetics/components/AlertTestsList';
import NoItemSelected from 'in-alerting/smart-alerts/components/NoItemSelected';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { getTestsAsResultObservable } from 'in-synthetics/api';
import SaveButton from 'in-components/form/SaveButton';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/synthetics/components/ConfigureAlertTest.mless';

export const limitForConnectedAlertTests = 100;

export interface ConfigureAlertChannelProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  numberOfAlertTestListRows?: number;
}

export default function ConfigureAlertTest({
  form,
  onChange,
  numberOfAlertTestListRows = 5
}: ConfigureAlertChannelProps) {
  const getSelectedTests = createMemoizedObservableForReferencedEntities(function (alertTestIds) {
    const alertTestIdSet = new Set(alertTestIds);
    return getTestsAsResultObservable('')
      .map((result: Result<SyntheticTest[]> | null) => {
        if (result == null || result?.progress?.loading) {
          return null;
        }
        return (
          (result as Result<SyntheticTest[]>)?.data?.filter((listItem: SyntheticTest) =>
            alertTestIdSet.has(listItem?.id as string)
          ) ?? []
        );
      })
      .startWith(null);
    // null is treated as a pending result when converting the HTTP response into a result
  });

  return (
    <>
      <AlertTestsList
        // @ts-expect-error
        loadEntities={() => getSelectedTests((form.get('syntheticTestIds') as Field<string[]>)?.value ?? [])}
        renderNoDataAvailable={() => (
          <NoItemSelected text={t('in-alerting:smartAlerts.synthetics.selectTests.noTestSelectedText')} height={200} />
        )}
        tableActions={alertTestSelectionTableActions(form, onChange)}
        rightHeader={
          <Button
            className={locals.selectButton}
            kind="action"
            onClick={() => {
              addActiveDialog(
                <Dialog
                  title={t('in-alerting:smartAlerts.synthetics.selectTests.selectAlertTestButtonTitle')}
                  onClose={() => {
                    close();
                  }}
                  className={locals.dialogWidth}
                >
                  <SelectListDialogContent
                    form={form}
                    onSubmit={(selectedIds: string[]) => {
                      const currentAlertTestIds = (form.get('syntheticTestIds') as Field<string[]>)?.value ?? [];
                      onChange(['syntheticTestIds'], field =>
                        (field as Field<string[]>).setValue(currentAlertTestIds.concat(selectedIds)).setTouched(true)
                      );
                    }}
                    numberOfAlertTestListRows={numberOfAlertTestListRows}
                  />
                </Dialog>
              );
            }}
            icon="lib_openclose_add_circle_outline"
          >
            {t('in-alerting:smartAlerts.synthetics.selectTests.selectAlertTestButton')}
          </Button>
        }
        pageSize={5}
      />
      <TouchedMessages field={form.get('syntheticTestIds')} />
    </>
  );
}

export interface SelectListDialogContentProps {
  form: MapForm<any>;
  onSubmit: (selectedIds: string[]) => void;
  numberOfAlertTestListRows: number;
}

function SelectListDialogContent({ form, onSubmit, numberOfAlertTestListRows }: SelectListDialogContentProps) {
  return (
    <SelectListDialogContentComponent
      listComponent={props => (
        <TestSummaryList tableActions={props.tableActions} hiddenIds={props.hiddenIds} isTearSheet />
      )}
      hiddenIds={(form.get('syntheticTestIds') as Field<string[]>)?.value ?? []}
      limit={limitForConnectedAlertTests}
      onSubmit={onSubmit}
      requiresAtLeastOneMessage={' '}
      renderCustomFormActions={numberOfItems => {
        return (
          <div className={locals.footerPosition}>
            <DialogFooter
              form={form}
              onSecondaryActionClick={() => close()}
              secondaryActionText={t('in-alerting:smartAlerts.components.smartAlertDialog.cancelTitle')}
              renderCustomSaveAction={() => (
                <SaveButton type="submit" kind="create" disabled={!numberOfItems}>
                  {numberOfItems
                    ? t('in-alerting:smartAlerts.synthetics.selectTests.addTest', {
                        count: numberOfItems
                      })
                    : t('in-alerting:smartAlerts.components.smartAlertDialog.add')}
                </SaveButton>
              )}
            />
          </div>
        );
      }}
      pageSize={numberOfAlertTestListRows}
      preventCloseOnSubmit={false}
    />
  );
}
