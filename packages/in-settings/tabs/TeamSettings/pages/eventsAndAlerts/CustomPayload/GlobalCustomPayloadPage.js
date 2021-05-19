/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import { uniqBy } from 'lodash';

import { createLogger } from '@instana/logger';
import { useObservable } from '@instana/hooks';
import { Link } from '@instana/components';

import {
  deleteItemColumnDefinition,
  valueColumnDefinition,
  keyColumnDefinition,
  typeColumnDefinition
} from 'in-alerting/components/CustomPayload/customPayloadColumnDefinitions';
import {
  addItemAlertCustomPayloadTracker,
  editAlertCustomPayloadTracker,
  removeItemAlertCustomPayloadTracker,
  submitAlertCustomPayloadTracker
} from 'in-settings/tracker';
import {
  useSaveToServerHandler,
  initialState
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/useSaveToServerHandler';
import {
  getGlobalCustomPayloadAsResultObservable,
  saveGlobalCustomPayload
} from 'in-settings/tabs/TeamSettings/api/customPayload';
import { createNewFormEntry, createForm } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import CustomPayloadTable from 'in-alerting/components/CustomPayload/CustomPayloadTable';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { isLoading, hasError } from 'in-services/util/result';
import Notification from 'in-components/form/Notification';
import SaveCancel from 'in-settings/components/SaveCancel';
import { pendingResult } from 'in-services/fixedObjects';
import { emptyArray } from 'in-services/fixedObjects';
import Section from 'in-settings/components/Section';
import Message from 'in-new-components/Message';
import Title from 'in-components/Title';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

const logger = createLogger('customPayloadConfig');

export default function GlobalCustomPayloadPage() {
  const result = useObservable(getGlobalCustomPayloadAsResultObservable, []) ?? pendingResult;
  const { savingState, save } = useSaveToServerHandler(saveGlobalCustomPayload, logger);

  if (isLoading(result)) {
    return null;
  }

  return <CustomPayload result={result} save={save} savingState={savingState} />;
}

export function CustomPayload(props) {
  const { result, save, savingState } = props;
  const [form, setForm] = useState(createForm(result?.data?.fields ?? []));
  const { message, error, storing } = savingState ?? initialState;

  const { canConfigureGlobalAlertPayload } = role;
  const tableColumnDefinitions = [keyColumnDefinition, typeColumnDefinition, valueColumnDefinition];
  const columnDefinitions = canConfigureGlobalAlertPayload
    ? [...tableColumnDefinitions, deleteItemColumnDefinition]
    : tableColumnDefinitions;

  const enabled = canConfigureGlobalAlertPayload && !storing && !hasError(result) && !isLoading(result);

  return (
    <SettingsDetailPage>
      <Title title={t('in-settings:tabs.configureCustomPayloadForAlerts')} />
      <SubViewHeader>{t('in-settings:tabs.configureCustomPayload')}</SubViewHeader>
      <Section>
        <Message withIcon small>
          <Trans
            i18nKey="in-settings:tabs.eachKeyValuePairWillBeIncludedAsAdditionalPayload"
            components={{
              docLink: <Link href="https://instana.com/docs/events_alerts/custom-payload" external />
            }}
          />
        </Message>
      </Section>
      {!canConfigureGlobalAlertPayload && (
        <Message withIcon small>
          {t('in-settings:tabs.youAreNotPermittedToEditCustomPayloads')}
        </Message>
      )}
      <form onSubmit={onSubmit}>
        <CustomPayloadTable
          getRowIndex={getRowIndex}
          columnDefinitions={columnDefinitions}
          isSearchable={false}
          addRow={addRow}
          deleteRow={deleteRow}
          updateIn={updateIn}
          result={mergeResultWithPayloadForm(form, result)}
          customPayloadForm={form}
          canConfigureAlertPayload={canConfigureGlobalAlertPayload}
          enabled={enabled}
          trackChange={editAlertCustomPayloadTracker}
        />

        {message ? (
          <Section>
            <Notification failure={error} loading={storing}>
              {error ? t('in-settings:tabs.anErrorOccurredPleaseTryAgain') : message}
            </Notification>
          </Section>
        ) : null}

        <SaveCancel
          form={{
            // TODO SaveCancel button needs to be tweaked like this or needs to be replaced later
            ...form,
            hierarchyValid: true
          }}
          loading={storing}
          hasCancelButton={false}
          saveEnabled={enabled && form.touched}
          message={message}
        />
      </form>
    </SettingsDetailPage>
  );

  function getRowIndex(payloadField) {
    return form.reduce((acc, item, i) => (item === payloadField ? i : acc), -1);
  }

  function updateIn(paths, changeField) {
    setForm(form.updateIn(paths, f => changeField(f).setTouched(true)).setTouched(true));
  }

  function addRow() {
    setForm(form.push(createNewFormEntry()).setTouched(true));
    addItemAlertCustomPayloadTracker({});
  }

  function deleteRow(payloadField) {
    const entryPosition = getRowIndex(payloadField);

    if (entryPosition >= 0) {
      setForm(form.remove(entryPosition).setTouched(true));
      removeItemAlertCustomPayloadTracker({
        type: payloadField.get('type').value
      });
    }
  }

  function onSubmit(event) {
    event.preventDefault();

    setForm(form.setTouched(true, { recurse: true }));

    if (!form.hierarchyValid) {
      return false;
    }
    const fields = form.toJS().map(toServerItemModel);
    save({ fields });

    submitAlertCustomPayloadTracker({
      itemTypes: uniqBy(fields.map(f => f.type)).join(', ')
    });
  }
}

function mergeResultWithPayloadForm(form, result) {
  if (hasError(result)) {
    return {
      ...result,
      errors: emptyArray,
      data: { items: [] }
    };
  }

  return {
    ...result,
    data: {
      items: form.items
    }
  };
}

function toServerItemModel(item = {}) {
  const { key, type, value } = item;

  return { key, type, value };
}
