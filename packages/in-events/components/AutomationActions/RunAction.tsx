/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm, Field, MapForm } from 'formalistic';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Button, Link } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { DescriptionItem, DescriptionList } from 'in-components/DescriptionList/DescriptionList';
import getAgentSnapshotsInTimeframe, { OUT } from 'in-subscription/getAgentSnapshotsInTimeframe';
import FormFooter, { CancelButton } from 'in-components/form/FormFooter/FormFooter';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { notBlankValidator } from 'in-services/validators/string';
import SaveButton from 'in-components/form/SaveButton/SaveButton';
import { getLinkToAnalyze } from 'in-logging/navigation/paths';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import { AgentResponse } from 'in-subscription/agentResponse';
import { Action, Event, Result, VolatileId } from 'in-types';
import { close } from 'in-components/DialogPresenter/store';
import HelpText from 'in-components/form/HelpText/HelpText';
import Select from 'in-components/form/Select/Select';
import { runScriptAction } from 'in-api/automation';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Label from 'in-components/form/Label/Label';
import Dialog from 'in-components/Dialog/Dialog';
import Code from 'in-components/Code';
import { t, Trans } from 'in-i18n';

import locals from './RunAction.mless';

interface Props {
  script: string;
  volatileId: VolatileId;
  event: Event | null;
  action: Action;
}

export default function RunAction({ action, script, volatileId, event }: Props) {
  const [actionInstanceId, setActionInstanceId] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const timeConfig = useTimeConfig();
  const [form, setForm] = useState<MapForm>();
  const targetAgent = form?.get('targetAgent') as Field<string>;
  const agentSnapShots = useObservable(
    () => getAgentSnapshotsInTimeframe({ timeConfig, query: 'entity.agent.capability:action' }),
    [timeConfig]
  );
  useEffect(() => {
    if (agentSnapShots && !form) {
      setForm(createForm(volatileId, agentSnapShots));
    }
  }, [agentSnapShots, form, volatileId]);
  const { name: actionName, description } = action;
  let title,
    content,
    footer = (
      <Button kind="primary" onClick={close}>
        {t('in-events:ok')}
      </Button>
    );
  if (error) {
    title = t('in-events:failedToInitiate', { actionName });
    content = <p className={locals.actionModalFontSize}>{error}</p>;
  } else if (actionInstanceId) {
    title = t('in-events:hasBeenInitiated', { actionName });
    const tagFilterExpression = tagFilter('log.custom', 'EQUALS', actionInstanceId, 'actionInstanceId');
    const link = getLinkToAnalyze({ tagFilterExpression: [tagFilterExpression], timeConfig });
    content = (
      <p className={locals.actionModalFontSize}>
        <Trans
          i18nKey="in-settings:tabs.linkToActionLogs"
          components={{
            // @ts-expect-error
            logsLink: <Link onClick={close} href$={link} />
          }}
        />
      </p>
    );
  } else {
    title = t('in-events:chosenToRun', { actionName });
    content = (
      <>
        <DescriptionList>
          <DescriptionItem
            className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
            title={t('in-events:titleDescription')}
          >
            {description}
          </DescriptionItem>
        </DescriptionList>
        <Code withoutCopyButton code={atob(script)} lang={'bash'} softWrap />
        <AgentSelection
          form={form}
          volatileId={volatileId}
          targetAgent={targetAgent}
          setForm={setForm}
          agentSnapShots={agentSnapShots}
        />
        <p className={locals.actionModalFontSize}>{t('in-events:actionCannotBeUndone')}</p>
      </>
    );
    const selectedVolatileId =
      agentSnapShots?.data?.online?.find(agent => agent.volatileId?.host_id === targetAgent?.value)?.volatileId ?? {};
    footer = (
      <>
        <CancelButton isSaving={isSaving} onClick={close} />
        <SaveButton
          kind="primary"
          form={form}
          disabled={!form}
          isSaving={isSaving}
          onClick={() => {
            if (!form?.hierarchyValid) {
              setForm(form?.setTouched(true, { recurse: true }));
              return;
            }
            setIsSaving(true);
            runScriptAction(script, selectedVolatileId, event, actionName).once(data => {
              setIsSaving(false);
              // last element of the array is either the timeout error if the agent didn't respond in time, or the agent response (error or in progress)
              // result unknown because we only care about error
              const response: Result<null> | AgentResponse = data[data.length - 1];
              if ('errors' in response) {
                setError(response.errors[0].message);
              } else if ('error' in response && response.error != null) {
                setError(response.error);
              } else {
                setActionInstanceId(response.data.actionInstanceId);
              }
            });
          }}
        >
          {t('in-events:yes')}
        </SaveButton>
      </>
    );
  }
  return (
    <Dialog
      className={locals.dialog}
      titleIconType={'lib_help_error_error_circle'}
      title={title}
      onClose={close}
      withoutBodyPadding
    >
      <>
        <div className={locals.actionModalPadding}>{content}</div>
        <FormFooter>{footer}</FormFooter>
      </>
    </Dialog>
  );
}

const createForm = (volatileId: VolatileId, agentSnapShots: OUT) => {
  const defaultValue =
    agentSnapShots?.data?.online?.find(agent => agent.volatileId?.host_id === volatileId.host_id)?.volatileId
      ?.host_id ?? '';
  return createMapForm().put(
    'targetAgent',
    createField({
      value: defaultValue,
      validator: notBlankValidator
    })
  );
};

interface AgentSelectionProps {
  targetAgent: Field<string>;
  form: MapForm | undefined;
  setForm: React.Dispatch<React.SetStateAction<MapForm | undefined>>;
  agentSnapShots: OUT | null | undefined;
  volatileId: VolatileId;
}

const AgentSelection = ({ targetAgent, form, setForm, agentSnapShots, volatileId }: AgentSelectionProps) => {
  return (
    <>
      {targetAgent?.map(field => (
        <FormGroup>
          <Label htmlFor="target-agent" hasError={!field.valid && field.touched}>
            {t('in-events:targetAgent')}
          </Label>
          <Select
            id="target-agent"
            value={field.value}
            onChange={e => {
              const updatedForm = form?.updateIn(['targetAgent'], field =>
                (field as Field<string>).setValue(e.target.value).setTouched(true)
              );
              setForm(updatedForm);
            }}
            hasError={!field.valid && field.touched}
          >
            <>
              <option hidden value="">
                {t('in-events:pleaseSelect')}
              </option>
              {agentSnapShots?.data?.online?.map(agent => {
                const hostname = agent.data?.hostname;
                const label =
                  agent.volatileId?.host_id === volatileId.host_id
                    ? t('in-events:triggeringAgent', { hostname })
                    : hostname;
                return (
                  <option key={agent.volatileId?.host_id} value={agent.volatileId?.host_id}>
                    {label}
                  </option>
                );
              })}
            </>
          </Select>
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          <HelpText className={locals.subTextFormField}>{t('in-events:targetAgentDescription')}</HelpText>
        </FormGroup>
      ))}
    </>
  );
};
