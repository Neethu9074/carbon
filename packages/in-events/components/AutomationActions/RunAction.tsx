/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import { Button, Link } from '@instana/components';

// import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
// import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { DescriptionItem, DescriptionList } from 'in-components/DescriptionList/DescriptionList';
import FormFooter, { CancelButton } from 'in-components/form/FormFooter/FormFooter';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { getLinkToAnalyze } from 'in-logging/navigation/paths';
import { AgentResponse } from 'in-subscription/agentResponse';
import { Action, Event, Result, VolatileId } from 'in-types';
import { close } from 'in-components/DialogPresenter/store';
import { runScriptAction } from 'in-api/automation';
import Dialog from 'in-components/Dialog/Dialog';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

interface Props {
  script: string;
  volatileId: VolatileId;
  event: Event | null;
  action: Action;
}

export default function RunAction({ action, script, volatileId, event }: Props) {
  const [actionInstanceId, setActionInstanceId] = useState('');
  const [error, setError] = useState('');
  const timeConfig = useTimeConfig();
  const actionName = action.name;
  let title,
    content,
    footer = (
      <Button kind="primary" onClick={close}>
        {t('in-events:ok')}
      </Button>
    );
  if (error) {
    title = 'in-events:failedToInitiate';
    content = <p>{error}</p>;
  } else if (actionInstanceId) {
    title = 'in-events:hasBeenInitiated';
    const tagFilterExpression = tagFilter('log.custom', 'EQUALS', actionInstanceId, 'actionInstanceId');
    const link = getLinkToAnalyze({ tagFilterExpression: [tagFilterExpression], timeConfig });
    content = (
      <p>
        The output of this action can be viewed in <Link href$={link}>Analytics &gt; Logs.</Link>
      </p>
    );
  } else {
    title = 'in-events:chosenToRun';
    content = (
      <>
        <DescriptionList>
          <DescriptionItem title={t('in-events:titleDescription')}>{action.description}</DescriptionItem>
        </DescriptionList>
        <Code code={atob(script)} lang={'bash'} withoutCopyButton />
        <p>{t('in-events:actionCannotBeUndone')}</p>
      </>
    );
    footer = (
      <>
        <CancelButton onClick={close} />
        <Button
          kind="primary"
          onClick={() =>
            runScriptAction(script, volatileId, event, actionName).once(data => {
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
            })
          }
        >
          {t('in-events:yes')}
        </Button>
      </>
    );
  }
  return (
    <Dialog
      titleIconType={'lib_help_error_error_circle'}
      title={t(title, { actionName: action.name })}
      onClose={close}
      withoutBodyPadding
    >
      <>
        <div style={{ padding: '0 1.5rem 1.5rem' }}>{content}</div>
        <FormFooter>{footer}</FormFooter>
      </>
    </Dialog>
  );
}
