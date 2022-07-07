/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { difference } from 'lodash';
import { filter } from 'lodash';

import { combineLatest } from '@instana/observables';
import { Spacer } from '@instana/components';

import {
  createCustomThresholdBasedEventSpecification,
  getActionAssociationBuiltin,
  saveActionAssociationBuiltin,
  deleteActionAssociationBuiltin
} from 'in-api/eventSpecifications';
import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import { createBuiltinEventFormDefinition } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/BuiltinEventFormContent';
import AssociatedActions from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionCatalog';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { teamSettingsAlertingEvents } from 'in-settings/navigation/paths';
import { getBuiltInEventSpecification } from 'in-api/eventSpecifications';
import { getFormatter } from 'in-services/formatters/backendFormatter';
import { actionAutomationEnabled } from 'in-services/featureFlags';
import SectionHeading from 'in-settings/components/SectionHeading';
import DescriptionText from 'in-components/form/DescriptionText';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import TouchedMessages from 'in-components/form/TouchedMessages';
import SectionLine from 'in-settings/components/SectionLine';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import SaveCancel from 'in-settings/components/SaveCancel';
import FormGroup from 'in-settings/components/FormGroup';
import Table from 'in-sdk/components/dashboard/Table';
import { getPlainMetricList } from 'in-sdk/metrics';
import { compare } from 'in-services/util/number';
import PluginIcon from 'in-components/PluginIcon';
import { getPluginName } from 'in-sdk/pluginName';
import { getAllActions } from 'in-api/automation';
import { goToPath } from 'in-stores/navigation';
import { find } from 'in-services/arrayUtils';
import Label from 'in-components/form/Label';
import entityForm from 'in-hoc/entityForm';
import Title from 'in-components/Title';
import { role } from 'in-stores/user';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './BuiltInEvent.mless';

const paramCols = [
  stringColumn(t('in-settings:tabs.name'), 'name'),
  stringColumn(t('in-settings:tabs.description'), 'description', 120),
  formattedColumn(t('in-settings:tabs.value'), 'defaultValue')
];

export default function CustomEvent1(props) {
  const entityId = props.match.params.id;

  function mergeResultData() {
    const eventDetails$ = getBuiltInEventSpecification(entityId);
    const actionDetails$ = getActionAssociationBuiltin(entityId);
    // calling Get Event and Get action associations call and combining results
    return combineLatest([eventDetails$, actionDetails$]).map(([response1, response2]) =>
      combineResults(response1, response2)
    );
  }

  function combineResults(entityResult, metricResult) {
    let actionsIds = [];
    metricResult.toJS().forEach(action => {
      actionsIds.push(action.id);
    });
    entityResult.actionIds = actionsIds;
    return entityResult;
  }

  function save(event, form) {
    const actionIds = form.get('actionIds')?.value ?? [];
    const saveActionIds = form.get('saveActionIds')?.value ?? [];

    const finalActionIds = difference(actionIds, saveActionIds); // actions ids that needs to be associated in edit page
    const finalActionDeleteIds = difference(saveActionIds, actionIds); // actions ids that are deselected and needs to be disassociated

    if (finalActionIds.length > 0) {
      const saveEvent = combineLatest(finalActionIds.map(id => saveActionAssociationBuiltin(id, entityId)));
      return saveEvent;
    }

    if (finalActionDeleteIds.length > 0) {
      const saveEvent = combineLatest(finalActionDeleteIds.map(id => deleteActionAssociationBuiltin(id, entityId)));
      return saveEvent;
    }
  }

  return (
    <Form
      title={t('in-settings:tabs.builtInEventDefinition')}
      entityId={entityId}
      createDefaultEntity={createCustomThresholdBasedEventSpecification}
      createForm={event => createBuiltinEventFormDefinition(event)}
      getEntityFromApi={mergeResultData}
      openEntities={() => goToPath(teamSettingsAlertingEvents)}
      saveEntity={save}
    />
  );
}

