/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { SvgIcon, CarbonInlineLoading, IconButton, CarbonSearch, CarbonModal, Stack } from '@instana/components';
import { SidePanel } from '@instana/ibm-products';
import { useObservable } from '@instana/hooks';

// Not using Carbon tooltip since tooltip has not been migrated
// Using Carbon tooltip would cause mismatch in design on the page
// since tooltip is used in many places on this page
import Tooltip from 'in-components/Tooltip';
import { getNotes, filterSearchNotes, getSummaryCount } from 'in-events/components/NotesAndActivity/utils';
import { handleUpdateDeleteNote } from 'in-events/components/NotesAndActivity/components/utils';
import { CommentInput } from 'in-events/components/NotesAndActivity/components/CommentInput';
import { QuickActions } from 'in-events/components/NotesAndActivity/components/QuickActions';
import { ShareSummary } from 'in-events/components/NotesAndActivity/components/ShareSummary';
import { CommentList } from 'in-events/components/NotesAndActivity/components/CommentList';
import { handleTracking } from 'in-events/components/NotesAndActivity/components/utils';
import { EVENT_SIDE_PANEL_CLICK } from 'in-services/tracking/eventNames';
import { incidentSummarizationEnabled } from 'in-services/featureFlags';
import { MoveAIChatLauncher } from 'in-events/components/AIChat/AIChat';
import { summaryNotes$, setSummaryNotes } from 'in-stores/incidents';
import { t } from 'in-i18n';

import locals from './NotesAndActivity.mless';

export function OpenNotesAndActivity({ event }) {
  // From the summaryNotes store we get the "open" value
  const summaryNotesData = useObservable(summaryNotes$, [summaryNotes$]);
  const displayNotes = summaryNotesData?.open;

  const incidentId = event?.get('id');

  const openNotes = () => {
    handleTracking(incidentId, EVENT_SIDE_PANEL_CLICK);
    setSummaryNotes(true, summaryNotesData?.generateAISummary, summaryNotesData?.summaryLoading);
    MoveAIChatLauncher('500px');
  };

  if (!displayNotes) {
    return (
      <Tooltip content={t('in-events:notes.openNotes')}>
        <div onClick={openNotes} className={locals.closedNotesWrapper}>
          <Stack direction="horizontal" gap="xxsmall">
            {t('in-events:notes.notesActivity')}
          </Stack>
          <SvgIcon type={displayNotes ? 'lib_sidebar_to_right' : 'lib_sidebar_to_left'} size="s" />
        </div>
      </Tooltip>
    );
  }
  return <></>;
}

