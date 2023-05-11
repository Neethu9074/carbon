/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { MapForm } from 'formalistic';

import { Spacer, Message, MessageTypes } from '@instana/components';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import { disallowAppDataLegacyEventsEnabled, hideAppDataLegacyEventsEnabled } from 'in-services/featureFlags';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import Events from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/Events';
import { getEventSpecificationByIds } from 'in-api/eventSpecifications';
import SectionHeading from 'in-settings/components/SectionHeading';
import { SetFormFunction } from 'in-settings/hooks/useEntityForm';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { t } from 'in-i18n';

interface ActionFormProps {
  form: MapForm<any>;
  setForm: SetFormFunction;
}

interface submitEventSelectionProps extends ActionFormProps {
  selectedIds: string[];
}

export default function EventSelection({ form, setForm }: Pick<ActionFormProps, 'form' | 'setForm'>) {
  return (
    <Fragment>
      <SectionHeading>{t('in-automation:ActionCatalog.ActionAssociationsForEvent')}</SectionHeading>
      <EventsSelection form={form} setForm={setForm} />
    </Fragment>
  );
}

const getSelectedEventsForAlert = createMemoizedObservableForReferencedEntities(function (selectedEvents) {
  if (selectedEvents.length === 0) {
    return alwaysEmptyArray;
  }

  // null is treated as a pending result when converting the HTTP response into a result
  return getEventSpecificationByIds(selectedEvents).startWith(null);
});

function eventSelectionTableActions({ form, setForm }: Pick<ActionFormProps, 'form' | 'setForm'>) {
  return {
    deselect: {
      deselect: (deselectedEntity: any) => {
        if (deselectedEntity) {
          form = form.updateIn(['selectedEvents'], field => {
            return field.setValue(field.value.filter((referencedId: any) => referencedId !== deselectedEntity.id));
          });
          setForm(form);
        }
      }
    }
  };
}

function submitEventSelection({ form, setForm, selectedIds }: submitEventSelectionProps) {
  setForm(
    form.updateIn(['selectedEvents'], field => {
      return field.setValue(field.value.concat(selectedIds));
    })
  );
}

function EventsSelection({ form, setForm }: Pick<ActionFormProps, 'form' | 'setForm'>) {
  const selectedEvents = form.get('selectedEvents')?.value ?? [];

  return (
    <Fragment>
      <Events
        setTitle={false}
        loadEntities={() => getSelectedEventsForAlert(selectedEvents)}
        hasRowNavigation={false}
        noDataMessage={t('in-settings:tabs.noEventsSelected')}
        tableActions={eventSelectionTableActions({ form, setForm })}
        pageSize={10}
        rightHeader={
          <SelectListDialogButton
            form={form}
            onSubmit={selectedIds => submitEventSelection({ form, setForm, selectedIds })}
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
              <Events {...props} withoutAppDataLegacyEvents={disallowAppDataLegacyEventsEnabled} />
            )}
            hiddenIds={selectedEvents}
            // limit={limitForConnectedEvents}
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
