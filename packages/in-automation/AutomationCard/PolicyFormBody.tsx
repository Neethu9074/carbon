/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { Spacer, Typography } from '@instana/components';
import { Result, Event } from '@instana/types';

import {
  appFilterAppliedColumn,
  entityTypeColumn,
  infraFilterAppliedColumn,
  logsFilterAppliedColumn,
  mobileAppFilterAppliedColumn,
  sloFilterAppliedColumn,
  syntheticFilterAppliedColumn,
  triggerDescriptionColumn,
  triggerNameColumn,
  websiteFilterAppliedColumn
} from 'in-automation/components/Triggers/columnDefinitions';
import { descriptionColumn, nameColumn } from 'in-automation/ActionTable/columnDefinitions';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import CreatableTagSelect from 'in-components/CreatableTagSelect/CreatableTagSelect';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { getTriggerTypeFromEvent } from 'in-automation/AutomationCard/shared';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { tagsColumn } from 'in-automation/components/columnDefinitions';
import { NewAction, TriggerSpecification } from 'in-automation/types';
import { isLoading, listSuccess } from 'in-services/util/result';
import usePolicyTags from 'in-automation/hooks/usePolicyTags';
import TextArea from 'in-components/form/TextArea/TextArea';
import HelpText from 'in-components/form/HelpText/HelpText';
import FormGroup from 'in-settings/components/FormGroup';
import { hasError } from 'in-services/util/result';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

type PolicyFormItems = {
  name: Field<string>;
  description: Field<string>;
  tags: Field<string[]>;
};

type PolicyForm = MapForm<PolicyFormItems>;

export default function PolicyFormBody({
  setForm,
  form,
  action,
  trigger,
  event
}: {
  setForm: (setValueFunc: (value: PolicyForm) => PolicyForm) => void;
  form: PolicyForm;
  action: NewAction;
  trigger: Result<TriggerSpecification>;
  event: Event;
}) {
  const availableTags = usePolicyTags();
  const name = form.get('name');
  const description = form.get('description');
  const tags = form.get('tags');

  return (
    <>
      <Spacer vertical="normal" />
      <Typography variant="heading-02">{t('in-automation:GenerateAIActionDialog.policyDetails')}</Typography>
      <Spacer vertical="normal" />
      {name.map(field => (
        <FormGroup>
          <Label htmlFor="policy-name" hasError={!field.valid && field.touched}>
            {t('in-automation:name')}
          </Label>
          <Input
            id="policy-name"
            type="text"
            value={field.value}
            onChange={e =>
              setForm(form => form.updateIn(['name'], item => item.setValue(e.target.value).setTouched(true)))
            }
            hasError={!field.valid && field.touched}
            maxLength={256}
            autoFocus
          />
          <TouchedMessages field={field} />
          <HelpText>{t('in-automation:policies.showsUpInTheListOfPolicies')}</HelpText>
        </FormGroup>
      ))}
      {description.map(field => (
        <FormGroup>
          <Label htmlFor="policy-description" hasError={!field.valid && field.touched}>
            {t('in-automation:description')}
          </Label>
          <TextArea
            id="policy-description"
            value={field.value}
            onChange={e =>
              setForm(form =>
                form.updateIn(['description'], item =>
                  item.setValue((e.target as HTMLTextAreaElement).value).setTouched(true)
                )
              )
            }
            hasError={!field.valid && field.touched}
          />
          <TouchedMessages field={field} />
          <HelpText>{t('in-automation:policies.showsUpInThePolicyDescription')}</HelpText>
        </FormGroup>
      ))}
      {tags.map(field => (
        <FormGroup>
          <Label htmlFor="policy-tags" hasError={!field.valid && field.touched}>
            {t('in-automation:tagsLabel')}
          </Label>
          <CreatableTagSelect
            id="policy-tags"
            isLoading={isLoading(availableTags)}
            tags={availableTags.data}
            value={field.value}
            onChange={tags => setForm(form => form.updateIn(['tags'], item => item.setValue(tags).setTouched(true)))}
          />
        </FormGroup>
      ))}
      <Spacer vertical="normal" />
      <ActionSection action={action} />
      <TriggerSection trigger={trigger} event={event} />
      <Spacer vertical="xxlarge" />
    </>
  );
}

function TriggerSection({ trigger, event }: { trigger: Result<TriggerSpecification>; event: Event }) {
  const triggerType = getTriggerTypeFromEvent(event);
  const columnDefinitions: ColumnDefinition<TriggerSpecification>[] = [triggerNameColumn, triggerDescriptionColumn];

  if (triggerType === 'applicationSmartAlert' || triggerType === 'globalApplicationSmartAlert')
    columnDefinitions.push(appFilterAppliedColumn);
  if (triggerType === 'websiteSmartAlert') columnDefinitions.push(websiteFilterAppliedColumn);
  if (triggerType === 'mobileAppSmartAlert') columnDefinitions.push(mobileAppFilterAppliedColumn);
  if (triggerType === 'infraSmartAlert') columnDefinitions.push(infraFilterAppliedColumn);
  if (triggerType === 'syntheticsSmartAlert') columnDefinitions.push(syntheticFilterAppliedColumn);
  if (triggerType === 'logSmartAlert') columnDefinitions.push(logsFilterAppliedColumn);
  if (triggerType === 'sloSmartAlert') columnDefinitions.push(sloFilterAppliedColumn);
  if (triggerType === 'builtinEvent' || triggerType === 'customEvent') columnDefinitions.push(entityTypeColumn);

  const result = hasError(trigger)
    ? {
        data: { items: [] },
        errors: trigger.errors,
        progress: {
          loading: false
        }
      }
    : listSuccess([trigger.data!]);

  return (
    <FormGroup>
      <Label htmlFor="event-trigger">{t('in-automation:policies.eventTrigger')}</Label>
      <ServerTablePresenter
        pageSize={1}
        page={0}
        isSearchable={false}
        orderBy="id"
        noDataMessage={t('in-automation:policies.noEventTriggerConfigured')}
        orderDirection="ASC"
        columnDefinitions={columnDefinitions}
        // @ts-expect-error
        result={result}
        leftHeader={t('in-automation:policies.eventTrigger')}
        fixedLayout
      />
    </FormGroup>
  );
}

function ActionSection({ action }: { action: NewAction }) {
  const columnDefinitions: ColumnDefinition<NewAction>[] = [
    nameColumn,
    descriptionColumn,
    tagsColumn as ColumnDefinition<NewAction>
  ];
  const result = listSuccess([action]);
  return (
    <FormGroup>
      <Label htmlFor="event-trigger">{t('in-automation:GenerateAIActionDialog.actionConfiguration')}</Label>
      <ServerTablePresenter
        leftHeader={t('in-automation:policies.action')}
        pageSize={1}
        page={0}
        isSearchable={false}
        noDataMessage={t('in-automation:policies.noActionConfigured')}
        orderBy="id"
        orderDirection="ASC"
        columnDefinitions={columnDefinitions}
        result={result}
        fixedLayout
      />
    </FormGroup>
  );
}
