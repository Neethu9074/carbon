/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import locals from './ExternalNote.mless';

export function ExternalNote({ noteObj }) {
  const contents = noteObj?.contents;
  const slack = noteObj?.origin == 'Slack';
  const snow = noteObj?.origin == 'ServiceNow';
  return (
    <>
      {snow && (
        <>
          <div className={locals.noteTypeHeading}>{`${noteObj?.label}`}</div>
          {`${noteObj.author}: `}
          <div className={locals.contents}>{contents}</div>
        </>
      )}
      {slack && (
        <div className={locals.noteTypeHeading}>
          {`${noteObj.author}`}
          <div className={locals.contents}>{`${contents}`}</div>
        </div>
      )}
    </>
  );
}
