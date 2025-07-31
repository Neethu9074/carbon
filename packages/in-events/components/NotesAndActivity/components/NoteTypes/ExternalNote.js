/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { isSlack, isServiceNow, isMSTeams } from 'in-events/components/NotesAndActivity/components/NoteTypes/utils';

import locals from './ExternalNote.mless';

export function ExternalNote({ noteObj }) {
  const contents = noteObj?.contents;
  const snow = isServiceNow(noteObj?.origin);
  const teams = isMSTeams(noteObj?.origin);
  const slack = isSlack(noteObj?.origin);
  return (
    <>
      {(snow || teams) && (
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
