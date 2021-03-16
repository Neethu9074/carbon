/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createLogger } from '@instana/logger';
import { createField } from 'formalistic';
import React, { useState } from 'react';
import classNames from 'classnames';
import { uniqBy } from 'lodash';

import {
  defaultType,
  staticBooleanType,
  staticNumberType,
  staticStringType,
  dynamicType,
  mergeResultWithPayloadForm,
  toServerItemModel,
  defaultValueForType,
  createNewFormEntry,
  validatorForType,
  createForm
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/form';
import {
  toFormModel,
  toViewModel,
  createTagBasedPayloadConfigurator
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import {
  addItemAlertCustomPayloadTracker,
  editAlertCustomPayloadTracker,
  removeItemAlertCustomPayloadTracker,
  submitAlertCustomPayloadTracker
} from 'in-settings/tracker';
import {
  getGlobalCustomPayloadAsResultObservable,
  getCustomPayloadTagCatalog,
  saveGlobalCustomPayload
} from 'in-settings/tabs/TeamSettings/api/customPayload';
import {
  useSaveToServerHandler,
  initialState
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/useSaveToServerHandler';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { isLoading, hasError, successObservableFactory } from 'in-services/util/result';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Notification from 'in-components/form/Notification';
import SaveCancel from 'in-settings/components/SaveCancel';
import { pendingResult } from 'in-services/fixedObjects';
import Section from 'in-settings/components/Section';
import FormGroup from 'in-components/form/FormGroup';
import useObservable from 'in-hooks/useObservable';
import Message from 'in-new-components/Message';
import Select from 'in-components/form/Select';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Title from 'in-components/Title';
import { role } from 'in-stores/user';
import Link from 'in-components/Link';
import { t, Trans } from 'in-i18n';

import locals from './CustomPayloadForm.mless';

const maximumNumberOfRows = 20;

const logger = createLogger('customPayloadConfig');

const { TagBasedPayloadConfigurator } = createTagBasedPayloadConfigurator({
  getTagCatalog: getCustomPayloadTagCatalog,
  getSuggestions: successObservableFactory({
    suggestions: []
  })
});

export default function CustomPayloadPage() {
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

  function getRowIndex(payloadField) {
    return form.reduce((acc, item, i) => (item === payloadField ? i : acc), -1);
  }

  function updateIn(paths, changeField) {
    setForm(form.updateIn(paths, f => changeField(f).setTouched(true)).setTouched(true));
  }

  const addRow = () => {
    setForm(form.push(createNewFormEntry()).setTouched(true));
    addItemAlertCustomPayloadTracker({});
  };

  const deleteRow = payloadField => {
    const entryPosition = getRowIndex(payloadField);
    if (entryPosition >= 0) {
      setForm(form.remove(entryPosition).setTouched(true));
      removeItemAlertCustomPayloadTracker({
        type: payloadField.get('type').value
      });
    }
  };

  const trackChange = data => {
    editAlertCustomPayloadTracker(data);
  };

  const { canConfigureGlobalAlertPayload } = role;
  const columnDefinitions = canConfigureGlobalAlertPayload
    ? [...tableColumnDefinitions, deleteItemColumn]
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
      <form
        onSubmit={e => {
          e.preventDefault();

          setForm(form.setTouched(true, { recurse: true }));

          if (!form.hierarchyValid) {
            return false;
          }
          const fields = form.toJS().map(toServerItemModel);
          save({ fields });

          submitAlertCustomPayloadTracker({
            itemTypes: uniqBy(fields.map(f => f.type)).join(', ')
          });
        }}
      >
        <ServerTablePresenter
          getRowIndex={getRowIndex}
          columnDefinitions={columnDefinitions}
          getRowProps={getRowProps}
          isSearchable={false}
          rightHeader={
            canConfigureGlobalAlertPayload ? (
              form.size >= maximumNumberOfRows ? (
                <Tooltip
                  content={t('in-settings:tabs.theNumberOfRowsIsRestrictedToMaximumNumberOfRows', {
                    maximumNumberOfRows: maximumNumberOfRows
                  })}
                  align="bottomMiddle"
                >
                  <Button kind="action" icon="lib_openclose_add_circle_outline" disabled>
                    {t('in-settings:tabs.addRow')}
                  </Button>
                </Tooltip>
              ) : (
                <Button kind="action" onClick={addRow} icon="lib_openclose_add_circle_outline" disabled={!enabled}>
                  {t('in-settings:tabs.addRow')}
                </Button>
              )
            ) : (
              <span />
            )
          }
          size="regular"
          result={mergeResultWithPayloadForm(form, result)}
          deleteRow={deleteRow}
          updateIn={updateIn}
          enabled={enabled}
          trackChange={trackChange}
        />
        <Section>
          <TouchedMessages field={form} />
        </Section>

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
}

function getRowProps() {
  return {
    className: locals.row,
    size: 'compact'
  };
}

const tableColumnDefinitions = [
  {
    id: 'key',
    width: '30',
    sortable: false,
    label: t('in-settings:tabs.key'),
    getContent(item, { getRowIndex, updateIn, enabled }) {
      function onChange(paths, f) {
        updateIn([getRowIndex(item), ...paths], f);
      }

      const valueField = item.get('key');
      const value = valueField.value;

      return (
        <FormGroup withoutBottomMargin>
          <HorizontalFlexWrapper className={locals.colName}>
            <span className={locals.prefix}>{t('in-settings:tabs.customWithColon')}</span>
            <Input
              disabled={!enabled}
              className={locals.key}
              value={value}
              hasError={!valueField?.valid && valueField?.touched}
              onChange={({ target }) => {
                onChange(['key'], f => f.setValue(target.value).setTouched(true));
              }}
              maxLength={128}
              autoFocus
            />
          </HorizontalFlexWrapper>
          <TouchedMessages field={item.get('key')} />
        </FormGroup>
      );
    }
  },
  {
    id: 'type',
    width: '20',

    sortable: false,
    label: t('in-settings:tabs.valueType'),
    getContent(item, { getRowIndex, updateIn, enabled, trackChange }) {
      const onChangeType = newType => {
        const newValue = defaultValueForType(newType);
        const newValidator = validatorForType[newType];
        updateIn([getRowIndex(item)], formFields => {
          return formFields
            .updateIn(['type'], f => f.setValue(newType).setTouched(true))
            .updateIn(['value'], () =>
              createField({
                value: newValue,
                validator: newValidator
              })
            );
        });
      };

      return (
        <FormGroup withoutBottomMargin>
          {item.get('type').map(field => (
            <Select
              disabled={!enabled}
              className={locals.colType}
              value={field.value ?? defaultType}
              hasError={!field?.valid && field?.touched}
              onChange={({ target }) => {
                onChangeType(target.value);
                trackChange({ type: target.value, oldType: field.value });
              }}
            >
              {[
                { value: staticStringType, label: t('in-settings:tabs.staticString') },
                { value: staticNumberType, label: t('in-settings:tabs.staticNumber') },
                { value: staticBooleanType, label: t('in-settings:tabs.staticBoolean') },
                { value: dynamicType, label: t('in-settings:tabs.dynamic') }
              ].map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          ))}
        </FormGroup>
      );
    }
  },
  {
    id: 'value',
    width: '45',

    sortable: false,
    label: t('in-settings:tabs.value'),
    getContent(itemForm, { getRowIndex, updateIn, enabled, trackChange }) {
      function onChange(paths, f) {
        updateIn([getRowIndex(itemForm), ...paths], f);
      }

      const type = itemForm.get('type').value;
      const valueField = itemForm.get('value');
      const value = valueField.value;

      if (type === staticStringType) {
        return (
          <FormGroup withoutBottomMargin>
            <Input
              disabled={!enabled}
              className={locals.colValue}
              value={value}
              hasError={!valueField?.valid && valueField?.touched}
              onChange={({ target }) => {
                onChange(['value'], f => f.setValue(target.value).setTouched(true));
              }}
              maxLength={512}
            />
            <TouchedMessages field={valueField} />
          </FormGroup>
        );
      }
      if (type === staticNumberType) {
        return (
          <FormGroup withoutBottomMargin>
            <Input
              disabled={!enabled}
              className={locals.colValue}
              value={value}
              hasError={!valueField?.valid && valueField?.touched}
              onChange={({ target }) => {
                onChange(['value'], f => f.setValue(target.value).setTouched(true));
              }}
              min={Number.MIN_SAFE_INTEGER}
              max={Number.MAX_SAFE_INTEGER}
            />
            <TouchedMessages field={valueField} />
          </FormGroup>
        );
      }
      if (type === staticBooleanType) {
        return (
          <FormGroup withoutBottomMargin>
            <Select
              disabled={!enabled}
              className={locals.colValue}
              value={value ?? false}
              hasError={!valueField?.valid && valueField?.touched}
              onChange={({ target }) => {
                onChange(['value'], f => f.setValue(target.value).setTouched(true));
              }}
            >
              <option value>{t('in-settings:tabs.true')}</option>
              <option value={false}>{t('in-settings:tabs.false')}</option>
            </Select>
            <TouchedMessages field={valueField} />
          </FormGroup>
        );
      }

      if (type === dynamicType) {
        return (
          <FormGroup withoutBottomMargin className={locals.colValue}>
            {valueField.map(field => {
              const value = field?.value;
              const storeIntoFormModel = payloadItem => {
                const formModel = toFormModel(payloadItem);
                onChange(['value'], f => f.setValue(formModel).setTouched(true));
                trackChange({ dynamicValue: formModel.tagName });
              };
              return (
                <>
                  <TagBasedPayloadConfigurator
                    disabled={!enabled}
                    value={toViewModel(value)}
                    onChange={storeIntoFormModel}
                    tagFilterExpression={{}}
                  />
                  <TouchedMessages field={field} />
                </>
              );
            })}
          </FormGroup>
        );
      }

      return <span>{t('in-settings:tabs.unknownTypeTypeItCanNotBeEdited', { type: type })}</span>;
    }
  }
];

const deleteItemColumn = {
  id: 'deleteRow',
  width: '5',
  sortable: false,
  getContent(itemForm, { deleteRow, enabled }) {
    return (
      <div className={locals.controls}>
        <Tooltip content={t('in-settings:tabs.deleteRow')}>
          <SvgIcon
            type="lib_actions_delete"
            className={classNames({
              [locals.delete]: true,
              [locals.disabled]: !enabled
            })}
            onClick={() => enabled && deleteRow(itemForm)}
          />
        </Tooltip>
      </div>
    );
  }
};
