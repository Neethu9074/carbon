/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect } from 'react';

import ApiToken from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/ApiToken';
import { addActiveDialog } from 'in-components/DialogPresenter/store';

export interface MatchParams {
  match: { params: { id: string; duplicateFrom: string | undefined } };
}

export default function ApiTokenFormDialog(props: MatchParams) {
  useEffect(() => {
    addActiveDialog(
      <ApiToken match={{ params: { id: props.match.params.id, duplicateFrom: props.match.params.duplicateFrom } }} />
    );
  }, [props.match.params.id, props.match.params.duplicateFrom]);

  return null;
}
