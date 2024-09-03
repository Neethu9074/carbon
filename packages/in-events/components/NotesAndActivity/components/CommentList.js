/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect } from 'react';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';

import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import { dateFormat, timeFormat } from 'in-services/formatters/date';
import { noteNameAndTimeFormat, createDataString } from './utils';
import { t } from 'in-i18n';

import locals from './CommentList.mless';

export function CommentList(props) {
  const { notes, preferredName, setDisplayQuickStart, displayQuickStart } = props;

  // This adds in the scroll wheel event listener to determine the percentage
  // of the scroll height so we know if we need to collapse and expand the quick actions
  useEffect(() => {
    if (notes) {
      const noteSection = document.getElementById('notesSection');
      noteSection.addEventListener('scroll', event => {
        const scrollHeight = event?.target?.scrollHeight;
        const scrollTop = event?.target?.scrollTop;
        const clientHeight = event?.target?.clientHeight;
        const percentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * -100);
        // If we scroll up 50% then collapse the quick actions
        if (percentage > 50 && displayQuickStart) {
          setDisplayQuickStart(false);
        } else if (percentage < 10 && !displayQuickStart) {
          setDisplayQuickStart(true);
        }
      });
    }
  }, [notes, displayQuickStart, setDisplayQuickStart]);

  return (
    <div
      className={classNames({
        [locals.notesSection]: true
      })}
      id="notesSection"
      tabIndex={'-1'}
    >
      {notes &&
        notes.map((entry, i) => {
          // Using i to iterate helps us traverse backwards that way notes are displayed
          // with the newest note at the top, oldest at the bottom
          const note = notes[notes.length - i - 1];
          const myBubble = note.author == preferredName;
          const type = note.type;
          const aiGen = type === 'ai_generated';
          const serviceNow = note.origin === 'ServiceNow';
          const date = formatDateWithActiveLanguage(new Date(note.timestamp), `${dateFormat}, ${timeFormat}`);
          const iconType =
            (!aiGen && serviceNow && 'lib_snow_icon') || (!aiGen && !serviceNow && 'lib_actions_user') || 'lib_ai_slug';
          const iconSize = (aiGen && 'regular') || (!aiGen && !serviceNow && 'xs') || 'sm';
          const iconViewBox = (serviceNow && '0 0 24 24') || (aiGen && '4 4 24 24') || '0 0 16 16';
          return (
            <div key={note.id}>
              <div
                className={classNames({
                  [locals.myChatEntry]: myBubble,
                  [locals.chatEntry]: true
                })}
              >
                {!myBubble && (
                  <SvgIcon
                    type={iconType}
                    size={iconSize}
                    viewBox={iconViewBox}
                    className={classNames({
                      [locals.userIcon]: !aiGen && !serviceNow,
                      [locals.snowIcon]: serviceNow,
                      [locals.aiIcon]: aiGen && !serviceNow
                    })}
                  />
                )}
                <div
                  className={classNames({
                    [locals.chatEntryInfo]: !myBubble,
                    [locals.myChatEntryInfo]: myBubble
                  })}
                >
                  {noteNameAndTimeFormat(myBubble, note, date, type)}
                  {aiGen && (
                    <SvgIcon type={'lib_ai_slug'} className={locals.aiIconSlug} size="xs" viewBox={'4 4 24 24'} />
                  )}
                </div>
              </div>
              <ChatBubble
                noteObj={note}
                contents={note.contents}
                data={note.data || note.metadata}
                myBubble={myBubble}
                type={type}
              />
            </div>
          );
        })}
    </div>
  );
}

// Individual chat bubble that has differing colors and stylings based on
// if the text is from me or someone else, ai generated, or external source
export function ChatBubble(props) {
  const { myBubble, contents, data, type, noteObj } = props;
  // Currently we have 4 types of bubbles
  const note = type === 'note';
  const extNote = type === 'external_note';
  const extChange = type === 'external_field_change';
  const aiGen = type === 'ai_generated';
  return (
    <div
      className={classNames({
        [locals.myBubble]: myBubble && note,
        [locals.ext]: extNote || extChange || (!myBubble && note),
        [locals.bubble]: true,
        [locals.aiGenBubble]: aiGen
      })}
    >
      {note && contents}
      {aiGen && (
        <>
          <div className={locals.bubbleContentsHeader}>{t('in-events:notes.sumGenerated')}</div>
          {contents}
        </>
      )}
      {extNote && (
        <>
          <div className={locals.bubbleContentsHeader}>{`${noteObj?.label}`}</div>
          {`${noteObj.author}: `}
          {contents}
        </>
      )}
      {extChange && (
        <>
          <div className={locals.bubbleContentsHeader}>{noteObj?.label}</div>
          {createDataString(data)}
        </>
      )}
    </div>
  );
}
