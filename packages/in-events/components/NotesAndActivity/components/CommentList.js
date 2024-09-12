/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { SvgIcon, CarbonPopover, CarbonPopoverContent, IconButton, CarbonButton } from '@instana/components';

import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import { TYPE_NOTE, TYPE_EXT_NOTE, TYPE_EXT_F_CHANGE, TYPE_AI_SUMMARY } from '../utils';
import { noteNameAndTimeFormat, createDataString, getSummary } from './utils';
import { dateFormat, timeFormat } from 'in-services/formatters/date';
import { Trans, t } from 'in-i18n';

import locals from './CommentList.mless';

export function CommentList(props) {
  const { notes, preferredName, setDisplayQuickStart, displayQuickStart } = props;

  // This adds in the scroll wheel event listener to determine the percentage
  // of the scroll height so we know if we need to collapse and expand the quick actions
  useEffect(() => {
    if (notes) {
      const noteSection = document.getElementById('notesSection');
      // Event listener is cleaned up automatically when the side panel is closed
      // because the `notesSection` dom element gets removed
      noteSection.addEventListener('scroll', event => {
        const scrollHeight = event?.target?.scrollHeight;
        const scrollTop = event?.target?.scrollTop;
        const clientHeight = event?.target?.clientHeight;
        const percentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * -100);
        // We only want to allow the transitional effects whenever the scroll
        // difference is greater than 200.
        const difference = scrollHeight - clientHeight;
        // If we scroll up 50% then collapse the quick actions
        if (percentage > 50 && displayQuickStart && difference > 200) {
          setDisplayQuickStart(false);
        } else if (percentage < 10 && !displayQuickStart && difference > 130) {
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
          const aiSum = type === TYPE_AI_SUMMARY;
          const serviceNow = note.origin === 'ServiceNow';
          const date = formatDateWithActiveLanguage(new Date(note.timestamp), `${dateFormat}, ${timeFormat}`);
          const iconType =
            (!aiSum && serviceNow && 'lib_snow_icon') || (!aiSum && !serviceNow && 'lib_actions_user') || 'lib_ai_slug';
          const iconSize = (aiSum && 'regular') || (!aiSum && !serviceNow && 'xs') || 'sm';
          const iconViewBox = (serviceNow && '0 0 24 24') || (aiSum && '4 4 24 24') || '0 0 16 16';
          // Display the icon if its not my chat message OR if its AI Summary
          const displayIcon = !myBubble || aiSum;
          return (
            <div key={note.id}>
              <div
                className={classNames({
                  [locals.myChatEntry]: myBubble,
                  [locals.chatEntry]: true
                })}
              >
                {displayIcon && (
                  <SvgIcon
                    type={iconType}
                    size={iconSize}
                    viewBox={iconViewBox}
                    className={classNames({
                      [locals.userIcon]: !aiSum && !serviceNow,
                      [locals.snowIcon]: serviceNow,
                      [locals.aiIcon]: aiSum && !serviceNow
                    })}
                  />
                )}
                <div
                  className={classNames({
                    [locals.chatEntryInfo]: displayIcon,
                    [locals.myChatEntryInfo]: myBubble
                  })}
                >
                  {noteNameAndTimeFormat(myBubble, note, date, type)}
                  {aiSum && <AIPopover />}
                </div>
              </div>
              <ChatBubble noteObj={note} contents={note.contents} data={note?.data} myBubble={myBubble} type={type} />
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
  const [showAll, setShowAll] = useState(false);
  // Currently we have 4 types of bubbles
  const note = type === TYPE_NOTE;
  const extNote = type === TYPE_EXT_NOTE;
  const extChange = type === TYPE_EXT_F_CHANGE;
  const updatedBy = (extChange && noteObj?.metadata?.get('updatedBy')) || '';
  const aiSum = type === TYPE_AI_SUMMARY;

  // Calculate the AI Summary
  const sumData = noteObj?.data;
  const subArray = (arr, i = 0, n = 1) => arr.slice(i, n);
  const firstFive = aiSum && subArray(sumData, 0, 5);
  const last = aiSum && subArray(sumData, 5, sumData.length);
  const summaryStart = aiSum && getSummary(firstFive);
  const summaryEnd = aiSum && getSummary(last);

  return (
    <div
      className={classNames({
        [locals.myBubble]: myBubble && note,
        [locals.ext]: extNote || extChange || (!myBubble && note),
        [locals.bubble]: true,
        [locals.aiGenBubble]: aiSum
      })}
    >
      {note && contents}
      {aiSum && (
        <>
          <div className={locals.bubbleContentsHeader}>{t('in-events:notes.sumGenerated')}</div>
          {summaryStart.map(entity => {
            return (
              <div className={locals.summaryList}>
                {`- `}
                <div>{entity}</div>
              </div>
            );
          })}
          {showAll &&
            summaryEnd.map(entity => {
              return (
                <div className={locals.summaryList}>
                  {`- `}
                  <div>{entity}</div>
                </div>
              );
            })}
          {summaryEnd.length > 0 && (
            <CarbonButton
              size="sm"
              onClick={() => {
                setShowAll(!showAll);
              }}
              kind="ghost"
            >
              {!showAll ? t('in-events:notes.showAll') : t('in-events:notes.collapse')}
            </CarbonButton>
          )}
        </>
      )}
      {extNote && (
        <>
          <div className={locals.bubbleContentsHeader}>{`${noteObj?.label}`}</div>
          {`${noteObj.author}: `}
          <div style={{ wordWrap: 'break-word' }}>{contents}</div>
        </>
      )}
      {extChange && (
        <>
          <div className={locals.bubbleContentsHeader}>
            {noteObj?.label}
            <div style={{ fontWeight: 400 }}>{t('in-events:notes.updatedBy', { name: updatedBy })}</div>
          </div>
          {createDataString(data, updatedBy)}
        </>
      )}
    </div>
  );
}

export function AIPopover() {
  const [showPop, setShowPop] = useState(false);
  return (
    <CarbonPopover open={showPop} align={'bottom-end'} caret autoAlign>
      <SvgIcon
        type={'lib_ai_slug'}
        className={locals.aiIconSlug}
        size="xs"
        viewBox={'4 4 24 24'}
        onClick={() => {
          setShowPop(!showPop);
        }}
      />
      <CarbonPopoverContent className={locals.popoverContent}>
        <div className={locals.popupClose}>
          <IconButton
            type={'lib_openclose_cancel'}
            size="compact"
            onClick={() => {
              setShowPop(!showPop);
            }}
          />
        </div>
        <AIExplainedContent />
      </CarbonPopoverContent>
    </CarbonPopover>
  );
}

// Static Function that renders the text content within the popover
// that is explaining the AI being used
export function AIExplainedContent() {
  return (
    <div className={locals.popOverWrapper}>
      <div className={locals.popupDescription}>
        {t('in-events:notes.aiExplained')}
        <div className={locals.popSumTitle}>{t('in-events:notes.summary')}</div>
        <div>{t('in-events:notes.summaryDescription')}</div>
      </div>
      <div>
        <div className={locals.dataTypesHeader}>{t('in-events:notes.dataTypes')}</div>
        <div className={locals.bullet}>
          {'- '}
          <div>
            <Trans i18nKey={'in-events:notes.triggeringEvent'} />
          </div>
        </div>
        <div className={locals.bullet}>
          {'- '}
          <div>
            <Trans i18nKey={'in-events:notes.relatedEvents'} />
          </div>
        </div>
        <div className={locals.bullet}>
          {'- '}
          <div>
            <Trans i18nKey={'in-events:notes.affectedEntities'} />
          </div>
        </div>
      </div>
    </div>
  );
}
