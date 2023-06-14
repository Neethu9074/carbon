/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { Result, SyntheticLocation } from '@instana/types/typeDefinitions';
import { Observable } from '@instana/observables';
import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

// eslint-disable-next-line no-restricted-imports
import SelectListDialogContentComponent from 'in-settings/tabs/TeamSettings/components/SelectListDialogContent';
import memoize, { ObservableCreator, TtiGenerator } from 'in-services/util/memoizingObservableGenerator';
import ConfigSlideContentWrapper from 'in-synthetics/createTests/advanced/ConfigSlideContentWrapper';
import { LocationsListProps } from 'in-synthetics/createTests/advanced/LocationsSection';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import LocationsSection from 'in-synthetics/createTests/advanced/LocationsSection';
import { SliderState } from 'in-synthetics/createTests/TestConfigDialogPresenter';
import SlideInView, { NoHeader } from 'in-components/SlideInView/SlideInView';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import { getLocationsAsResultObservable } from 'in-synthetics/api';
import SaveButton from 'in-components/form/SaveButton';

import locals from 'in-synthetics/createTests/advanced/ConfigureLocations.mless';

interface ConfigureLocationsProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  setSliderState: (state: SliderState) => void;
  syntheticType: string;
}

function createMemoizedObservableForReferencedLocations<RESULT>(
  createObservable: ObservableCreator<string[], RESULT>,
  tti: number | TtiGenerator<string[], RESULT> = 60000
) {
  return memoize(
    createObservable,
    // generate cache ID by concatenating all referenced IDs
    arrayOfIds => (arrayOfIds == null ? 'null' : arrayOfIds.join(':')),
    tti
  );
}

export default function ConfigureLocations({
  form,
  updateForm,
  setSliderState,
  syntheticType
}: ConfigureLocationsProps) {
  const EMPTY = [] as SyntheticLocation[];
  const getSelectedLocations = createMemoizedObservableForReferencedLocations(locationIds => {
    return getLocationsAsResultObservable(syntheticType)
      .map((result: Result<SyntheticLocation[]> | null) => {
        if (result == null) {
          return EMPTY;
        }
        return (result as Result<SyntheticLocation[]>)?.data?.filter(
          (location: SyntheticLocation) => locationIds.filter(ids => ids === location.id).length > 0
        );
      })
      .map(result => result ?? EMPTY);
  });

  const locations = getLocationsAsResultObservable(syntheticType)
    .map((result: Result<SyntheticLocation[]> | null) => {
      if (result == null) {
        return EMPTY;
      }
      return (result as Result<SyntheticLocation[]>)?.data;
    })
    .map(result => result ?? EMPTY);

  const loadEntities = () => getSelectedLocations((form.get('locations') as Field<string[]>).value ?? []);

  return (
    <>
      <LocationsSection
        setTitle={false}
        // @ts-expect-error
        loadEntities={loadEntities ? loadEntities : () => locations}
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
                      locations={locations}
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
  form: MapForm<any>;
  onSubmit: (selectedIds: string[]) => void;
  setSliderState: (state: SliderState) => void;
  setCustomSlideInHeaderConfig?: (state: { title: string | null; onClose: (() => void) | null }) => void;
  numberOfLocationListRows: number;
  locations: Observable<SyntheticLocation[]>;
}

function SelectListDialogContent({
  form,
  onSubmit,
  setSliderState,
  numberOfLocationListRows,
  locations
}: SelectListDialogContentProps) {
  const initialState = false;
  const [slideInContentVisible, setSlideInContentVisible] = useState(initialState);

  const LoadingListComponent = (props: Omit<LocationsListProps, 'loadEntities'>) => (
    <LocationsSection {...props} loadEntities={() => locations} />
  );

  return (
    <SlideInView
      staticContent={
        <ConfigSlideContentWrapper>
          <SelectListDialogContentComponent
            listComponent={LoadingListComponent}
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

function locationTestSelectionTableActions(form: MapForm<any>, updateForm: (form: MapForm<any>) => void) {
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
