/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment, useMemo } from 'react';
import { MapForm } from 'formalistic';
import { fromJS } from 'immutable';
import { filter } from 'lodash';

import { Spacer, Message, MessageTypes } from '@instana/components';
import { EventSpecificationInfo } from '@instana/types';
import { Observable } from '@instana/observables';

import { disallowAppDataLegacyEventsEnabled, hideAppDataLegacyEventsEnabled } from 'in-services/featureFlags';
import { limitForConnectedEvents } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/Alert';
import SelectListDialogButton from 'in-settings/tabs/GlobalSettings/components/SelectListDialogButton';
import Events from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/Events';
import { getEventSpecificationsMutable } from 'in-api/eventSpecifications';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { t } from 'in-i18n';

function getSelectedEventsForAlert(selectedEvents: string[], eventConfigs: Observable<EventSpecificationInfo[]>) {
  if (selectedEvents.length === 0) {
    return alwaysEmptyArray;
  }
  return eventConfigs.map((events: EventSpecificationInfo[]) =>
    filter(events, app => selectedEvents.indexOf(app.id) >= 0)
  );
}

function eventSelectionTableActions(form: MapForm<any>, setForm: SetFormFunction) {
  return {
    deselect: {
      deselect: (deselectedEntity: any) => {
        if (deselectedEntity) {
          form = form.updateIn(['selectedEvents'], field => {
            return field.setValue(
              field.value.filterNot((referencedId: string) => referencedId === deselectedEntity.id)
            );
          });
          setForm(form);
        }
      }
    }
  };
}

function submitEventSelection(form: MapForm<any>, setForm: SetFormFunction, selectedIds: string[]) {
  setForm(
    form.updateIn(['selectedEvents'], field => {
      return field.setValue(field.value.concat(fromJS(selectedIds)));
    })
  );
}

type SetFormFunction = (form: MapForm<any>) => void;

interface Props {
  form: MapForm<any>;
  setForm: SetFormFunction;
}

export default function EventsSelection({ form, setForm }: Props) {
  const selectedEvents = form.get('selectedEvents')?.value.toJS() ?? [];
  const eventConfigs = useMemo(() => {
    return getEventSpecificationsMutable();
  }, []);

  return (
    <Fragment>
      <Events
        setTitle={false}
        loadEntities={() => getSelectedEventsForAlert(selectedEvents, eventConfigs)}
        hasRowNavigation={false}
        noDataMessage={t('in-settings:tabs.noEventsSelected')}
        tableActions={eventSelectionTableActions(form, setForm)}
        pageSize={10}
        rightHeader={
          <SelectListDialogButton
            form={form}
            onSubmit={selectedIds => submitEventSelection(form, setForm, selectedIds)}
            title={t('in-settings:tabs.addEvents')}
            label={t('in-settings:tabs.addEvents')}
            renderCustomCloseBehaviour={() =>
              disallowAppDataLegacyEventsEnabled && !hideAppDataLegacyEventsEnabled ? (
                <Message type={MessageTypes.neutral} small withIcon>
                  {t('in-settings:tabs.depreactedEventHiddenInfo')}
                </Message>
              ) : null
            }
            listComponent={(props: any) => (
              <Events
                {...props}
                loadEntities={() => eventConfigs}
                withoutAppDataLegacyEvents={disallowAppDataLegacyEventsEnabled}
              />
            )}
            hiddenIds={selectedEvents}
            limit={limitForConnectedEvents}
            createSubmitLabel={numberOfItems =>
              numberOfItems > 0
                ? t('in-settings:tabs.addNumberOfItemsEvent', { count: numberOfItems })
                : t('in-settings:tabs.addEvents')
            }
            requiresAtLeastOneMessage={t('in-settings:tabs.pleaseSelectAtLeastOneEvent')}
          />
        }
      />
      <TouchedMessages field={form.get('selectedEvents')} />
      <Spacer vertical="large" />
    </Fragment>
  );
}
