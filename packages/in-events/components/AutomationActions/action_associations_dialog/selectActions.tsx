/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState, ReactNode } from 'react';
import { MapForm, Field, Item } from 'formalistic';
import { filter } from 'lodash';

import { Observable } from '@instana/observables';
import { Button } from '@instana/components';

import AlertConfigSlideInContentWrapper from 'in-alerting/smart-alerts/components/smart-alert-dialog/AlertConfigSlideInContentWrapper';
import SelectListDialogContent from 'in-settings/tabs/TeamSettings/components/SelectListDialogContent';
import ActionTable from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionTable';
import SlideInView, { NoHeader } from 'in-components/SlideInView/SlideInView';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import SaveButton from 'in-components/form/SaveButton';
import { getAllActions } from 'in-api/automation';
import { Action } from 'in-types';
import { t } from 'in-i18n';

import locals from './selectActions.mless';

interface SelectActionsProps {
  setCustomSlideInHeaderConfig: React.Dispatch<
    React.SetStateAction<{
      title: null;
      onClose: null;
    }>
  >;
  setSliderState: (component: ReactNode) => void;
  form: MapForm;
  setForm: React.Dispatch<React.SetStateAction<MapForm>>;
  numberOfActionChannelListRows: number;
}

interface SelectListDialogContentViewProps {
  numberOfActionChannelListRows: number;
  setCustomSlideInHeaderConfig: React.Dispatch<
    React.SetStateAction<{
      title: null;
      onClose: null;
    }>
  >;
  setSliderState: (component: ReactNode) => void;
  form: MapForm;
  onSubmit: (id: string[]) => void;
}

export default function SelectActions({
  form,
  setForm,
  setSliderState,
  setCustomSlideInHeaderConfig,
  numberOfActionChannelListRows = 5
}: SelectActionsProps) {
  const selectedActions = (form.get('actionIds') as Field<string[]>)?.value ?? [];
  const getSelectedActionsForEvent = (selectedActions: string[]) => {
    if (selectedActions.length === 0) {
      return (alwaysEmptyArray as unknown) as Observable<Action[]>;
    }
    return getAllActions().map(action =>
      filter(action, function(app: Action) {
        return selectedActions.indexOf(app.id) >= 0;
      })
    );
  };

  return (
    <>
      <ActionTable
        noDataMessage={t('in-settings:tabs.noActionsSelected')}
        loadEntities={() => getSelectedActionsForEvent(selectedActions)}
        tableActions={actionSelectionTableActions(form, setForm)}
        rightHeader={
          <Button
            className={locals.selectButton}
            kind="action"
            onClick={() =>
              setSliderState({
                slideInConfig: {
                  component: (
                    <SelectListDialogContentView
                      form={form}
                      onSubmit={(selectedIds: string[]) => {
                        setForm(
                          form.updateIn(['actionIds'], (field: Item) => {
                            return (field as Field<string[]>)
                              .setValue((field as Field<string[]>).value.concat(selectedIds))
                              .setTouched(true);
                          })
                        );
                        setSliderState({ isVisible: false });
                      }}
                      numberOfActionChannelListRows={numberOfActionChannelListRows}
                      setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
                      setSliderState={setSliderState}
                    />
                  ),
                  title: t('in-events:addActions')
                },
                isVisible: true
              })
            }
            icon="lib_openclose_add_circle_outline"
          >
            {t('in-events:addActions')}
          </Button>
        }
      />
      <TouchedMessages field={form.get('actionIds')} />
    </>
  );
}

function SelectListDialogContentView({
  form,
  onSubmit,
  setSliderState,
  setCustomSlideInHeaderConfig,
  numberOfActionChannelListRows = 5
}: SelectListDialogContentViewProps) {
  const [slideInContentVisible, setSlideInContentVisible] = useState(false);

  return (
    <SlideInView
      staticContent={
        <AlertConfigSlideInContentWrapper>
          <SelectListDialogContent
            listComponent={ActionTable}
            hiddenIds={(form.get('actionIds') as Field<string[]>).value}
            limit={100}
            onSubmit={onSubmit}
            requiresAtLeastOneMessage={t('in-settings:tabs.pleaseSelectAtLeastOneAction')}
            renderCustomFormActions={(numberOfItems: number) => {
              return (
                <DialogFooter
                  onSecondaryActionClick={() =>
                    setSliderState({
                      slideInConfig: {},
                      isVisible: false
                    })
                  }
                  secondaryActionText={t('in-event:cancelButton')}
                  renderCustomSaveAction={() => (
                    <SaveButton type="submit" kind="create" disabled={!numberOfItems}>
                      {numberOfItems
                        ? t('in-settings:tabs.addNumberOfItemsAction', {
                            count: numberOfItems
                          })
                        : t('in-settings:tabs.addActions')}
                    </SaveButton>
                  )}
                />
              );
            }}
            pageSize={numberOfActionChannelListRows}
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

function actionSelectionTableActions(form: MapForm, setForm: React.Dispatch<React.SetStateAction<MapForm>>) {
  return {
    deselect: {
      deselect: (deselectedEntity: Action) => {
        if (deselectedEntity) {
          setForm(
            form.updateIn(['actionIds'], (field: Item) => {
              return (field as Field<string[]>)
                .setValue(
                  (field as Field<string[]>).value.filter(
                    (referencedId: string) => referencedId !== deselectedEntity.id
                  )
                )
                .setTouched(true);
            })
          );
        }
      }
    }
  };
}
