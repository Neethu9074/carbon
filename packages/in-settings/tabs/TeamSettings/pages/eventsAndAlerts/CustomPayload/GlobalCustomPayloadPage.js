/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import { uniqBy } from 'lodash';

import { createLogger } from '@instana/logger';
import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';
import { Link } from '@instana/components';

import {
  deleteItemColumnDefinition,
  valueColumnDefinition,
  keyColumnDefinition,
  typeColumnDefinition
} from 'in-alerting/components/CustomPayload/customPayloadColumnDefinitions';
import {
  SETTINGS_ALERT_CUSTOM_PAYLOAD_ADD_ITEM,
  SETTINGS_ALERT_CUSTOM_PAYLOAD_REMOVE_ITEM,
  SETTINGS_ALERT_CUSTOM_PAYLOAD_SUBMIT
} from 'in-services/tracking/tracking';
import { createTagBasedPayloadConfigurator } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import {
  getGlobalCustomPayloadAsResultObservable,
  getCustomPayloadTagCatalog,
  saveGlobalCustomPayload
} from 'in-settings/tabs/TeamSettings/api/customPayload';
import {
  useSaveToServerHandler,
  initialState
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/useSaveToServerHandler';
import { createNewFormEntry, createForm } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import CustomPayloadTable from 'in-alerting/components/CustomPayload/CustomPayloadTable';
import getTagSuggestions from 'in-applications/subscriptions/getTagSuggestions';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { pendingResult, emptyArray } from 'in-services/fixedObjects';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { productAreas } from 'in-services/tracking/productAreas';
import { isLoading, hasError } from 'in-services/util/result';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import Notification from 'in-components/form/Notification';
import SaveCancel from 'in-settings/components/SaveCancel';
import { pageNames } from 'in-services/tracking/pageNames';
import Section from 'in-settings/components/Section';
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

  return <GlobalCustomPayload result={result} save={save} savingState={savingState} />;
}

export const GlobalTagBasedPayloadConfigurator = createTagBasedPayloadConfigurator({
  getTagCatalog: getCustomPayloadTagCatalog,
  getSuggestions
});

function getSuggestions(args) {
  return getTagSuggestions({
    tagName: args.name,
    entity: DESTINATION,
    propose: args.propose,
    filter: {
      timeConfig: args.timeConfig
    },
    tagFilterExpression: args.tagFilterExpression ?? EMPTY_EXPRESSION
  });
}

export function GlobalCustomPayload(props) {
  const {
    result,
    save,
    savingState,
    TagBasedPayloadConfigurator = GlobalTagBasedPayloadConfigurator,
    canConfigureGlobalAlertPayload = role.canConfigureGlobalAlertPayload
  } = props;
  const [form, setForm] = useState(createForm(result?.data?.fields ?? []));
  const { message, error, storing } = savingState ?? initialState;

  const tableColumnDefinitions = [keyColumnDefinition, typeColumnDefinition, valueColumnDefinition];
  const columnDefinitions = canConfigureGlobalAlertPayload
    ? [...tableColumnDefinitions, deleteItemColumnDefinition]
    : tableColumnDefinitions;

  const enabled = canConfigureGlobalAlertPayload && !storing && !hasError(result) && !isLoading(result);

  const { trackCta } = useSegmentTracking();

  return (
    <SettingsDetailPage>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.settings,
          pageRootName: pageNames.custom_payload,
          pagePath: location?.pathname
        }}
      />
      <Title title={t('in-settings:tabs.configureCustomPayloadForAlerts')} />
      <SubViewHeader>{t('in-settings:tabs.configureCustomPayload')}</SubViewHeader>
      <Section>
        <Message withIcon small fullInlineWidth>
          <span>
            <Trans
              i18nKey="in-settings:tabs.eachKeyValuePairWillBeIncludedAsAdditionalPayload"
              components={{
                docLink: <Link size={'md'} href="https://ibm.biz/alerts-custom-payloads" external />
              }}
            />
          </span>
        </Message>
      </Section>
      {!canConfigureGlobalAlertPayload && (
        <Message withIcon small fullInlineWidth>
          {t('in-settings:tabs.youAreNotPermittedToEditCustomPayloads')}
        </Message>
      )}
      <form onSubmit={e => onSubmit(e, trackCta)}>
        <CustomPayloadTable
          getRowIndex={getRowIndex}
          TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
          columnDefinitions={columnDefinitions}
          isSearchable={false}
          addRow={() => {
            trackCta(SETTINGS_ALERT_CUSTOM_PAYLOAD_ADD_ITEM);
            addRow();
          }}
          deleteRow={payloadField => deleteRow(payloadField, trackCta)}
          updateIn={updateIn}
          result={mergeResultWithPayloadForm(form, result)}
          customPayloadForm={form}
          canConfigureAlertPayload={canConfigureGlobalAlertPayload}
          enabled={enabled}
          suggestionsAlignedLeft
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
  }

  function deleteRow(payloadField, trackCta) {
    const entryPosition = getRowIndex(payloadField);

    if (entryPosition >= 0) {
      setForm(form.remove(entryPosition).setTouched(true));
      trackCta(SETTINGS_ALERT_CUSTOM_PAYLOAD_REMOVE_ITEM, {
        type: payloadField.get('type').value,
        name: payloadField.get('key').value,
        id: payloadField.get('id').value
      });
    }
  }

  function onSubmit(event, trackCta) {
    event.preventDefault();

    setForm(form.setTouched(true, { recurse: true }));

    if (!form.hierarchyValid) {
      return false;
    }
    const fields = form.toJS().map(toServerItemModel);
    save({ fields });

    trackCta(SETTINGS_ALERT_CUSTOM_PAYLOAD_SUBMIT, {
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
