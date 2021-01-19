/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import FormGroup from 'in-settings/components/FormGroup';
import Input from 'in-components/form/Input';

import locals from './InfraDFQ.mless';

export default function Selectable({ infraDfqFilter, setDfq }) {
  return (
    <div className={locals.wrapper}>
      <FormGroup>
        <Input
          id="permission-set-name"
          value={infraDfqFilter}
          onChange={e => setDfq(e.target.value)}
          placeholder={'e.g. entity.zone:"production" AND NOT event.text:"TCP*"'}
        />
      </FormGroup>
    </div>
  );
}
