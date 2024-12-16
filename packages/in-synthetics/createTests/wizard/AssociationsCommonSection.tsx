/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { GroupPermissionEntity, Result } from '@instana/types';
import { Button } from '@instana/components';

import {
  AssociationsCommonSectionProps,
  Entity,
  ApplicationsListProps,
  SelectListDialogContentProps
} from 'in-synthetics/utils/constants';
import { getAllApplicationsForEntitySelectionWithDefaults } from 'in-applications/subscriptions/getAllApplicationsForEntitySelection';
import { getAllMobileAppsForEntitySelectionWithDefaults } from 'in-mobile-apps/subscriptions/getAllMobileAppsForEntitySelection';
import { getAllWebsitesForEntitySelectionWithDefaults } from 'in-websites/subscriptions/getAllWebsitesForEntitySelection';
import SelectListDialogContentComponent from 'in-settings/tabs/GlobalSettings/components/SelectListDialogContent';
import ConfigSlideContentWrapper from 'in-synthetics/createTests/advanced/ConfigSlideContentWrapper';
import AssociatedEntitiesList from 'in-synthetics/createTests/wizard/AssociatedEntitiesList';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import SlideInView, { NoHeader } from 'in-components/SlideInView/SlideInView';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import SaveButton from 'in-components/form/SaveButton/SaveButton';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/wizard/AssociationsCommonSection.mless';

const noEntitiesDataAvailable = (entity: string) => {
  const entityMapping: { [key: string]: string } = {
    applications: 'Applications',
    websites: 'Websites',
    mobileApps: 'Mobile Apps'
  };
  return (
    <NoDataAvailable
      type="lib_synthetic"
      height={160}
      text={t('in-synthetics:dialog.createTest.associations.noDataAvailable.message', {
        component: entityMapping[entity]
      })}
    />
  );
};

export default function AssociationsCommonSection({
  form,
  updateForm,
  setSliderState
}: AssociationsCommonSectionProps) {
  const timeConfig = useTimeConfig();
  const EMPTY = [] as GroupPermissionEntity[];

  const allApplications = () =>
    getAllApplicationsForEntitySelectionWithDefaults({ timeConfig })
      .map((result: Result<GroupPermissionEntity[]> | null) => {
        return (result as Result<GroupPermissionEntity[]>)?.data;
      })
      .map(result => result ?? ([] as GroupPermissionEntity[]));

  const allWebsites = () =>
    getAllWebsitesForEntitySelectionWithDefaults({ timeConfig })
      .map((result: Result<GroupPermissionEntity[]> | null) => {
        return (result as Result<GroupPermissionEntity[]>)?.data;
      })
      .map(result => result ?? ([] as GroupPermissionEntity[]));

  const allMobileApps = () =>
    getAllMobileAppsForEntitySelectionWithDefaults({ timeConfig })
      .map((result: Result<GroupPermissionEntity[]> | null) => {
        return (result as Result<GroupPermissionEntity[]>)?.data;
      })
      .map(result => result ?? ([] as GroupPermissionEntity[]));

  const getSelectedApplications = (applicationIds: string[]) => {
    return getAllApplicationsForEntitySelectionWithDefaults({ timeConfig })
      .map((result: Result<GroupPermissionEntity[]> | null) => {
        if (result == null) {
          return EMPTY;
        }
        return result?.data?.filter(
          (application: GroupPermissionEntity) => applicationIds.filter(id => id === application.id).length > 0
        );
      })
      .map(result => result ?? EMPTY);
  };
  const getSelectedWebsites = (websiteIds: string[]) => {
    return getAllWebsitesForEntitySelectionWithDefaults({ timeConfig })
      .map((result: Result<GroupPermissionEntity[]> | null) => {
        if (result == null) {
          return EMPTY;
        }
        return result?.data?.filter(
          (website: GroupPermissionEntity) => websiteIds.filter(id => id === website.id).length > 0
        );
      })
      .map(result => result ?? EMPTY);
  };
  const getSelectedMobileApps = (mobileAppIds: string[]) => {
    return getAllMobileAppsForEntitySelectionWithDefaults({ timeConfig })
      .map((result: Result<GroupPermissionEntity[]> | null) => {
        if (result == null) {
          return EMPTY;
        }
        return result?.data?.filter(
          (mobileApp: GroupPermissionEntity) => mobileAppIds.filter(id => id === mobileApp.id).length > 0
        );
      })
      .map(result => result ?? EMPTY);
  };

  function entitySelectionTableActions(
    form: MapForm<any>,
    updateForm: (form: MapForm<any>) => void,
    entitySelected: string
  ) {
    return {
      deselect: {
        deselect: (deselectedEntity: GroupPermissionEntity) => {
          if (deselectedEntity) {
            const value = (form.get(entitySelected) as Field<string[]>)?.value.filter(
              referencedId => referencedId !== deselectedEntity.id
            );
            updateForm(
              form.updateIn([entitySelected], field => (field as Field<string[]>).setValue(value).setTouched(true))
            );
          }
        }
      }
    };
  }

  const entityDetails: Record<string, Entity> = {
    applications: {
      title: t('in-synthetics:dialog.createTest.associations.applicationsButtonLabel'),
      tableTitle: t('in-synthetics:dialog.createTest.associations.applicationsTableTitle'),
      allEntities: allApplications,
      getSelectedEntities: getSelectedApplications
    },
    websites: {
      title: t('in-synthetics:dialog.createTest.associations.websitesButtonLabel'),
      tableTitle: t('in-synthetics:dialog.createTest.associations.websitesTableTitle'),
      allEntities: allWebsites,
      getSelectedEntities: getSelectedWebsites
    },
    mobileApps: {
      title: t('in-synthetics:dialog.createTest.associations.mobileAppsButtonLabel'),
      tableTitle: t('in-synthetics:dialog.createTest.associations.mobileAppsTableTitle'),
      allEntities: allMobileApps,
      getSelectedEntities: getSelectedMobileApps
    }
  };
  return (
    <>
      {Object.keys(entityDetails).map(key => {
        const entity = entityDetails[key];
        return (
          <AssociatedEntitiesList
            key={key}
            title={entity.tableTitle}
            isSearchable={false}
            rightHeader={
              <Button
                className={locals.validationsBtn}
                kind="action"
                icon="lib_openclose_add_circle_outline"
                onClick={() =>
                  setSliderState({
                    slideInConfig: {
                      component: (
                        <SelectListDialogContent
                          form={form}
                          entities={entity.allEntities}
                          onSubmit={selectedIds => {
                            const currentEntityIds = (form.get(key) as Field<string[]>)?.value ?? [];
                            updateForm(
                              form.updateIn([key], field =>
                                (field as Field<string[]>)
                                  .setValue(currentEntityIds.concat(selectedIds))
                                  .setTouched(true)
                              )
                            );
                            setSliderState({ isVisible: false });
                          }}
                          numberOfEntityListRows={10}
                          setSliderState={setSliderState}
                          selectedEntity={{ key, details: entity }}
                        />
                      ),
                      title: entity.title
                    },
                    isVisible: true
                  })
                }
              >
                {entity.title}
              </Button>
            }
            loadEntities={() =>
              entity.getSelectedEntities((form.get(key) as Field<string[]>)?.value ?? []) ?? entity.allEntities
            }
            renderNoDataAvailable={() => noEntitiesDataAvailable(key)}
            tableActions={entitySelectionTableActions(form, updateForm, key)}
          />
        );
      })}
    </>
  );
}

