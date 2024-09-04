/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { SvgIcon, CarbonTag, CarbonLayer, CarbonInlineLoading, IconButton, CarbonSearch } from '@instana/components';

// Not using Carbon tooltip since tooltip has not been migrated
// Using Carbon tooltip would cause mismatch in design on the page
// since tooltip is used in many places on this page
import Tooltip from 'in-components/Tooltip';
import { CommentInput } from 'in-events/components/NotesAndActivity/components/CommentInput';
import { QuickActions } from 'in-events/components/NotesAndActivity/components/QuickActions';
import { CommentList } from 'in-events/components/NotesAndActivity/components/CommentList';
import { EVENT_SIDE_PANEL_CLICK } from 'in-services/tracking/eventNames';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { CTA_CLICKED } from 'in-services/util/constants';
import { getNotes, filterSearchNotes } from './utils';
import { track } from 'in-services/tracking/trackers';
import { user } from 'in-stores/user';
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
  // Flag determines if the customer has "generate summary" capability
  const aiFlagEnabled = true;
  const { event, displayNotes, setDisplayNotes } = props;
  // Extract the notes from the event
  const notes = getNotes(event);
  const incidentId = event?.get('id');
  const eventType = event?.get('type');

  const loading = event == undefined;

  // Boolean to control when the notes section is opened
  // Current value of the typed out note
  const [note, setNote] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const [displayQuickStart, setDisplayQuickStart] = useState(true);

  function toggleSidePanel() {
    setDisplayNotes(!displayNotes);
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

  // We ONLY want to display Notes and Activity for incidents
  if (eventType != 'incident') {
    return null;
  }

  if (!displayNotes) {
    return <></>;
  }

  // TESTING PURPOSES ONLY
  // notes.push({
  //   type: "external_note",
  //   id: "note-12345",
  //   parent: "bZn54ySOQaGEyt9Ls2eZ3g",
  //   timestamp: 1692892800000,
  //   updated: 0,
  //   author: "johndoe",
  //   metadata: {
  //     apiToken: "iid-valid-api-token",
  //     createdBy: "johndoe",
  //     priority: "High",
  //     userId: null
  //   },
  //   origin: "",
  //   internal: true,
  //   label: "Work Notes",
  //   contents: "This is an internal note regarding the test"})
  // notes.push({
  //   type: 'external_note',
  //   id: 'note-123fddf45',
  //   parent: 'vQ9n1JcfTXKZC-5DsY_74Q',
  //   timestamp: 1692892800000,
  //   updated: 0,
  //   author: 'Jaydon Blue',
  //   metadata: {
  //     apiToken: 'iid-valid-api-token',
  //     createdBy: 'Jaydon Blue',
  //     priority: 'High',
  //     userId: null
  //   },
  //   origin: 'ServiceNow',
  //   internal: true,
  //   label: 'Work Notes',
  //   contents: 'This is an internal note regarding the issue.'
  // });
  // notes.push({
  //   type: 'ai_generated',
  //   id: 'QNxHdd2JGRWG5OayzLX3dgadfadsfadsg',
  //   parent: 'SIqsdfetSR2mFBzafaqKNVy1GQ',
  //   timestamp: 1722957105978,
  //   updated: 0,
  //   author: 'Denton Zan',
  //   metadata: {},
  //   contents:
  //     'traffic related problem(s) has been observed, which is: The system has encountered an error rate that is at least 0% and as high as 500%, specifically with status code 442 and 500, indicating a significant server-side issue.'
  // });
  // notes.push({
  //   author: 'Steve Sarkisian',
  //   contents: "Hey this is Coach Sark! Just wanted to let you know I'm looking into this incident!",
  //   id: 'a8s9d0fuds89afjds9af',
  //   parent: 'aklsdfjasfjasdfdas',
  //   timestamp: 1724956897828,
  //   type: 'note',
  //   updated: 0
  // });
  // notes.push({
  //   type: 'external_note',
  //   id: 'QNxaHX2JGRWG5OayzLX3dgg',
  //   parent: 'SIqmHetSR2mFBzqKNVy1GQ',
  //   timestamp: 1722957105978,
  //   updated: 0,
  //   author: 'Quinn Ewers',
  //   metadata: {},
  //   origin: 'ServiceNow',
  //   internal: false,
  //   label: 'Additional comments',
  //   contents: 'This is an external_note that has been brought to you by.... SERVICE NOW!'
  // });
  // notes.push({
  //   type: 'external_field_change',
  //   id: 'QNxHX2JGRWG5OayzLX3ddgg',
  //   parent: 'SIqmHetSR2mFBzqKNVy1GQ',
  //   timestamp: 1722957105978,
  //   updated: 0,
  //   author: 'Denton Zan',
  //   metadata: {},
  //   origin: 'ServiceNow',
  //   label: 'Field changes',
  //   data: [
  //     ['Priority', '0', '1 - Critical'],
  //     ['Incident state', 'opened', 'In progress'],
  //     ['Opened by', '', 'ITIL User']
  //   ]
  // });
  // ^^^^^^^^^^^^^^^^^^^^^^^TESTING PURPOSES ONLY

  const filteredNotes = filterSearchNotes(notes, searchInput.toLowerCase());

  return (
    <CarbonLayer className={locals.notesHeaderWrapper}>
      <div className={locals.headerWrapper}>
        {t('in-events:notes.notesActivity')}
        <div className={locals.tagIconWrapper}>
          <CarbonTag type="blue">{t('in-events:notes.techPreview')}</CarbonTag>
          <IconButton
            kind="action"
            onClick={() => setOpenSearch(!openSearch)}
            type={'lib_actions_search'}
            size="compact"
            className={locals.notesIcon}
          />
          <Tooltip content={t('in-events:notes.closeNotes')}>
            <IconButton
              kind="action"
              onClick={() => toggleSidePanel()}
              type={displayNotes ? 'lib_sidebar_to_right' : 'lib_sidebar_to_left'}
              size="compact"
              className={locals.notesIcon}
            />
          </Tooltip>
        </div>
      </div>
      <div className={locals.notes}>
        {loading ? (
          <div className={locals.loading}>
            <CarbonInlineLoading />
          </div>
        ) : (
          <>
            {openSearch && (
              <CarbonSearch
                placeholder={t('in-events:notes.searchNotes')}
                onChange={e => {
                  setSearchInput(e?.target?.value);
                }}
              />
            )}
            {aiFlagEnabled && <QuickActions displayQuickStart={displayQuickStart} />}
            <CommentList
              notes={filteredNotes}
              preferredName={user.preferredName}
              displayQuickStart={displayQuickStart}
              setDisplayQuickStart={setDisplayQuickStart}
            />
            <CommentInput note={note} user={user} setNote={setNote} incidentId={incidentId} />
          </>
        )}
      </div>
    </CarbonLayer>
  );
}