export function NotesAndActivity(props) {
  const { event, targetID } = props;
  // Extract the notes from the event
  const notes = getNotes(event);
  const incidentId = event?.get('id');
  const eventType = event?.get('type');
  const problemText = event?.get('problem')?.get('problemText');
  const loading = event == undefined;

  // From the summaryNotes store we get the "open" value
  const summaryNotesData = useObservable(summaryNotes$, [summaryNotes$]);
  const displayNotes = summaryNotesData?.open;

  // Boolean to control when the notes section is opened
  // Current value of the typed out note
  const [note, setNote] = useState('');
  // Edit note when set is an array with first index bing the noteID
  // and the second index determining if its editing (true) or delete (false)
  const [editNoteId, setEditNoteId] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const [displayQuickStart, setDisplayQuickStart] = useState(true);
  // Controls when the side panel has been expanded
  const [stretchOverlay, setStretchOverlay] = useState(false);
  const [needOverlay, setNeedOverlay] = useState(false);
  // Share Modal visible
  const [shareOpen, setShareOpen] = useState(false);
  // Summary Data to pass to the Modal
  const [summaryData, setSummaryData] = useState([]);

  // We ONLY want to display Notes and Activity for incidents
  if (eventType != 'incident') {
    return null;
  }

  const emptyList = notes?.length === 0;
  const filteredNotes = filterSearchNotes(notes, searchInput.toLowerCase());

  return (
    <div id="NotesAndActivityWrapper">
      <SidePanel
        className={locals.sidePanelContainer}
        open={displayNotes}
        slideIn
        selectorPageContent={targetID}
        onRequestClose={() => {
          setSummaryNotes(false, summaryNotesData?.generateAISummary, summaryNotesData?.summaryLoading);
          setStretchOverlay(false);
          setSearchInput('');
          MoveAIChatLauncher('50px');
        }}
        title={t('in-events:notes.notesActivity')}
        size={(stretchOverlay && 'lg') || 'md'}
        subtitle={
          <>
            <IconButton
              kind="action"
              onClick={() => {
                setStretchOverlay(!stretchOverlay);
                if (stretchOverlay) {
                  MoveAIChatLauncher('500px');
                } else {
                  MoveAIChatLauncher('670px');
                }
              }}
              type={(stretchOverlay && 'lib_actions_minimize') || 'lib_actions_maximize'}
              size="compact"
              className={locals.notesIcon}
            />
            <IconButton
              kind="action"
              onClick={() => {
                setOpenSearch(!openSearch);
                setSearchInput('');
              }}
              type={'lib_actions_search'}
              size="compact"
              className={locals.notesIcon}
            />
          </>
        }
      >
        {loading ? (
          <div className={locals.loading}>
            <CarbonInlineLoading />
          </div>
        ) : (
          <div
            className={classNames({
              [locals.notesInPanel]: true
            })}
          >
            <>
              {openSearch && (
                <CarbonSearch
                  className={locals.searchBar}
                  placeholder={t('in-events:notes.searchNotes')}
                  labelText={t('in-events:notes.searchNotes')}
                  onChange={e => {
                    setSearchInput(e?.target?.value);
                  }}
                />
              )}
              {incidentSummarizationEnabled && (
                <QuickActions
                  displayQuickStart={displayQuickStart}
                  incidentId={incidentId}
                  summaryCount={getSummaryCount(notes)}
                />
              )}
              {!incidentSummarizationEnabled && emptyList && <EmptyState />}
              <CommentList
                notes={filteredNotes}
                displayQuickStart={displayQuickStart}
                setDisplayQuickStart={setDisplayQuickStart}
                setNote={setNote}
                setEditNoteId={setEditNoteId}
                setNeedOverlay={setNeedOverlay}
                setShareOpen={setShareOpen}
                setSummaryData={setSummaryData}
                event={event}
              />
              <CommentInput
                note={note}
                setNote={setNote}
                incidentId={incidentId}
                editNoteId={editNoteId}
                setEditNoteId={setEditNoteId}
              />
            </>
          </div>
        )}
      </SidePanel>
      {/* Danger modal for deleting a note */}
      <div className={classNames({ carbonDeleteModalOpen: needOverlay })}>
        <CarbonModal
          danger
          open={editNoteId && editNoteId[1] == false}
          modalHeading={t('in-events:notes.confirmDelete')}
          primaryButtonText={t('in-events:notes.delete')}
          secondaryButtonText={t('in-events:notes.cancel')}
          onRequestSubmit={() => {
            setTimeout(() => {
              setNeedOverlay(false);
            }, 250);
            handleUpdateDeleteNote(incidentId, note, setNote, setEditNoteId, editNoteId);
          }}
          onRequestClose={() => {
            // This silly setTimeout is needed because of clashing z-index values
            // 500 value is the time it takes for the fading out of the modal
            // Once faded we no longer need the overlay
            setTimeout(() => {
              setNeedOverlay(false);
            }, 250);
            setEditNoteId(false);
          }}
        >
          {t('in-events:notes.sureYouWantToDelete')}
          <br />
          <br />
          {t('in-events:notes.actionUndone')}
        </CarbonModal>
      </div>
      <ShareSummary
        summary={summaryData}
        open={shareOpen}
        setShareOpen={setShareOpen}
        setNeedOverlay={setNeedOverlay}
        incidentId={incidentId}
        problemText={problemText}
      />
    </div>
  );
}

// Basic empty state for notes
export function EmptyState() {
  return (
    <div className={locals.emptyWrapper}>
      <h3 className={locals.emptyHeader}>{t('in-events:notes.noActivity')}</h3>
      <p className={locals.emptyInfo}>{t('in-events:notes.noActivityDetails')}</p>
    </div>
  );
}