function SelectListDialogContent({
  form,
  onSubmit,
  setSliderState,
  numberOfEntityListRows,
  entities,
  selectedEntity
}: SelectListDialogContentProps) {
  const initialState = false;
  const [slideInContentVisible, setSlideInContentVisible] = useState(initialState);

  const LoadingListComponent = (props: Omit<ApplicationsListProps, 'loadEntities'>) => {
    return (
      <AssociatedEntitiesList
        {...props}
        title={selectedEntity.details.tableTitle}
        loadEntities={entities}
        renderNoDataAvailable={() => noEntitiesDataAvailable(selectedEntity.key)}
      />
    );
  };

  const getSaveButtonLabel = (numberOfItems: number, entitySelected: string) => {
    if (numberOfItems && numberOfItems > 1) {
      switch (entitySelected) {
        case 'applications':
          return t('in-synthetics:dialog.createTest.associations.addApplications', {
            count: numberOfItems
          });
        case 'websites':
          return t('in-synthetics:dialog.createTest.associations.addWebsites', {
            count: numberOfItems
          });
        case 'mobileApps':
          return t('in-synthetics:dialog.createTest.associations.addMobileApps', {
            count: numberOfItems
          });
      }
    }
    switch (entitySelected) {
      case 'applications':
        return t('in-synthetics:dialog.createTest.associations.addApplication');
      case 'websites':
        return t('in-synthetics:dialog.createTest.associations.addWebsite');
      case 'mobileApps':
        return t('in-synthetics:dialog.createTest.associations.addMobileApp');
    }
    return;
  };

  return (
    <SlideInView
      staticContent={
        <ConfigSlideContentWrapper>
          <SelectListDialogContentComponent
            listComponent={LoadingListComponent}
            hiddenIds={(form.get(selectedEntity.key) as Field<string[]>)?.value ?? []}
            limit={1000}
            onSubmit={onSubmit}
            renderCustomFormActions={(numberOfItems: number) => {
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
                      {getSaveButtonLabel(numberOfItems, selectedEntity.key)!}
                    </SaveButton>
                  )}
                />
              );
            }}
            pageSize={numberOfEntityListRows}
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
