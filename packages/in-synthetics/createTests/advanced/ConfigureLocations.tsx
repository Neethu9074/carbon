/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo, useState } from 'react';
import { Field, MapForm } from 'formalistic';

import { Result, SyntheticLocation } from '@instana/types/typeDefinitions';
import { ButtonGroup, Button } from '@instana/components';
import { Observable } from '@instana/observables';
import { t } from '@instana/i18n-react';

// eslint-disable-next-line no-restricted-imports
import SelectListDialogContentComponent from 'in-settings/tabs/GlobalSettings/components/SelectListDialogContent';
import LocationsSection, { LocationsListProps } from 'in-synthetics/createTests/advanced/LocationsSection';
import memoize, { ObservableCreator, TtiGenerator } from 'in-services/util/memoizingObservableGenerator';
import ConfigSlideContentWrapper from 'in-synthetics/createTests/advanced/ConfigSlideContentWrapper';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import SlideInView, { NoHeader } from 'in-components/SlideInView/SlideInView';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import { syntheticInstanaHostedPoPEnabled } from 'in-services/featureFlags';
import { getLocationsAsResultObservable } from 'in-synthetics/api';
import { SliderState } from 'in-synthetics/utils/constants';
import SaveButton from 'in-components/form/SaveButton';

import locals from 'in-synthetics/createTests/advanced/ConfigureLocations.mless';

export interface ConfigureLocationsProps extends RightHeaderProps {
  syntheticType: string;
}

interface RightHeaderProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  setSliderState: (state: SliderState) => void;
  locations: (syntheticType: string) => Observable<SyntheticLocation[]>;
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

export const noLocationsDataAvailable = () => {
  return (
    <NoDataAvailable
      type="lib_synthetic"
      height={160}
      text={t('in-synthetics:dashboard.locationList.noDataAvailable.message', { component: 'Locations' })}
    />
  );
};

export const selectLocationButtonElement = ({ form, updateForm, locations, setSliderState }: RightHeaderProps) => {
  return (
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
  );
};

export default function ConfigureLocations({
  form,
  updateForm,
  setSliderState,
  syntheticType,
  locations
}: ConfigureLocationsProps) {
  const EMPTY = [] as SyntheticLocation[];
  const getSelectedLocations = createMemoizedObservableForReferencedLocations(locationIds => {
    return getLocationsAsResultObservable(syntheticType)
      .map((result: Result<SyntheticLocation[]> | null) => {
        if (result == null) {
          return EMPTY;
        }
        return result?.data
          ?.filter(Boolean)
          ?.filter(location => locationIds.filter(ids => ids === location.id).length > 0);
      })
      .map(result => result ?? EMPTY);
  });

  const loadEntities = () => getSelectedLocations((form.get('locations') as Field<string[]>).value ?? []);

  return (
    <LocationsSection
      setTitle={false}
      loadEntities={loadEntities ?? locations}
      renderNoDataAvailable={() => noLocationsDataAvailable()}
      tableActions={locationTestSelectionTableActions(form, updateForm)}
      rightHeader={selectLocationButtonElement({ form, updateForm, setSliderState, locations })}
    />
  );
}

export interface SelectListDialogContentProps {
  form: MapForm<any>;
  onSubmit: (selectedIds: string[]) => void;
  setSliderState: (state: SliderState) => void;
  setCustomSlideInHeaderConfig?: (state: { title: string | null; onClose: (() => void) | null }) => void;
  numberOfLocationListRows: number;
  locations: (locationType: string) => Observable<SyntheticLocation[]>;
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
  const locationTypes = ['Private', 'Managed'];
  const [activeLocationType, setActiveLocationType] = useState(locationTypes[0]);
  const locationtypeLabels = [
    t('in-synthetics:dialog.createTest.advancedMode.selectTests.privatePoPLabel'),
    t('in-synthetics:dialog.createTest.advancedMode.selectTests.managedPoPLabel')
  ];
  const loadLocationEntities = useMemo(() => locations(activeLocationType), [locations, activeLocationType]);

  const buttonGroup = (
    <div className={locals.inline}>
      <ButtonGroup
        id="button-group-private-manage"
        buttonPropsList={locationTypes.map((locationType, index) => ({
          text: locationtypeLabels[index],
          key: locationType,
          onClick: () => setActiveLocationType(locationType)
        }))}
        activeKey={activeLocationType}
      />
    </div>
  );
  const LoadingListComponent = (props: Omit<LocationsListProps, 'loadEntities'>) =>
    syntheticInstanaHostedPoPEnabled ? (
      <LocationsSection
        {...props}
        loadEntities={() => loadLocationEntities}
        rightHeader={buttonGroup}
        renderNoDataAvailable={() => noLocationsDataAvailable()}
      />
    ) : (
      <LocationsSection
        {...props}
        loadEntities={() => locations('')}
        renderNoDataAvailable={() => noLocationsDataAvailable()}
      />
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

export function locationTestSelectionTableActions(form: MapForm<any>, updateForm: (form: MapForm<any>) => void) {
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
