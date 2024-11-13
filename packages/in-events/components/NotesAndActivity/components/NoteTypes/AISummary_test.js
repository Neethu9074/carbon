/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { shallow, mount } from 'enzyme';
import Immutable from 'immutable';
import React from 'react';

import { SvgIcon, CarbonIconButton, CarbonInlineLoading } from '@instana/components';

import { AISummary, ShowAllButton } from 'in-events/components/NotesAndActivity/components/NoteTypes/AISummary';

import locals from './AISummary.mless';

describe('AISummary', () => {
  it('renders without errors', () => {
    shallow(<AISummary />);
  });

  it('renders the text in a div with the correct class name', () => {
    const wrapper = shallow(
      <AISummary noteObj={{}} setNeedOverlay={() => {}} setShareOpen={() => {}} setSummaryData={() => {}} event={{}} />
    );
    expect(wrapper.find(`div.${locals.contentsHeader}`)).toHaveLength(3);
    expect(wrapper.find(`div.${locals.contentsHeader}`).at(0).text()).toEqual('Summary of incident:');
    expect(wrapper.find(`div.${locals.contentsHeader}`).at(1).text()).toEqual('Summary of notes:');
    expect(wrapper.find(`div.${locals.contentsHeader}`).at(2).text()).toEqual('Actions taken for similar incidents:');
    expect(wrapper.find(`div.${locals.summaryList}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.summarySection}`)).toHaveLength(2);
    expect(wrapper.find(`div.${locals.summarySection}`).at(0).text()).toEqual('Summary of notes:<NotesEntry />');
    expect(wrapper.find(`div.${locals.summarySection}`).at(1).text()).toEqual(
      'Actions taken for similar incidents:<ActionEntry />'
    );
    expect(wrapper.find(CarbonIconButton)).toHaveLength(2);
    expect(wrapper.find(CarbonInlineLoading)).toHaveLength(0);
    expect(wrapper.find(SvgIcon)).toHaveLength(2);
  });

  it('renders the text in a div with the correct class name when relatedEvents and actions are present', () => {
    const wrapper = mount(
      <AISummary
        noteObj={{
          data: Immutable.fromJS({
            relatedEventSummary: [
              new Map([
                ['entitySummary', 'Entity Summary'],
                ['entityLabel', 'Entity Label']
              ])
            ],
            actionHistorySummary: [
              new Map([
                ['actionName', 'Action Name'],
                ['actionType', 'ACTIONTYPE'],
                ['actionId', 'id']
              ])
            ]
          })
        }}
        setNeedOverlay={() => {}}
        setShareOpen={() => {}}
        setSummaryData={() => {}}
        event={{}}
      />
    );
    expect(wrapper.find(`div.${locals.contentsHeader}`)).toHaveLength(3);
    expect(wrapper.find(`div.${locals.contentsHeader}`).at(0).text()).toEqual('Summary of incident:');
    expect(wrapper.find(`div.${locals.contentsHeader}`).at(1).text()).toEqual('Summary of notes:');
    expect(wrapper.find(`div.${locals.contentsHeader}`).at(2).text()).toEqual('Actions taken for similar incidents:');
    expect(wrapper.find(`div.${locals.summaryList}`)).toHaveLength(2);
    expect(wrapper.find(`div.${locals.summaryList}`).at(0).text()).toEqual('-Entity LabelEntity Summary\n');
    expect(wrapper.find(`div.${locals.summaryList}`).at(1).text()).toEqual('-Action Nametype: ACTIONTYPEloading');
    expect(wrapper.find(`div.${locals.summarySection}`)).toHaveLength(2);
    expect(wrapper.find(`div.${locals.summarySection}`).at(0).text()).toEqual(
      'Summary of notes:No notes available at the time the summary was generated.'
    );
    expect(wrapper.find(`div.${locals.summarySection}`).at(1).text()).toEqual(
      'Actions taken for similar incidents:-Action Nametype: ACTIONTYPEloading'
    );
    expect(wrapper.find(CarbonIconButton)).toHaveLength(2);
    expect(wrapper.find(CarbonInlineLoading)).toHaveLength(1);
    expect(wrapper.find(SvgIcon)).toHaveLength(2);
    expect(wrapper.find(ShowAllButton)).toHaveLength(0);
  });

  it('renders the text in a div with the correct class name when relatedEvents and actions are present with more than 5 entries', () => {
    const wrapper = mount(
      <AISummary
        noteObj={{
          data: Immutable.fromJS({
            relatedEventSummary: [
              new Map([
                ['entitySummary', 'Entity Summary'],
                ['entityLabel', 'Entity Label']
              ]),
              new Map([
                ['entitySummary', 'Entity Summary2'],
                ['entityLabel', 'Entity Label2']
              ]),
              new Map([
                ['entitySummary', 'Entity Summary3'],
                ['entityLabel', 'Entity Label3']
              ]),
              new Map([
                ['entitySummary', 'Entity Summary4'],
                ['entityLabel', 'Entity Label4']
              ]),
              new Map([
                ['entitySummary', 'Entity Summary5'],
                ['entityLabel', 'Entity Label5']
              ]),
              new Map([
                ['entitySummary', 'Entity Summary6'],
                ['entityLabel', 'Entity Label6']
              ])
            ],
            actionHistorySummary: [
              new Map([
                ['actionName', 'Action Name'],
                ['actionType', 'ACTIONTYPE'],
                ['actionId', 'id']
              ]),
              new Map([
                ['actionName', 'Action Name2'],
                ['actionType', 'ACTIONTYPE2'],
                ['actionId', 'id']
              ]),
              new Map([
                ['actionName', 'Action Name3'],
                ['actionType', 'ACTIONTYPE3'],
                ['actionId', 'id']
              ]),
              new Map([
                ['actionName', 'Action Name4'],
                ['actionType', 'ACTIONTYPE4'],
                ['actionId', 'id']
              ]),
              new Map([
                ['actionName', 'Action Name5'],
                ['actionType', 'ACTIONTYPE5'],
                ['actionId', 'id']
              ]),
              new Map([
                ['actionName', 'Action Name6'],
                ['actionType', 'ACTIONTYPE6'],
                ['actionId', 'id']
              ])
            ]
          })
        }}
        setNeedOverlay={() => {}}
        setShareOpen={() => {}}
        setSummaryData={() => {}}
        event={{}}
      />
    );
    expect(wrapper.find(`div.${locals.contentsHeader}`)).toHaveLength(3);
    expect(wrapper.find(`div.${locals.contentsHeader}`).at(0).text()).toEqual('Summary of incident:');
    expect(wrapper.find(`div.${locals.contentsHeader}`).at(1).text()).toEqual('Summary of notes:');
    expect(wrapper.find(`div.${locals.contentsHeader}`).at(2).text()).toEqual('Actions taken for similar incidents:');
    expect(wrapper.find(`div.${locals.summaryList}`)).toHaveLength(10);
    expect(wrapper.find(`div.${locals.summaryList}`).at(0).text()).toEqual('-Entity LabelEntity Summary\n');
    expect(wrapper.find(`div.${locals.summaryList}`).at(1).text()).toEqual('-Entity Label2Entity Summary2\n');
    expect(wrapper.find(`div.${locals.summaryList}`).at(7).text()).toEqual('-Action Name3type: ACTIONTYPE3loading');
    expect(wrapper.find(`div.${locals.summarySection}`)).toHaveLength(2);
    expect(wrapper.find(`div.${locals.summarySection}`).at(0).text()).toEqual(
      'Summary of notes:No notes available at the time the summary was generated.'
    );
    expect(wrapper.find(`div.${locals.summarySection}`).at(1).text()).toEqual(
      'Actions taken for similar incidents:-Action Nametype: ACTIONTYPEloading-Action Name2type: ACTIONTYPE2loading-Action Name3type: ACTIONTYPE3loading-Action Name4type: ACTIONTYPE4loading-Action Name5type: ACTIONTYPE5loadingShow all'
    );
    expect(wrapper.find(CarbonIconButton)).toHaveLength(2);
    expect(wrapper.find(CarbonInlineLoading)).toHaveLength(5);
    expect(wrapper.find(SvgIcon)).toHaveLength(2);
    expect(wrapper.find(ShowAllButton)).toHaveLength(2);
  });

  it('renders the text in a div with the correct class name when relatedEvents and actions are present BUT EMPTY', () => {
    const wrapper = mount(
      <AISummary
        noteObj={{
          data: Immutable.fromJS({
            relatedEventSummary: [],
            actionHistorySummary: []
          })
        }}
        setNeedOverlay={() => {}}
        setShareOpen={() => {}}
        setSummaryData={() => {}}
        event={{}}
      />
    );
    expect(wrapper.find(`div.${locals.contentsHeader}`)).toHaveLength(3);
    expect(wrapper.find(`div.${locals.contentsHeader}`).at(0).text()).toEqual('Summary of incident:');
    expect(wrapper.find(`div.${locals.contentsHeader}`).at(1).text()).toEqual('Summary of notes:');
    expect(wrapper.find(`div.${locals.contentsHeader}`).at(2).text()).toEqual('Actions taken for similar incidents:');
    expect(wrapper.find(`div.${locals.summaryList}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.summarySection}`)).toHaveLength(2);
    expect(wrapper.find(`div.${locals.summarySection}`).at(0).text()).toEqual(
      'Summary of notes:No notes available at the time the summary was generated.'
    );
    expect(wrapper.find(`div.${locals.summarySection}`).at(1).text()).toEqual(
      'Actions taken for similar incidents:No data available at the time the summary was generated.'
    );
    expect(wrapper.find(CarbonIconButton)).toHaveLength(2);
    expect(wrapper.find(CarbonInlineLoading)).toHaveLength(0);
    expect(wrapper.find(SvgIcon)).toHaveLength(2);
    expect(wrapper.find(ShowAllButton)).toHaveLength(0);
  });
});
