/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';
import { MapForm } from 'formalistic';
import { Field } from 'formalistic';

import { Observable } from '@instana/observables';
import { Spacer } from '@instana/components';

import {
  simpleListNameColumnDefinition,
  evaluationInfoColumnDefinition,
  entityNameColumnDefinition
} from 'in-alerting/smart-alerts/applications/list/columns/columnDefinitions';
import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
// import memoize from 'in-services/util/memoizingObservableGenerator';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { getAllAlertConfigsForAllApplications } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import { sortOptions } from 'in-alerting/smart-alerts/applications/list/constants';
import SmartAlertsBaseList from 'in-automation/ActionCatalog/SmartAlertsBaseList';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { t } from 'in-i18n';

// import { filter } from 'lodash';

type SetForm = React.Dispatch<React.SetStateAction<MapForm<any>>>;
function actionSelectionTableActions(form: MapForm<any>, setForm: SetForm) {
  return {
    deselect: {
      deselect: (deselectedEntity: any) => {
        if (deselectedEntity) {
          setForm(
            form.updateIn(['applicationAlertConfigIds'], field => {
              return (field as any)
                .setValue((field as any).value.filter((referencedId: any) => referencedId !== deselectedEntity.id))
                .setTouched(true);
            })
          );
        }
      }
    }
  };
}

function submitActionSelection(form: MapForm<any>, setForm: SetForm, selectedIds: string[]) {
  setForm(
    form.updateIn(['applicationAlertConfigIds'], field => {
      return field.setValue(field.value.concat(selectedIds)).setTouched(true);
    })
  );
}

const getSelectedActionsForEvent = createMemoizedObservableForReferencedEntities(function (selectedActions: string[]) {
  if (selectedActions.length === 0) {
    return alwaysEmptyArray as unknown as Observable<any>;
  }
  return getAllAlertConfigsForAllApplications(selectedActions, { asObservable: true });
});

const getSelectedActionsForAll = createMemoizedObservableForReferencedEntities(function (selectedActions: string[]) {
  return getAllAlertConfigsForAllApplications(selectedActions, { asObservable: true });
});

interface ActionsSelectionProps {
  form: MapForm<any>;
  setForm: any;
  // name?: string;
  // description?: string;
}
export default function SmartAlertsSelection({ form, setForm }: ActionsSelectionProps) {
  const selectedActions = (form.get('applicationAlertConfigIds') as Field<string[]>)?.value ?? [];

  // function getColumnDefinitionsForList(selection, onChange, isGlobalSmartAlertConfig) {
  //   return [
  //     selectActionColumnDefinition(selection, (id, state) => {
  //       if (state) {
  //         onChange([...selection, id]);
  //       } else {
  //         onChange(selection.filter(i => i !== id));
  //       }
  //     }),
  //     simpleListNameColumnDefinition('70%'),
  //     evaluationInfoColumnDefinition({ width: '25%', isGlobalSmartAlertConfig })
  //   ];
  // }

  const RightHeader = (
    <SelectListDialogButton
      form={form}
      onSubmit={(selectedIds: string[]) => submitActionSelection(form, setForm, selectedIds)}
      title={t('in-settings:tabs.addActions')}
      label={t('in-settings:tabs.addActions')}
      listComponent={(props: any) => (
        <SmartAlertsBaseList
          getAlertConfigs={() => getSelectedActionsForAll([])}
          noDataMessage={t('in-settings:tabs.noActionsSelected')}
          pageSize={10}
          sortOptions={sortOptions}
          columnDefinitions={getColumnDefinitions()}
          {...props}
        />
      )}
      hiddenIds={selectedActions}
      createSubmitLabel={(numberOfItems: number) =>
        numberOfItems > 0
          ? t('in-settings:tabs.addNumberOfItemsAction', { count: numberOfItems })
          : t('in-settings:tabs.addActions')
      }
      requiresAtLeastOneMessage={t('in-settings:tabs.pleaseSelectAtLeastOneAction')}
    />
  );

  function getColumnDefinitions() {
    return [
      simpleListNameColumnDefinition('50%'),
      evaluationInfoColumnDefinition('20%'),
      entityNameColumnDefinition('20%')
    ];
    // if (showDelete) {
    //   return [
    //     ...columnDefinitionsToShow,
    //     deselectActionColumnDefinition(
    //       (id: any) =>
    //         updateForm(
    //           form.updateIn(['applicationAlertConfigIds'], (f: any) => {
    //             const selection = f.value;
    //             const idx = selection.findIndex((config: any) => config === id);
    //             return idx >= 0 ? f.setValue(selection.remove(idx)).setTouched(true) : f;
    //           })
    //         ),
    //       '5%'
    //     )
    //   ];
    // }
    // return columnDefinitionsToShow;
  }

  return (
    <Fragment>
      <SmartAlertsBaseList
        loadEntities={() => getSelectedActionsForEvent(selectedActions)}
        noDataMessage={t('in-settings:tabs.noActionsSelected')}
        tableActions={actionSelectionTableActions(form, setForm)}
        pageSize={10}
        rightHeader={RightHeader}
        columnDefinitions={getColumnDefinitions()}
      />
      <TouchedMessages field={form.get('selectedActions')} />
      <Spacer vertical="large" />
    </Fragment>
  );
}
