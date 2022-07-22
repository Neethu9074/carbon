/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import { Button } from '@instana/components';
import { VolatileId } from '@instana/types';

import { close } from 'in-components/DialogPresenter/store';
import { runScriptAction } from 'in-api/automation';
import Dialog from 'in-components/Dialog/Dialog';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

interface Props {
  script: string;
  volatileId: VolatileId;
}

export default function RunAction({ script, volatileId }: Props) {
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
        <Button kind="primary" onClick={() => runScriptAction(script, volatileId).once(close)} noAutoMargin>
          Run
        </Button>
      </>
    </Dialog>
  );
}
