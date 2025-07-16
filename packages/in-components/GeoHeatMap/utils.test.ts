/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { normalizeMapDataForModalTable, RawDataForModalTable } from 'in-components/GeoHeatMap/utils';

type ModifiedDataForModalTable = { id: string; title: string; value: string }[];

describe('normalizeMapDataForModalTable', () => {
  it('should normalize data with correct input', () => {
    // Given
    const givenInput: RawDataForModalTable = {
      us: { title: 'United States', value: '100' },
      ca: { title: 'Canada', value: '75' },
      uk: { title: 'United Kingdom', value: '90' }
    };

    const expectedOutput = [
      { id: 'us', title: 'United States', value: '100' },
      { id: 'ca', title: 'Canada', value: '75' },
      { id: 'uk', title: 'United Kingdom', value: '90' }
    ];

    // When
    const result = normalizeMapDataForModalTable(givenInput);

    // Then
    expect(result).toEqual(expectedOutput);
  });

  it('should replace empty titles with "Uncategorized"', () => {
    // Given
    const givenInput: RawDataForModalTable = {
      fr: { title: '', value: '85' },
      de: { title: '   ', value: '95' },
      it: { title: 'Italy', value: '80' }
    };

    const expectedOutput = [
      { id: 'fr', title: 'Uncategorized', value: '85' },
      { id: 'de', title: 'Uncategorized', value: '95' },
      { id: 'it', title: 'Italy', value: '80' }
    ];
    // When
    const result = normalizeMapDataForModalTable(givenInput);

    // Then
    expect(result).toEqual(expectedOutput);
  });

  it('should handle empty input object', () => {
    // Given
    const givenInput: RawDataForModalTable = {};
    const expectedOutcome: ModifiedDataForModalTable = [];

    // When
    const result = normalizeMapDataForModalTable(givenInput);

    // Then
    expect(result).toEqual(expectedOutcome);
  });

  it('should handle single entry with empty title', () => {
    // Given
    const givenInput: RawDataForModalTable = {
      xx: { title: '', value: 'test-value' }
    };

    const expectedOutcome = [{ id: 'xx', title: 'Uncategorized', value: 'test-value' }];

    // When
    const result = normalizeMapDataForModalTable(givenInput);

    // Then
    expect(result).toEqual(expectedOutcome);
  });

  it('should preserve original order and handle different titles', () => {
    // Given
    const givenInput: RawDataForModalTable = {
      a1: { title: 'First Country', value: '10' },
      b2: { title: '', value: '20' },
      c3: { title: 'Third Country', value: '30' },
      d4: { title: '  \t\n  ', value: '40' },
      e5: { title: 'Fifth Country', value: '50' }
    };

    const expectedOutcome = [
      { id: 'a1', title: 'First Country', value: '10' },
      { id: 'b2', title: 'Uncategorized', value: '20' },
      { id: 'c3', title: 'Third Country', value: '30' },
      { id: 'd4', title: 'Uncategorized', value: '40' },
      { id: 'e5', title: 'Fifth Country', value: '50' }
    ];

    // When
    const result = normalizeMapDataForModalTable(givenInput);

    // Then
    expect(result).toEqual(expectedOutcome);
  });
});
