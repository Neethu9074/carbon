/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import Immutable from 'immutable';
import React from 'react';

import { SvgIcon, CarbonIconButton, CarbonInlineLoading } from '@instana/components';

import { AISummary, ShowAllButton } from 'in-events/components/NotesAndActivity/components/NoteTypes/AISummary';
import { TopThreeActions } from 'in-events/components/NotesAndActivity/components/TopThreeActions';

// import actionsLocals from 'in-events/components/NotesAndActivity/components/ActionHistory.mless';
import locals from 'in-events/components/NotesAndActivity/components/NoteTypes/AISummary.mless';

jest.mock('@instana/hooks', () => {
  return {
    useObservable: jest.fn().mockImplementation(() => {
      // We'll create the Immutable object in the test setup instead
      return {};
    })
  };
});

jest.mock('in-automation/AutomationCard/useScoredActions', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({ data: [], progress: { loading: false }, errors: [] }),
  useUserRecommendedScoredActions: jest.fn().mockReturnValue({ data: [] })
}));

jest.mock('in-automation/AutomationCard/useTrigger', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({})
}));

jest.mock('in-automation/ActionCatalog/useAction', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({ data: {}, progress: { loading: false }, errors: [] })
}));

describe('AISummary', () => {
  // Set up mocks before each test
  beforeEach(() => {
    // Set up the useObservable mock to return an Immutable object
    const { useObservable } = require('@instana/hooks');
    useObservable.mockImplementation(() => Immutable.fromJS({}));
  });

  // Clean up after each test to prevent async operations from continuing
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without errors', () => {
    shallow(<AISummary />);
  });

  it('renders the text in a div with the correct class name', () => {
    const wrapper = shallow(
      <AISummary
        noteObj={{}}
        setNeedOverlay={() => {}}
        setShareOpen={() => {}}
        setSummaryData={() => {}}
        event={Immutable.fromJS({})}
      />
    );
    expect(wrapper.find(`div.${locals.contentsHeader}`)).toHaveLength(2);
    expect(wrapper.find(`div.${locals.contentsHeader}`).at(0).text()).toEqual('Summary of incident:');
    expect(wrapper.find(`div.${locals.contentsHeader}`).at(1).text()).toEqual('Summary of notes:');
    expect(wrapper.find(`div.${locals.summaryList}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.summarySection}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.summarySection}`).text()).toEqual('Summary of notes:<NotesEntry />');
    expect(wrapper.find(CarbonIconButton)).toHaveLength(4);
    expect(wrapper.find(CarbonInlineLoading)).toHaveLength(0);
    expect(wrapper.find(SvgIcon)).toHaveLength(2);
  });

  it('renders the text in a div with the correct class name when relatedEvents, notes, and actions are present', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <AISummary
          noteObj={{
            data: Immutable.fromJS({
              watsonxSummary: Immutable.fromJS({
                recentEventsSummary: [
                  new Map([
                    ['entitySummary', 'Entity Summary'],
                    ['entityLabel', 'Entity Label']
                  ])
                ],
                notesSummary: ['this is summary of notes']
              }),
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
          event={Immutable.fromJS({ triggeringEvent: 'asdfasdf' })}
        />
      );
      // Wait for any pending promises
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(wrapper.find(`div.${locals.contentsHeader}`)).toHaveLength(2);
    expect(wrapper.find(`div.${locals.contentsHeader}`).at(0).text()).toEqual('Summary of incident:');
    expect(wrapper.find(`div.${locals.contentsHeader}`).at(1).text()).toEqual('Summary of notes:');
    // expect(wrapper.find(`div.${locals.title}`).at(1).text()).toEqual('Recommended actions');
    expect(wrapper.find(`div.${locals.summaryList}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.summaryList}`).at(0).text()).toEqual('-Entity LabelEntity Summary\n');
    expect(wrapper.find(`div.${locals.summarySection}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.summarySection}`).text()).toEqual('Summary of notes:this is summary of notes');
    expect(wrapper.find(CarbonIconButton)).toHaveLength(4);
    expect(wrapper.find(CarbonInlineLoading)).toHaveLength(0);
    expect(wrapper.find(SvgIcon)).toHaveLength(2);
    expect(wrapper.find(ShowAllButton)).toHaveLength(0);
  });

  it('renders the text in a div with the correct class name when relatedEvents and actions are present with more than 5 entries', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <AISummary
          noteObj={{
            data: Immutable.fromJS({
              watsonxSummary: Immutable.fromJS({
                recentEventsSummary: [
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
                notesSummary: ['this is summary of notes we dont go over 5']
              }),
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
          event={Immutable.fromJS({ triggeringEvent: 'asdfasdf' })}
        />
      );
      // Wait for any pending promises
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(wrapper.find(`div.${locals.contentsHeader}`)).toHaveLength(2);
    expect(wrapper.find(`div.${locals.contentsHeader}`).at(0).text()).toEqual('Summary of incident:');
    expect(wrapper.find(`div.${locals.contentsHeader}`).at(1).text()).toEqual('Summary of notes:');
    expect(wrapper.find(`div.${locals.summaryList}`)).toHaveLength(5);
    expect(wrapper.find(`div.${locals.summaryList}`).at(0).text()).toEqual('-Entity LabelEntity Summary\n');
    expect(wrapper.find(`div.${locals.summaryList}`).at(1).text()).toEqual('-Entity Label2Entity Summary2\n');
    expect(wrapper.find(`div.${locals.summarySection}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.summarySection}`).at(0).text()).toEqual(
      'Summary of notes:this is summary of notes we dont go over 5'
    );
    expect(wrapper.find(CarbonIconButton)).toHaveLength(4);
    expect(wrapper.find(CarbonInlineLoading)).toHaveLength(0);
    expect(wrapper.find(SvgIcon)).toHaveLength(2);
    expect(wrapper.find(ShowAllButton)).toHaveLength(1);
  });

  it('renders the text in a div with the correct class name when recentEventsSummary, notes, and actions are present BUT EMPTY', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <AISummary
          noteObj={{
            data: Immutable.fromJS({
              watsonxSummary: Immutable.fromJS({
                recentEventsSummary: []
                // When there are no notes summary the object wont be here
                // notesSummary: []
              }),
              actionHistorySummary: []
            })
          }}
          setNeedOverlay={() => {}}
          setShareOpen={() => {}}
          setSummaryData={() => {}}
          event={Immutable.fromJS({ triggeringEvent: 'asdfasdf' })}
        />
      );
      // Wait for any pending promises
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(wrapper.find(`div.${locals.contentsHeader}`)).toHaveLength(2);
    expect(wrapper.find(`div.${locals.contentsHeader}`).at(0).text()).toEqual('Summary of incident:');
    expect(wrapper.find(`div.${locals.contentsHeader}`).at(1).text()).toEqual('Summary of notes:');
    expect(wrapper.find(`div.${locals.summaryList}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.summarySection}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.summarySection}`).at(0).text()).toEqual(
      'Summary of notes:No notes available at the time the summary was generated.'
    );
    expect(wrapper.find(CarbonIconButton)).toHaveLength(4);
    expect(wrapper.find(CarbonInlineLoading)).toHaveLength(0);
    expect(wrapper.find(SvgIcon)).toHaveLength(2);
    expect(wrapper.find(ShowAllButton)).toHaveLength(0);
  });

  it('renders the TopThreeActions component', () => {
    const wrapper = shallow(
      <AISummary
        noteObj={{}}
        setNeedOverlay={() => {}}
        setShareOpen={() => {}}
        setSummaryData={() => {}}
        event={Immutable.fromJS({ triggeringEvent: 'test-event-id' })}
      />
    );
    expect(wrapper.find(TopThreeActions)).toHaveLength(1);
  });

  it('passes the correct props to TopThreeActions', async () => {
    // Mock the useScoredActions and useUserRecommendedScoredActions hooks
    const mockScoredActions = {
      data: [{ id: 'action1' }, { id: 'action2' }, { id: 'action3' }],
      progress: { loading: false },
      errors: []
    };
    const mockRecommendedActions = { data: [{ id: 'action1' }, { id: 'action2' }, { id: 'action3' }] };
    const mockTrigger = { data: { id: 'trigger1' }, progress: { loading: false }, errors: [] };

    const useScoredActions = require('in-automation/AutomationCard/useScoredActions').default;
    const { useUserRecommendedScoredActions } = require('in-automation/AutomationCard/useScoredActions');
    const useTrigger = require('in-automation/AutomationCard/useTrigger').default;

    useScoredActions.mockReturnValue(mockScoredActions);
    useUserRecommendedScoredActions.mockReturnValue(mockRecommendedActions);
    useTrigger.mockReturnValue(mockTrigger);

    // Mock the useObservable hook to return a triggering event
    const { useObservable } = require('@instana/hooks');
    const mockTriggeringEvent = Immutable.fromJS({ id: 'test-event-id', name: 'Test Event' });
    useObservable.mockReturnValue(mockTriggeringEvent);

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <AISummary
          noteObj={{}}
          setNeedOverlay={() => {}}
          setShareOpen={() => {}}
          setSummaryData={() => {}}
          event={Immutable.fromJS({ triggeringEvent: 'test-event-id' })}
        />
      );
      // Wait for any pending promises
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const topThreeActions = wrapper.find(TopThreeActions);
    expect(topThreeActions).toHaveLength(1);

    // Check that the correct props are passed
    expect(topThreeActions.prop('recommendedActions')).toEqual(mockRecommendedActions);
    expect(topThreeActions.prop('firstThreeActions')).toEqual(mockRecommendedActions.data.slice(0, 3));
    expect(topThreeActions.prop('trigger')).toEqual(mockTrigger);
    expect(topThreeActions.prop('triggeringEvent')).toEqual(mockTriggeringEvent.toJS());
  });

  it('handles the case when recommendedActions has errors', async () => {
    // Mock the useScoredActions and useUserRecommendedScoredActions hooks with errors
    const mockRecommendedActions = {
      data: [],
      progress: { loading: false },
      errors: [{ code: 'ERROR_CODE', message: 'Error message' }]
    };

    const { useUserRecommendedScoredActions } = require('in-automation/AutomationCard/useScoredActions');
    useUserRecommendedScoredActions.mockReturnValue(mockRecommendedActions);

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <AISummary
          noteObj={{}}
          setNeedOverlay={() => {}}
          setShareOpen={() => {}}
          setSummaryData={() => {}}
          event={Immutable.fromJS({ triggeringEvent: 'test-event-id' })}
        />
      );
      // Wait for any pending promises
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const topThreeActions = wrapper.find(TopThreeActions);
    expect(topThreeActions).toHaveLength(1);
    expect(topThreeActions.prop('recommendedActions')).toEqual(mockRecommendedActions);
  });

  it('handles the case when recommendedActions is loading', async () => {
    // Mock the useScoredActions and useUserRecommendedScoredActions hooks with loading state
    const mockRecommendedActions = {
      data: [],
      progress: { loading: true },
      errors: []
    };

    const { useUserRecommendedScoredActions } = require('in-automation/AutomationCard/useScoredActions');
    useUserRecommendedScoredActions.mockReturnValue(mockRecommendedActions);

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <AISummary
          noteObj={{}}
          setNeedOverlay={() => {}}
          setShareOpen={() => {}}
          setSummaryData={() => {}}
          event={Immutable.fromJS({ triggeringEvent: 'test-event-id' })}
        />
      );
      // Wait for any pending promises
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const topThreeActions = wrapper.find(TopThreeActions);
    expect(topThreeActions).toHaveLength(1);
    expect(topThreeActions.prop('recommendedActions')).toEqual(mockRecommendedActions);
  });

  it('includes TopThreeActions in the fullSummaryText for sharing', async () => {
    // Mock the recommended actions with entity data
    const mockRecommendedActions = {
      data: [
        {
          entity: { name: 'Action 1', description: 'Description 1' },
          confidence: 'high'
        },
        {
          entity: { name: 'Action 2', description: 'Description 2' },
          confidence: 'medium'
        }
      ],
      progress: { loading: false },
      errors: []
    };

    const { useUserRecommendedScoredActions } = require('in-automation/AutomationCard/useScoredActions');
    useUserRecommendedScoredActions.mockReturnValue(mockRecommendedActions);

    // Create a spy on the setSummaryData function
    const setSummaryDataSpy = jest.fn();

    // Create the component
    const wrapper = shallow(
      <AISummary
        noteObj={{
          id: 'test-note-id',
          data: Immutable.fromJS({
            watsonxSummary: Immutable.fromJS({
              recentEventsSummary: [
                new Map([
                  ['entitySummary', 'Entity Summary'],
                  ['entityLabel', 'Entity Label']
                ])
              ],
              notesSummary: ['this is summary of notes']
            })
          })
        }}
        setNeedOverlay={() => {}}
        setShareOpen={() => {}}
        setSummaryData={setSummaryDataSpy}
        event={Immutable.fromJS({ triggeringEvent: 'test-event-id' })}
      />
    );

    // Find the share button and simulate a click
    const shareButton = wrapper.find(CarbonIconButton).at(0);
    shareButton.simulate('click');

    // Verify that setSummaryData was called
    expect(setSummaryDataSpy).toHaveBeenCalled();

    // Get the actual text that was passed to setSummaryData
    const actualText = setSummaryDataSpy.mock.calls[0][0];

    // Check that the text includes action-related content
    expect(actualText).toContain('recommended actions');
    expect(actualText).toContain('Action 1');
    expect(actualText).toContain('Action 2');
  });
});
