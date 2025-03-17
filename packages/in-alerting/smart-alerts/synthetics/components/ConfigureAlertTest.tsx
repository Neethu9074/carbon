/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Item, Field } from 'formalistic';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Result, SyntheticTest } from '@instana/types';
import { Button } from '@instana/components';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import AlertConfigSlideInContentWrapper from 'in-alerting/smart-alerts/components/dialog/AlertConfigSlideInContentWrapper';
import SelectListDialogContentComponent from 'in-settings/tabs/GlobalSettings/components/SelectListDialogContent';
import { SliderState } from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import TestSummaryList from 'in-alerting/smart-alerts/synthetics/components/TestSummaryList';
import AlertTestsList from 'in-alerting/smart-alerts/synthetics/components/AlertTestsList';
import NoItemSelected from 'in-alerting/smart-alerts/components/NoItemSelected';
import SlideInView, { NoHeader } from 'in-components/SlideInView/SlideInView';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { getTestsAsResultObservable } from 'in-synthetics/api';
import SaveButton from 'in-components/form/SaveButton';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/synthetics/components/ConfigureAlertTest.mless';

export const limitForConnectedAlertTests = 100;

export interface ConfigureAlertChannelProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  setSliderState: (state: SliderState) => void;
  setCustomSlideInHeaderConfig: (state: { title: string | null; onClose: (() => void) | null }) => void;
  numberOfAlertTestListRows?: number;
}

export default function ConfigureAlertTest({
  form,
  onChange,
  setSliderState,
  setCustomSlideInHeaderConfig,
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
          <NoItemSelected text={t('in-alerting:smartAlerts.synthetics.selectTests.noTestSelectedText')} />
        )}
        tableActions={alertTestSelectionTableActions(form, onChange)}
        rightHeader={
          <Button
            className={locals.selectButton}
            kind="action"
            onClick={() =>
              setSliderState({
                slideInConfig: {
                  component: (
                    <SelectListDialogContent
                      form={form}
                      onSubmit={(selectedIds: string[]) => {
                        const currentAlertTestIds = (form.get('syntheticTestIds') as Field<string[]>)?.value ?? [];
                        onChange(['syntheticTestIds'], field =>
                          (field as Field<string[]>).setValue(currentAlertTestIds.concat(selectedIds)).setTouched(true)
                        );
                        setSliderState({ isVisible: false });
                      }}
                      numberOfAlertTestListRows={numberOfAlertTestListRows}
                      setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
                      setSliderState={setSliderState}
                    />
                  ),
                  title: t('in-alerting:smartAlerts.synthetics.selectTests.selectAlertTestButtonTitle')
                },
                isVisible: true
              })
            }
            icon="lib_openclose_add_circle_outline"
          >
            {t('in-alerting:smartAlerts.synthetics.selectTests.selectAlertTestButton')}
          </Button>
        }
      />
      <TouchedMessages field={form.get('syntheticTestIds')} />
    </>
  );
}

export interface SelectListDialogContentProps {
  form: MapForm<any>;
  onSubmit: (selectedIds: string[]) => void;
  setSliderState: (state: SliderState) => void;
  setCustomSlideInHeaderConfig: (state: { title: string | null; onClose: (() => void) | null }) => void;
  numberOfAlertTestListRows: number;
}

function SelectListDialogContent({
  form,
  onSubmit,
  setSliderState,
  setCustomSlideInHeaderConfig,
  numberOfAlertTestListRows
}: SelectListDialogContentProps) {
  const initialState = false;
  const [slideInContentVisible, setSlideInContentVisible] = useState(initialState);

  return (
    <SlideInView
      staticContent={
        <AlertConfigSlideInContentWrapper>
          <SelectListDialogContentComponent
            listComponent={props => <TestSummaryList tableActions={props.tableActions} hiddenIds={props.hiddenIds} />}
            hiddenIds={(form.get('syntheticTestIds') as Field<string[]>)?.value ?? []}
            limit={limitForConnectedAlertTests}
            onSubmit={onSubmit}
            requiresAtLeastOneMessage={' '}
            renderCustomFormActions={numberOfItems => {
              return (
                <DialogFooter
                  form={form}
                  onSecondaryActionClick={() =>
                    setSliderState({
                      slideInConfig: {},
                      isVisible: false
                    })
                  }
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
              );
            }}
            pageSize={numberOfAlertTestListRows}
            preventCloseOnSubmit
          />
        </AlertConfigSlideInContentWrapper>
      }
      showSlideInContent={slideInContentVisible}
      onShowSlideInContentChange={setSlideInContentVisible}
      HeaderComponent={NoHeader}
      enforceMaxHeightForStaticContent
      onAfterSlideOut={() => {
        setCustomSlideInHeaderConfig({
          title: null,
          onClose: null
        });
      }}
    />
  );
}

export function alertTestSelectionTableActions(
  form: MapForm<any>,
  onChange: (path: string[], updater: (item: Item) => Item) => void
) {
  return {
    deselect: {
      deselect: (deselectedEntity: SyntheticTest) => {
        if (deselectedEntity) {
          const value = (form.get('syntheticTestIds') as Field<string[]>)?.value.filter(
            referencedId => referencedId !== deselectedEntity.id
          );
          onChange(['syntheticTestIds'], field => (field as Field<string[]>).setValue(value).setTouched(true));
        }
      }
    }
  };
}

ConfigureAlertTest.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  setSliderState: PropTypes.func.isRequired,
  setCustomSlideInHeaderConfig: PropTypes.func.isRequired,
  numberOfAlertTestListRows: PropTypes.number
};
