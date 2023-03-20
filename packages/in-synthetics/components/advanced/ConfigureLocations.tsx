/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { Result, SyntheticLocation } from '@instana/types/typeDefinitions';
import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

// eslint-disable-next-line no-restricted-imports
import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
// eslint-disable-next-line no-restricted-imports
import SelectListDialogContentComponent from 'in-settings/tabs/TeamSettings/components/SelectListDialogContent';
import ConfigSlideContentWrapper from 'in-synthetics/components/advanced/ConfigSlideContentWrapper';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import LocationsSection from 'in-synthetics/components/advanced/LocationsSection';
import { SliderState } from 'in-synthetics/components/TestConfigDialogPresenter';
import SlideInView, { NoHeader } from 'in-components/SlideInView/SlideInView';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import { getLocationsAsResultObservable } from 'in-synthetics/api';
import SaveButton from 'in-components/form/SaveButton';

import locals from './ConfigureLocations.mless';

interface ConfigureLocationsProps {
  form: MapForm;
  updateForm: (form: MapForm) => void;
  setSliderState: (state: SliderState) => void;
}

export default function ConfigureLocations({ form, updateForm, setSliderState }: ConfigureLocationsProps) {
  const getSelectedLocations = createMemoizedObservableForReferencedEntities(locationIds => {
    return getLocationsAsResultObservable('')
      .map((result: Result<SyntheticLocation[]> | null) => {
        if (result == null) {
          return null;
        }
        return (result as Result<SyntheticLocation[]>)?.data?.filter(
          (location: SyntheticLocation) => locationIds.filter(ids => ids === location.id).length > 0
        );
      })
      .startWith(null);
  });

  return (
    <>
      <LocationsSection
        setTitle={false}
        // @ts-expect-error
        loadEntities={() => getSelectedLocations((form.get('locations') as Field<string[]>).value ?? [])}
        renderNoDataAvailable={() => (
          <NoDataAvailable
            type="lib_synthetic"
            height={160}
            text={t('in-synthetics:dashboard.locationList.noDataAvailable.message', { component: 'Locations' })}
          />
        )}
        tableActions={locationTestSelectionTableActions(form, updateForm)}
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
                        const currentLocationIds = (form.get('locations') as Field<string[]>)?.value ?? [];
                        updateForm(
                          form.updateIn(['locations'], field =>
                            (field as Field<string[]>).setValue(currentLocationIds.concat(selectedIds)).setTouched(true)
                          )
                        );
                        setSliderState({ isVisible: false });
                      }}
                      numberOfLocationListRows={10}
                      setSliderState={setSliderState}
                    />
                  ),
                  title: t('in-synthetics:dialog.createTest.advancedMode.selectTests.selectLocation')
                },
                isVisible: true
              })
            }
            icon="lib_openclose_add_circle_outline"
          >
            {t('in-synthetics:dialog.createTest.advancedMode.selectTests.selectLocation')}
          </Button>
        }
      />
    </>
  );
}

export interface SelectListDialogContentProps {
  form: MapForm;
  onSubmit: (selectedIds: string[]) => void;
  setSliderState: (state: SliderState) => void;
  setCustomSlideInHeaderConfig?: (state: { title: string | null; onClose: (() => void) | null }) => void;
  numberOfLocationListRows: number;
}

function SelectListDialogContent({
  form,
  onSubmit,
  setSliderState,
  numberOfLocationListRows
}: SelectListDialogContentProps) {
  const initialState = false;
  const [slideInContentVisible, setSlideInContentVisible] = useState(initialState);

  return (
    <SlideInView
      staticContent={
        <ConfigSlideContentWrapper>
          <SelectListDialogContentComponent
            listComponent={LocationsSection}
            hiddenIds={(form.get('locations') as Field<string[]>)?.value ?? []}
            limit={100}
            onSubmit={onSubmit}
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
                  secondaryActionText={t('in-synthetics:dialog.createTest.advancedMode.selectTests.cancel')}
                  renderCustomSaveAction={() => (
                    <SaveButton type="submit" kind="create" disabled={!numberOfItems}>
                      {numberOfItems && numberOfItems > 1
                        ? t('in-synthetics:dialog.createTest.advancedMode.selectTests.addLocations', {
                            count: numberOfItems
                          })
                        : t('in-synthetics:dialog.createTest.advancedMode.selectTests.addLocation')}
                    </SaveButton>
                  )}
                />
              );
            }}
            pageSize={numberOfLocationListRows}
            preventCloseOnSubmit
          />
        </ConfigSlideContentWrapper>
      }
      showSlideInContent={slideInContentVisible}
      onShowSlideInContentChange={setSlideInContentVisible}
      HeaderComponent={NoHeader}
      enforceMaxHeightForStaticContent
    />
  );
}

function locationTestSelectionTableActions(form: MapForm, updateForm: (form: MapForm) => void) {
  return {
    deselect: {
      deselect: (deselectedEntity: SyntheticLocation) => {
        if (deselectedEntity) {
          const value = (form.get('locations') as Field<string[]>)?.value.filter(
            referencedId => referencedId !== deselectedEntity.id
          );
          updateForm(
            form.updateIn(['locations'], field => (field as Field<string[]>).setValue(value).setTouched(true))
          );
        }
      }
    }
  };
}
