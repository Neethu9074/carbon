/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import {
  SvgIcon,
  CarbonLayer,
  CarbonInlineLoading,
  IconButton,
  CarbonSearch,
  PreviewPill,
  CarbonModal
} from '@instana/components';

// Not using Carbon tooltip since tooltip has not been migrated
// Using Carbon tooltip would cause mismatch in design on the page
// since tooltip is used in many places on this page
import Tooltip from 'in-components/Tooltip';
import { handleUpdateDeleteNote } from 'in-events/components/NotesAndActivity/components/utils';
import { CommentInput } from 'in-events/components/NotesAndActivity/components/CommentInput';
import { QuickActions } from 'in-events/components/NotesAndActivity/components/QuickActions';
import { CommentList } from 'in-events/components/NotesAndActivity/components/CommentList';
import { EVENT_SIDE_PANEL_CLICK } from 'in-services/tracking/eventNames';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { incidentSummarizationEnabled } from 'in-services/featureFlags';
import { getNotes, filterSearchNotes, getSummaryCount } from './utils';
import { CTA_CLICKED } from 'in-services/util/constants';
import { track } from 'in-services/tracking/trackers';
import { t } from 'in-i18n';

import locals from './NotesAndActivity.mless';

export function OpenNotesAndActivity({ displayNotes, setDisplayNotes, event }) {
  const incidentId = event?.get('id');

  const openNotes = () => {
    const { pageRootName, productArea } = getViewTrackingMetaData();
    if (pageRootName && productArea) {
      const data = {
        parentPageName: pageRootName,
        parentPageCategory: productArea,
        CTA: EVENT_SIDE_PANEL_CLICK,
        path: location.hash
      };
      eventTracker({ data, segmentEventName: CTA_CLICKED });
    }

    track(EVENT_SIDE_PANEL_CLICK, { incidentId });

    setDisplayNotes(true);
  };

  if (!displayNotes) {
    return (
      <Tooltip content={t('in-events:notes.openNotes')}>
        <div onClick={openNotes} className={locals.closedNotesWrapper}>
          {t('in-events:notes.notesActivity')}
          <SvgIcon type={displayNotes ? 'lib_sidebar_to_right' : 'lib_sidebar_to_left'} size="s" />
        </div>
      </Tooltip>
    );
  }
  return <></>;
}

export function NotesAndActivity(props) {
  const { event, displayNotes, setDisplayNotes } = props;
  // Extract the notes from the event
  const notes = getNotes(event);
  const incidentId = event?.get('id');
  const eventType = event?.get('type');

  const loading = event == undefined;

  // Boolean to control when the notes section is opened
  // Current value of the typed out note
  const [note, setNote] = useState('');
  const [editNoteId, setEditNoteId] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const [displayQuickStart, setDisplayQuickStart] = useState(true);
  const [stretchOverlay, setStretchOverlay] = useState(false);

  // We ONLY want to display Notes and Activity for incidents
  if (eventType != 'incident') {
    return null;
  }

  if (!displayNotes) {
    return <></>;
  }

  const emptyList = notes?.length === 0;
  const filteredNotes = filterSearchNotes(notes, searchInput.toLowerCase());

  return (
    <>
      <CarbonLayer>
        <div className={locals.headerWrapper}>
          {t('in-events:notes.notesActivity')}
          <PreviewPill />
          <div className={locals.tagIconWrapper}>
            <IconButton
              kind="action"
              onClick={() => {
                setStretchOverlay(!stretchOverlay);
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
            <Tooltip content={t('in-events:notes.closeNotes')}>
              <IconButton
                kind="action"
                onClick={() => {
                  setSearchInput('');
                  setOpenSearch(false);
                  setDisplayNotes(!displayNotes);
                  toggleSidePanel(incidentId);
                }}
                type={displayNotes ? 'lib_sidebar_to_right' : 'lib_sidebar_to_left'}
                size="compact"
                className={locals.notesIcon}
              />
            </Tooltip>
          </div>
        </div>
        <div
          className={classNames({
            [locals.notes]: true,
            [locals.stretch]: stretchOverlay
          })}
        >
          {loading ? (
            <div className={locals.loading}>
              <CarbonInlineLoading />
            </div>
          ) : (
            <>
              {openSearch && (
                <CarbonSearch
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
              />
              <CommentInput
                note={note}
                setNote={setNote}
                incidentId={incidentId}
                editNoteId={editNoteId}
                setEditNoteId={setEditNoteId}
              />
            </>
          )}
        </div>
      </CarbonLayer>
      {/* Danger modal for deleting a note */}
      <CarbonModal
        danger
        open={editNoteId && editNoteId[1] == false}
        modalHeading={t('in-events:notes.confirmDelete')}
        primaryButtonText={t('in-events:notes.delete')}
        secondaryButtonText={t('in-events:notes.cancel')}
        onRequestSubmit={() => {
          handleUpdateDeleteNote(incidentId, note, setNote, setEditNoteId, editNoteId);
        }}
        onRequestClose={() => {
          setEditNoteId(false);
        }}
      >
        {t('in-events:notes.sureYouWantToDelete')}
        <br />
        <br />
        {t('in-events:notes.actionUndone')}
      </CarbonModal>
    </>
  );
}

// Basic empty state for notes
function EmptyState() {
  return (
    <div className={locals.emptyWrapper}>
      <h3 className={locals.emptyHeader}>{t('in-events:notes.noActivity')}</h3>
      <p className={locals.emptyInfo}>{t('in-events:notes.noActivityDetails')}</p>
    </div>
  );
}

// Open the side panel and track the activity click
function toggleSidePanel(incidentId) {
  const { pageRootName, productArea } = getViewTrackingMetaData();
  if (pageRootName && productArea) {
    const data = {
      parentPageName: pageRootName,
      parentPageCategory: productArea,
      CTA: EVENT_SIDE_PANEL_CLICK,
      path: location.hash
    };
    eventTracker({ data, segmentEventName: CTA_CLICKED });
  }

  track(EVENT_SIDE_PANEL_CLICK, { incidentId });
}
