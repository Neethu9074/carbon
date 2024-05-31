/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import {
  SvgIcon,
  CarbonButton,
  CarbonTag,
  CarbonTextArea,
  CarbonLayer,
  CarbonInlineLoading
} from '@instana/components';
// Not using Carbon tooltip since tooltip has not been migrated
// Using Carbon tooltip would cause mismatch in design on the page
// since tooltip is used in many places on this page
import Tooltip from 'in-components/Tooltip';
// import { annotateEvent } from 'in-stores/events';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';
import classNames from 'classnames';
import { getNotes } from './utils';
import locals from './NotesAndActivity.mless';

export function NotesAndActivity(props) {
  const { event } = props
  const notes = getNotes(event)
  const incidentId = event?.get('id');
  const loading = event == undefined

  // Boolean to control when the notes section is opened
  const [displayNotes, setDisplayNotes] = useState(false);
  // Current value of the typed out note
  const [note, setNote] = useState('');

  // This is just testing data for now
  const [testNotes, setTestNotes] = useState([
    {name: "Josh King", time: "11:30AM 5/29/2024", note: "Sure thing, team work makes the dream work!"},
    {name: "Dart Feld", time: "11:28AM 5/29/2024", note: "Hey thanks Josh for helping me look into this!! Seems to be okay now!"},
    {name: "Josh King", time: "10:24AM 5/29/2024", note: "I have looked into the issue and it seems to be solved!"},
    {name: "Josh King", time: "01:20PM 5/28/2024", note: "Starting to look into this issue."},
    {name: "Dart Feld", time: "04:28PM 5/26/2024", note: "Starting to look into this issue. But I'm a little concerned about the severity here.  There should be more information contained, can anyone else help take a look?"},
    {name: "Really really really really looonnnggg name", time: "04:29PM 5/26/2024", note: "Starting to look into this issue. But I'm a little concerned about the severity here.  There should be more information contained, can anyone else help take a look? Starting to look into this issue. But I'm a little concerned about the severity here.  There should be more information contained, can anyone else help take a look? Starting to look into this issue. But I'm a little concerned about the severity here.  There should be more information contained, can anyone else help take a look?"},
    {name: "Really really really really looonnnggg name", time: "04:30PM 5/26/2024", note: "Starting to look into this issue. But I'm a little concerned about the severity here.  There should be more information contained, can anyone else help take a look? Starting to look into this issue. But I'm a little concerned about the severity here.  There should be more information contained, can anyone else help take a look? Starting to look into this issue. But I'm a little concerned about the severity here.  There should be more information contained, can anyone else help take a look?"},
    {name: "Really really really really looonnnggg name Really really really really looonnnggg name Really really really really looonnnggg name", time: "04:31PM 5/26/2024", note: "Starting to look into this issue. But I'm a little concerned about the severity here.  There should be more information contained, can anyone else help take a look? Starting to look into this issue. But I'm a little concerned about the severity here.  There should be more information contained, can anyone else help take a look? Starting to look into this issue. But I'm a little concerned about the severity here.  There should be more information contained, can anyone else help take a look? Starting to look into this issue. But I'm a little concerned about the severity here.  There should be more information contained, can anyone else help take a look? Starting to look into this issue. But I'm a little concerned about the severity here.  There should be more information contained, can anyone else help take a look? Starting to look into this issue. But I'm a little concerned about the severity here.  There should be more information contained, can anyone else help take a look?"},
  ]);

  return (
    <>
      <div className={locals.verticalBorderNotes} />
      {!displayNotes ?
        <Tooltip content={t('in-events:notes.openNotes')}>
          <div onClick={() => setDisplayNotes(!displayNotes)} className={locals.closedNotesWrapper}>
              {t('in-events:notes.notesActivity')}
              <SvgIcon
                type={displayNotes ? 'lib_sidebar_to_right' : 'lib_sidebar_to_left'}
                size="s"
              />  
          </div>
        </Tooltip>
      :
        <CarbonLayer className={locals.notesHeaderWrapper}>
          <div className={locals.headerWrapper}>
            {t('in-events:notes.notesActivity')}
            <CarbonTag type="blue">
              {t('in-events:notes.techPreview')}
            </CarbonTag>
            <Tooltip content={t('in-events:notes.closeNotes')}>
              <SvgIcon
                onClick={() => setDisplayNotes(!displayNotes)}
                type={displayNotes ? 'lib_sidebar_to_right' : 'lib_sidebar_to_left'}
                size="s"
                className={locals.notesIcon}
              />
            </Tooltip>
          </div>
          <div className={locals.notes}>
            {loading ?
              <div className={locals.loading}>
                <CarbonInlineLoading />
              </div>
            :  
              <>
                <div className={locals.inputSection}>
                  <CarbonTextArea
                    labelText={t('in-events:notes.incidentNotes')}
                    hideLabel
                    rows={5}
                    id="incidentNotes"
                    value={note}
                    onChange={(e) => {
                      setNote(e?.target?.value)
                    }}
                  />
                  <CarbonButton
                    onClick={() => handleSubmitNote(incidentId, note, user, setNote, setTestNotes, testNotes)}
                    className={locals.addNoteButton}
                    size={"md"}
                  >
                    {t('in-events:notes.addNote')}
                  </CarbonButton>
                </div>
                <CommentList notes={/* notes ||*/ testNotes} preferredName={user.preferredName} />
              </>
            }
          </div>
        </CarbonLayer>
      }
      
    </>
    

  )
}

export function CommentList(props) {
  const { notes, preferredName } = props
  // Currently just used for testing until we get the backend hooked up
  return (
    <div className={locals.notesSection}>
      {notes && notes.map(i => {
      const myBubble = i.name == preferredName
        return (
            <div key={i.time}>
              <div className={classNames({
                    [locals.myChatEntry]: myBubble,
                    [locals.chatEntry]: true
                  })}
              >
                {!myBubble && <SvgIcon type={"lib_user_avatar_filled_alt"} size="sm" />}
                <div className={locals.chatEntryInfo}>
                  {`${myBubble && t('in-events:notes.you') || i.name} | ${i.time}`}
                </div>
              </div>
              <ChatBubble user={i.name} text={i.note} myBubble={myBubble} />
            </div>
        )
      })}
    </div>
  )
}

// Individual chat bubble that has differing colors based on
// if the text is from me or someone else
export function ChatBubble(props) {
  const { myBubble, text} = props
  return (
    <div className={classNames({
        [locals.myBubble]: myBubble,
        [locals.otherBubble]: !myBubble,
        [locals.bubble]: true
      })}
    >
      {text}
    </div>
  )
}

// Handle the note submission
// Requires the incidentID, note, user, and setNote function
// Dont allow the annotateEvent call if note is empty
// Once you submit the event clear the note value with SetNote
export function handleSubmitNote(incidentId, note, user, setNote, setTestNotes, testNotes) {
  const userName = user.preferredName
  // Dont fire off a new note without there being something written
  if(note != '') {
    const newNote = {
      incidentId: incidentId,
      author: userName,
      action: 'create',
      contents: note
    };
    console.log('ANNOTATE_EVENT', newNote)
    // annotateEvent({
    //   incidentId: incidentId,
    //   author: userName,
    //   action: 'update',
    //   contents: newNote,
    // });
    // TESTING PURPOSES AND DEMO
    const newNotes = testNotes
    newNotes.unshift({name: userName, time: "11:30AM 5/30/2024", note: note})
    setTestNotes(newNotes)
    // Clear the note once its been fired
    setNote('')
  }
}