const Form = entityForm(function DetailsForm(props) {
  const { entity, form, setForm, isCreate, saveEnabled } = props;

  if (!entity || !form) {
    return <LoadingIndicator />;
  }

  if (entity && entity.get('errors')) {
    return (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={theme.lib.colors.yellow800}>
          {t('in-settings:tabs.unknownEvent')}
        </SubViewHeader>
        <SectionLine />
        <DescriptionText>
          {entity.get('errors').get(0)}
          <br />
          {t('in-settings:tabs.ifYouFollowedALinkToGetHereItHasMostLikelyBeenDeleted')}
        </DescriptionText>
      </SettingsDetailPage>
    );
  }

  const entityType = entity.get('shortPluginId');
  const metricList = getPlainMetricList(entityType);

  const paramRows = entity
    .get('hyperParams')
    .toArray()
    .map(param => ({
      key: param.get('id'),
      name: param.get('name'),
      description: param.get('description'),
      defaultValue: param.get('defaultValue'),
      valueFormat: param.get('valueFormat')
    }));

  return (
    <SettingsDetailPage>
      <Title title={t('in-settings:tabs.builtInEventDefinition')} />
      <SubViewHeader>{t('in-settings:tabs.configureBuiltInEvent', { eventName: entity.get('name') })}</SubViewHeader>
      <SectionLine />

      <FormGroup>
        <Label>{t('in-settings:tabs.entityType')}</Label>
        <div className={locals.flexWrapper}>
          <PluginIcon className={locals.entityIcon} color="#000" plugin={entityType} />
          {getPluginName(entityType, 1)}
        </div>
      </FormGroup>
      <FormGroup>
        <Label>{t('in-settings:tabs.name')}</Label>
        {entity.get('name')}
      </FormGroup>
      <FormGroup>
        <Label>{t('in-settings:tabs.description')}</Label>
        {entity.get('description')}
      </FormGroup>
      <FormGroup>
        <Label>{t('in-settings:tabs.eventInputs')}</Label>
        <ul>
          {entity.get('ruleInputs').map((input, i) => {
            let label = input.get('inputName');
            if (input.get('inputKind') === 'METRIC') {
              const metricDefinition = find(metricList, _metric => _metric.value === label);
              if (metricDefinition) {
                label = metricDefinition.label;
              }
            }
            return (
              <li key={i}>
                {mapInputKind(input.get('inputKind'))} - {label}
              </li>
            );
          })}
        </ul>
      </FormGroup>
      <FormGroup moreMargin>
        <Label>{t('in-settings:tabs.parameters')}</Label>
        <Table cols={paramCols} rows={paramRows} />
      </FormGroup>
      {role.canConfigureAutomationActions && actionAutomationEnabled && (
        <>
          <SectionHeading>{t('in-settings:tabs.ActionAssociations')}</SectionHeading>
          <ActionsSelection form={form} setForm={setForm} entityId={entity} />
        </>
      )}
      <SaveCancel
        form={form}
        message=""
        loading={!entity}
        saveEnabled={saveEnabled && role.canConfigureAutomationActions && actionAutomationEnabled}
        isCreate={isCreate}
        listPath={teamSettingsAlertingEvents}
        cancelButtonLabel={t('in-settings:tabs.back')}
      />
    </SettingsDetailPage>
  );
});

function mapInputKind(kind) {
  switch (kind) {
    case 'METRIC':
      return t('in-settings:tabs.metric');
    case 'SNAPSHOT_FIELD':
      return t('in-settings:tabs.snapshotField');
    case 'EVENT':
      return t('in-settings:tabs.event');
    case 'DERIVED_METRIC':
      return t('in-settings:tabs.derivedMetric');
    case 'METRIC_PATTERN':
      return t('in-settings:tabs.metricPattern');
    default:
      return '?';
  }
}

function stringColumn(title, attr, width = 80) {
  return {
    title,
    type: 'string',
    width,
    typeArgs: {
      getValue(row) {
        return row[attr];
      }
    }
  };
}

function formattedColumn(title, attr) {
  return {
    title,
    type: 'custom',
    width: 50,
    typeArgs: {
      comparator: compare,
      get(row) {
        const valueFormat = row.valueFormat;
        const value = row[attr];

        return {
          value,
          content: getFormatter(valueFormat).detailed(value)
        };
      }
    }
  };
}

function ActionsSelection({ form, setForm }) {
  let selectedActions = form.get('actionIds') ? form.get('actionIds').value : [];

  return (
    <Fragment>
      <AssociatedActions
        setTitle
        loadEntities={() => getSelectedActionsForEvent(selectedActions)}
        hasRowNavigation={false}
        emptyMessage={t('in-settings:tabs.noActionsSelected')}
        tableActions={ActionSelectionTableActions(form, setForm)}
        pageSize={10}
        rightHeader={
          <SelectListDialogButton
            form={form}
            onSubmit={selectedIds => submitActionSelection(form, setForm, selectedIds)}
            title={t('in-settings:tabs.addActions')}
            label={t('in-settings:tabs.addActions')}
            listComponent={AssociatedActions}
            limit={10}
            hiddenIds={selectedActions}
            createSubmitLabel={numberOfItems =>
              numberOfItems > 0
                ? t('in-settings:tabs.addNumberOfItemsAction', { count: numberOfItems })
                : t('in-settings:tabs.addActions')
            }
            requiresAtLeastOneMessage={t('in-settings:tabs.pleaseSelectAtLeastOneAction')}
          />
        }
      />
      <TouchedMessages field={form.get('selectedActions')} />
      <Spacer vertical="large" />
    </Fragment>
  );
}

function ActionSelectionTableActions(form, setForm) {
  return {
    deselect: {
      deselect: deselectedEntity => {
        if (deselectedEntity) {
          setForm(
            form.updateIn(['actionIds'], field => {
              return field
                .setValue(field.value.filter(referencedId => referencedId !== deselectedEntity.id))
                .setTouched(true);
            })
          );
        }
      }
    }
  };
}

function submitActionSelection(form, setForm, selectedIds) {
  setForm(
    form.updateIn(['actionIds'], field => {
      return field.setValue(field.value.concat(selectedIds)).setTouched(true);
    })
  );
}

const getSelectedActionsForEvent = createMemoizedObservableForReferencedEntities(function(selectedActions) {
  if (selectedActions.length === 0) {
    return alwaysEmptyArray;
  }
  // null is treated as a pending result when converting the HTTP response into a result
  return getAllActions().map(action =>
    filter(action, function(app) {
      return selectedActions.indexOf(app.id) >= 0;
    })
  );
});
