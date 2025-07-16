/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  convertIncidentSummaryToString,
  convertActionsToString,
  convertTopActionsToString,
  convertNotesSummaryToString
} from 'in-events/components/NotesAndActivity/components/NoteTypes/utils';

describe('convertIncidentSummaryToString', () => {
  test('should convert the summary object to a string', () => {
    const summaryData = [
      new Map([
        ['entityLabel', 'Label 1'],
        ['entitySummary', 'Summary 1']
      ]),
      new Map([
        ['entityLabel', 'Label 2'],
        ['entitySummary', 'Summary 2']
      ])
    ];

    const result = convertIncidentSummaryToString(summaryData);

    expect(result).toBe(
      'This summary is AI generated\n\nSummary of incident:\n\nLabel 1\nSummary 1\n\nLabel 2\nSummary 2\n\n'
    );
  });

  test('should handle an empty array', () => {
    const summaryData = [];

    const result = convertIncidentSummaryToString(summaryData);

    expect(result).toBe('This summary is AI generated\n\nSummary of incident:\n\n');
  });

  test('should handle null input', () => {
    const summaryData = null;

    const result = convertIncidentSummaryToString(summaryData);

    expect(result).toBe('This summary is AI generated\n\nSummary of incident:\n\n');
  });

  test('should handle long labels and summaries', () => {
    const summaryData = [
      new Map([
        [
          'entityLabel',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci.'
        ],
        [
          'entitySummary',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci.'
        ]
      ])
    ];

    const result = convertIncidentSummaryToString(summaryData);

    expect(result).toBe(
      'This summary is AI generated\n\nSummary of incident:\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci.\n\n'
    );
  });
});

describe('convertActionsToString', () => {
  test('should convert the action object to a string', () => {
    const actionData = [
      new Map([
        ['actionName', 'Label 1'],
        ['actionType', 'Summary 1']
      ]),
      new Map([
        ['actionName', 'Label 2'],
        ['actionType', 'Summary 2']
      ])
    ];

    const result = convertActionsToString(actionData);

    expect(result).toBe(
      'Successful actions taken for similar incidents:\n\nLabel 1\ntype: Summary 1\nLabel 2\ntype: Summary 2\n'
    );
  });

  test('should handle an empty array', () => {
    const actionData = [];

    const result = convertActionsToString(actionData);

    expect(result).toBe(
      'Successful actions taken for similar incidents:\n\nNo data available at the time the summary was generated.\n'
    );
  });

  test('should handle null input', () => {
    const actionData = null;

    const result = convertActionsToString(actionData);

    expect(result).toBe('Successful actions taken for similar incidents:\n\n');
  });

  test('should handle long names and types', () => {
    const actionData = [
      new Map([
        [
          'actionName',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci.'
        ],
        [
          'actionType',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci.'
        ]
      ])
    ];

    const result = convertActionsToString(actionData);

    expect(result).toBe(
      'Successful actions taken for similar incidents:\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci.\ntype: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci.\n'
    );
  });
});

describe('convertNotesSummaryToString', () => {
  test('should convert the action object to a string', () => {
    const notesSummaryData = [
      '1. Restarted the pod as a temporary measure.',
      '2. This incident has been previously reported and is being handled as a duplicate.',
      "3. No action required from the user's side.",
      '4. The previous incident was likely due to high error rates in the GET endpoint.',
      '5. The team needs to investigate the root cause of the persistent failure of the GET endpoint.',
      '6. Josh added this to test the show more button.'
    ];

    const result = convertNotesSummaryToString(notesSummaryData);

    expect(result).toBe(
      `Summary of notes:\n\n1. Restarted the pod as a temporary measure.\n2. This incident has been previously reported and is being handled as a duplicate.\n3. No action required from the user's side.\n4. The previous incident was likely due to high error rates in the GET endpoint.\n5. The team needs to investigate the root cause of the persistent failure of the GET endpoint.\n6. Josh added this to test the show more button.\n`
    );
  });

  test('should handle an empty array', () => {
    const notesSummaryData = [];

    const result = convertNotesSummaryToString(notesSummaryData);

    expect(result).toBe('Summary of notes:\n\nNo notes available at the time the summary was generated.\n');
  });

  test('should handle null input', () => {
    const notesSummaryData = null;

    const result = convertNotesSummaryToString(notesSummaryData);

    expect(result).toBe('Summary of notes:\n\n');
  });
});

describe('convertTopActionsToString', () => {
  it('should handle empty state', () => {
    const out1 = convertTopActionsToString(null);
    const out2 = convertTopActionsToString([]);
    expect(out1).toBe('');
    expect(out2).toBe('');
  });
  it('should return a valid string', () => {
    const input = [
      {
        entity: {
          name: 'First action name',
          description: 'action description',
          typeConfigurations: [
            {
              name: 'manual',
              runnable: {}
            }
          ]
        },
        confidence: 'high',
        aiEngine: 'POLICY'
      },
      {
        entity: {
          name: 'Second',
          description: 'Description number two',
          typeConfigurations: [
            {
              name: 'manual',
              runnable: {}
            }
          ]
        },
        confidence: 'high',
        aiEngine: 'POLICY'
      },
      {
        entity: {
          name: 'Third policy',
          description: 'Third description here.',
          typeConfigurations: [
            {
              name: 'manual',
              runnable: {}
            }
          ]
        },
        confidence: 'high',
        aiEngine: 'POLICY'
      },
      {
        entity: {
          name: '4th policy',
          description: '4th description here.',
          typeConfigurations: [
            {
              name: 'manual',
              runnable: {}
            }
          ]
        },
        confidence: 'high',
        aiEngine: 'POLICY'
      }
    ];
    // All "high"
    let output = convertTopActionsToString(input);
    let expected =
      'There are 4 recommended actions with a high confidence level. Top recommended actions for this incident:\n\n1: First action name (action description)\n2: Second (Description number two)\n3: Third policy (Third description here.)\n';
    expect(output).toBe(expected);
    // All "medium"
    input.forEach(x => (x.confidence = 'medium'));
    output = convertTopActionsToString(input);
    expected =
      'There are 4 recommended actions. Top recommended actions for this incident:\n\n1: First action name (action description)\n2: Second (Description number two)\n3: Third policy (Third description here.)\n';
    expect(output).toBe(expected);
    // One "high"
    input[0].confidence = 'high';
    output = convertTopActionsToString(input);
    expected =
      'There is one recommended action with a high confidence level. Top recommended actions for this incident:\n\n1: First action name (action description)\n2: Second (Description number two)\n3: Third policy (Third description here.)\n';
    expect(output).toBe(expected);
    // Only 1 medium
    input[0].confidence = 'medium';
    output = convertTopActionsToString(input.slice(0, 1));
    expected =
      'There is one recommended action. Top recommended actions for this incident:\n\n1: First action name (action description)\n';
    expect(output).toBe(expected);
  });
});
