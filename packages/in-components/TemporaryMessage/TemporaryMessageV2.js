/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Message } from '@instana/components';

import TemporaryPresenter from 'in-components/TemporaryPresenter';

export default function TemporaryMessage({ id, message, text, type, duration = 5000 }) {
  return (
    <TemporaryPresenter duration={duration} id={id || text}>
      <Message type={type} withIcon small>
        {text || message}
      </Message>
    </TemporaryPresenter>
  );
}
