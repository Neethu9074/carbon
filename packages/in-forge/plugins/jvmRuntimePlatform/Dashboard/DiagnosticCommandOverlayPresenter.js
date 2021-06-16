/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import { Button } from '@instana/components';

import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';

import locals from './DiagnosticCommandOverlayPresenter.mless';

export default function DiagnosticCommandOverlayPresenter({ snapshot, getDiagnosticInfo, commands }) {
  const [diagnosticCommand, setDiagnosticCommand] = useState(commands.get(0));

  return (
    <div className={locals.overlay}>
      <FormGroup>
        <Label>Available Commands</Label>
        <Select
          onChange={e => setDiagnosticCommand(e.currentTarget.value)}
          autoComplete="off"
          defaultValue={diagnosticCommand}
        >
          {commands.map(cmd => (
            <option value={cmd} key={cmd}>
              {cmd}
            </option>
          ))}
        </Select>
      </FormGroup>
      <Button onClick={() => getDiagnosticInfo(snapshot, diagnosticCommand)}>Send Command</Button>
    </div>
  );
}
