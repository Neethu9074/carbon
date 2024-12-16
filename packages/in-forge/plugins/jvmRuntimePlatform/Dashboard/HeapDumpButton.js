/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import createAgentResponseObservable from 'in-subscription/agentResponse';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { isEntityOnline } from 'in-stores/snapshot';
import Prompt from 'in-components/Dialog/Prompt';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => {
    return {
      isOnline: isEntityOnline(props.snapshot.get('id'))
    };
  },
  function HeapDumpButton({ snapshot, className, isOnline }) {
    const maxMemory = snapshot.get('data').get('memory.max');
    const description = maxMemory
      ? t('in-forge:plugins.jvmRuntimePlatform.takingAHeapDumpIsAnInvasiveOperationAndWillRequire', {
          size: bytesTwoDecimalPlaces(maxMemory)
        })
      : t('in-forge:plugins.jvmRuntimePlatform.takingAHeapDumpIsAnInvasiveOperationPleaseProvide');
    const button = (
      <Button
        kind="secondary"
        onClick={() => {
          if (isOnline) {
            addActiveDialog(
              <Prompt
                header={t('in-forge:plugins.jvmRuntimePlatform.jvmHeapDump')}
                description={description}
                inputLabel={t('in-forge:plugins.jvmRuntimePlatform.storagePath')}
                confirmButtonLabel={t('in-forge:plugins.jvmRuntimePlatform.takeHeapDump')}
                onSubmit={path => {
                  close();
                  takeHeapDump(path, snapshot);
                }}
              />
            );
          }
        }}
        className={className}
        disabled={!isOnline}
      >
        {t('in-forge:plugins.jvmRuntimePlatform.getHeapDump')}
      </Button>
    );

    if (isOnline) {
      return <Tooltip content={t('in-forge:plugins.jvmRuntimePlatform.heapDumpsAreAlwaysLive')}>{button}</Tooltip>;
    }

    return (
      <Tooltip
        content={t(
          'in-forge:plugins.jvmRuntimePlatform.heapDumpsCanOnlyBeRetrievedForJvMsThatAreStillUnderMonitoringByInstana'
        )}
      >
        {button}
      </Tooltip>
    );
  }
);

function takeHeapDump(path, snapshot) {
  addMessage(
    {
      type: 'info',
      content: t('in-forge:plugins.jvmRuntimePlatform.takingHeapDump')
    },
    'jvm-heap-dump'
  );
  createAgentResponseObservable({
    action: 'java.heapDump',
    target: snapshot.get('volatileId'),
    args: {
      target: path
    }
  }).once(({ error, data }) => {
    if (data) {
      addMessage(
        {
          type: 'info',
          timeout: 5000,
          content: t('in-forge:plugins.jvmRuntimePlatform.heapDumpAvailableVia', { data: data })
        },
        'jvm-heap-dump'
      );
    } else {
      addMessage(
        {
          type: 'danger',
          timeout: 5000,
          content: t('in-forge:plugins.jvmRuntimePlatform.failedToCollectHeapDump', { error: error })
        },
        'jvm-heap-dump'
      );
    }
  });
}
