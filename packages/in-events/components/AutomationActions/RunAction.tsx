/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import { Button } from '@instana/components';

import { close } from 'in-components/DialogPresenter/store';
import { runScriptAction } from 'in-api/automation';
import Dialog from 'in-components/Dialog/Dialog';
import { Event, VolatileId } from 'in-types';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

interface Props {
  script: string;
  volatileId: VolatileId;
  event: Event | null;
}

export default function RunAction({ script, volatileId, event }: Props) {
  const [expanded] = useState(true);
  return (
    <Dialog title={t('in-events:runAction')} onClose={close}>
      <>
        {/* <Button kind="primary"
            onClick={() =>setExpanded(expanded => !expanded)}
            noAutoMargin>
            {expanded && 'Hide script'}
            {!expanded && 'Show script'}
        </Button> */}
        <Code code={expanded ? atob(script) : ''} lang={'bash'} withoutCopyButton />
        <Button kind="primary" onClick={() => runScriptAction(script, volatileId, event).once(close)} noAutoMargin>
          Run
        </Button>
      </>
    </Dialog>
  );
}
