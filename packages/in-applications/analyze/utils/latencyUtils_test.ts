/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { expect } from 'chai';

// @ts-expect-error import { updateLatencyFilters, getLatencySelectionFromFilters } from 'in-applications/analyze/utils/latencyUtils';
import { updateLatencyFilters, getLatencySelectionFromFilters } from 'in-applications/analyze/utils/latencyUtils';
import {
  GREATER_OR_EQUAL_THAN,
  LESS_OR_EQUAL_THAN,
  GREATER_THAN,
  LESS_THAN,
  NOT_EQUAL,
  EQUALS
} from 'in-components/QueryBuilder/tagFilter/operators';
import { DESTINATION, NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';

describe('in-applications/analyze/utils/latencyUtils', () => {
  describe('#getLatencySelectionFromFilters()', () => {
    it('calls - empty filter', () => {
      expect(getLatencySelectionFromFilters('calls', [])).to.deep.equal({});
    });
    it('calls - eq', () => {
      expect(
        getLatencySelectionFromFilters('calls', [
          { name: 'application.name', value: 'Foo', operator: EQUALS, entity: DESTINATION },
          { name: 'call.latency', value: '100', operator: EQUALS, entity: NOT_APPLICABLE }
        ])
      ).to.deep.equal({ from: 100, to: 101 });
    });
    it('calls - neq', () => {
      expect(
        getLatencySelectionFromFilters('calls', [
          { name: 'call.latency', value: '100', operator: NOT_EQUAL, entity: NOT_APPLICABLE }
        ])
      ).to.deep.equal({});
    });
    it('calls - get', () => {
      expect(
        getLatencySelectionFromFilters('calls', [
          { name: 'call.latency', value: '40', operator: GREATER_OR_EQUAL_THAN, entity: NOT_APPLICABLE }
        ])
      ).to.deep.equal({ from: 40 });
    });
    it('calls - gt, get, lt, let', () => {
      expect(
        getLatencySelectionFromFilters('calls', [
          { name: 'call.latency', value: '1000', operator: LESS_THAN, entity: NOT_APPLICABLE },
          { name: 'call.latency', value: '400', operator: LESS_OR_EQUAL_THAN, entity: NOT_APPLICABLE },
          { name: 'call.latency', value: '1000', operator: LESS_OR_EQUAL_THAN, entity: NOT_APPLICABLE },
          { name: 'call.latency', value: '401', operator: LESS_THAN, entity: NOT_APPLICABLE },
          { name: 'call.latency', value: '40', operator: GREATER_OR_EQUAL_THAN, entity: NOT_APPLICABLE },
          { name: 'call.latency', value: '21', operator: GREATER_OR_EQUAL_THAN, entity: NOT_APPLICABLE },
          { name: 'call.latency', value: '100', operator: GREATER_THAN, entity: NOT_APPLICABLE },
          { name: 'call.latency', value: '20', operator: GREATER_THAN, entity: NOT_APPLICABLE }
        ])
      ).to.deep.equal({ from: 101, to: 401 });
    });
    it('calls - invalid selection', () => {
      expect(
        getLatencySelectionFromFilters('calls', [
          { name: 'call.latency', value: '100', operator: LESS_THAN, entity: NOT_APPLICABLE },
          { name: 'call.latency', value: '100', operator: GREATER_THAN, entity: NOT_APPLICABLE }
        ])
      ).to.deep.equal({});
    });
    it('traces - ignoring call.latency filters', () => {
      expect(
        getLatencySelectionFromFilters('traces', [
          { name: 'trace.latency', value: '100', operator: GREATER_THAN, entity: NOT_APPLICABLE },
          { name: 'call.latency', value: '200', operator: LESS_THAN, entity: NOT_APPLICABLE },
          { name: 'call.latency', value: '800', operator: GREATER_THAN, entity: NOT_APPLICABLE },
          { name: 'trace.latency', value: '1000', operator: LESS_THAN, entity: NOT_APPLICABLE }
        ])
      ).to.deep.equal({ from: 101, to: 1000 });
    });
    it('traces - with numeric values', () => {
      expect(
        getLatencySelectionFromFilters('traces', [
          { name: 'trace.latency', value: 30, operator: GREATER_THAN, entity: NOT_APPLICABLE },
          { name: 'trace.latency', value: 100, operator: GREATER_THAN, entity: NOT_APPLICABLE },
          { name: 'trace.latency', value: 400, operator: LESS_THAN, entity: NOT_APPLICABLE },
          { name: 'trace.latency', value: 1000, operator: LESS_THAN, entity: NOT_APPLICABLE }
        ])
      ).to.deep.equal({ from: 101, to: 400 });
    });
  });
  describe('#updateLatencyFilters()', () => {
    it('calls - no pre-existing filter', () => {
      expect(updateLatencyFilters('calls', [], { from: 1, to: 20 })).to.deep.equal([
        { entity: NOT_APPLICABLE, value: 1, name: 'call.latency', operator: GREATER_OR_EQUAL_THAN },
        { entity: NOT_APPLICABLE, value: 20, name: 'call.latency', operator: LESS_THAN }
      ]);
    });
    it('calls - keep previous filter position', () => {
      expect(
        updateLatencyFilters(
          'calls',
          [
            { name: 'application.name', value: 'Foo', operator: EQUALS, entity: DESTINATION },
            { name: 'call.latency', value: '100', operator: LESS_OR_EQUAL_THAN, entity: NOT_APPLICABLE },
            { name: 'call.latency', value: '20', operator: GREATER_OR_EQUAL_THAN, entity: NOT_APPLICABLE },
            { name: 'call.type', value: 'HTTP', operator: EQUALS, entity: NOT_APPLICABLE }
          ],
          { from: 40, to: 80 }
        )
      ).to.deep.equal([
        { name: 'application.name', value: 'Foo', operator: EQUALS, entity: DESTINATION },
        { name: 'call.latency', value: 80, operator: LESS_THAN, entity: NOT_APPLICABLE },
        { name: 'call.latency', value: 40, operator: GREATER_OR_EQUAL_THAN, entity: NOT_APPLICABLE },
        { name: 'call.type', value: 'HTTP', operator: EQUALS, entity: NOT_APPLICABLE }
      ]);
    });
    it('calls - removed unnecessary filters', () => {
      expect(
        updateLatencyFilters(
          'calls',
          [
            { name: 'call.latency', value: '100', operator: LESS_OR_EQUAL_THAN, entity: NOT_APPLICABLE },
            { name: 'call.latency', value: '1000', operator: LESS_THAN, entity: NOT_APPLICABLE },
            { name: 'call.latency', value: '20', operator: GREATER_OR_EQUAL_THAN, entity: NOT_APPLICABLE },
            { name: 'call.type', value: 'HTTP', operator: EQUALS, entity: NOT_APPLICABLE },
            { name: 'call.latency', value: '40', operator: GREATER_THAN, entity: NOT_APPLICABLE }
          ],
          { from: 40, to: 80 }
        )
      ).to.deep.equal([
        { name: 'call.latency', value: 80, operator: LESS_THAN, entity: NOT_APPLICABLE },
        { name: 'call.latency', value: 40, operator: GREATER_OR_EQUAL_THAN, entity: NOT_APPLICABLE },
        { name: 'call.type', value: 'HTTP', operator: EQUALS, entity: NOT_APPLICABLE }
      ]);
    });
    it('calls - put the new latency to filter after to the from filter', () => {
      expect(
        updateLatencyFilters(
          'calls',
          [
            { name: 'application.name', value: 'Foo', operator: EQUALS, entity: DESTINATION },
            { name: 'call.latency', value: '20', operator: GREATER_OR_EQUAL_THAN, entity: NOT_APPLICABLE },
            { name: 'call.type', value: 'HTTP', operator: EQUALS, entity: NOT_APPLICABLE }
          ],
          { from: 40, to: 80 }
        )
      ).to.deep.equal([
        { name: 'application.name', value: 'Foo', operator: EQUALS, entity: DESTINATION },
        { name: 'call.latency', value: 40, operator: GREATER_OR_EQUAL_THAN, entity: NOT_APPLICABLE },
        { name: 'call.latency', value: 80, operator: LESS_THAN, entity: NOT_APPLICABLE },
        { name: 'call.type', value: 'HTTP', operator: EQUALS, entity: NOT_APPLICABLE }
      ]);
    });
    it('calls - put the new latency from filter before to the to filter', () => {
      expect(
        updateLatencyFilters(
          'calls',
          [
            { name: 'application.name', value: 'Foo', operator: EQUALS, entity: DESTINATION },
            { name: 'call.latency', value: '100', operator: LESS_OR_EQUAL_THAN, entity: NOT_APPLICABLE },
            { name: 'call.type', value: 'HTTP', operator: EQUALS, entity: NOT_APPLICABLE }
          ],
          { from: 40, to: 80 }
        )
      ).to.deep.equal([
        { name: 'application.name', value: 'Foo', operator: EQUALS, entity: DESTINATION },
        { name: 'call.latency', value: 40, operator: GREATER_OR_EQUAL_THAN, entity: NOT_APPLICABLE },
        { name: 'call.latency', value: 80, operator: LESS_THAN, entity: NOT_APPLICABLE },
        { name: 'call.type', value: 'HTTP', operator: EQUALS, entity: NOT_APPLICABLE }
      ]);
    });
    it('calls - keep the trace.latency filter', () => {
      expect(
        updateLatencyFilters(
          'calls',
          [
            { name: 'application.name', value: 'Foo', operator: EQUALS, entity: DESTINATION },
            { name: 'call.latency', value: 40, operator: GREATER_OR_EQUAL_THAN, entity: NOT_APPLICABLE },
            { name: 'trace.latency', value: 80, operator: LESS_THAN, entity: NOT_APPLICABLE },
            { name: 'call.type', value: 'HTTP', operator: EQUALS, entity: NOT_APPLICABLE }
          ],
          {}
        )
      ).to.deep.equal([
        { name: 'application.name', value: 'Foo', operator: EQUALS, entity: DESTINATION },
        { name: 'trace.latency', value: 80, operator: LESS_THAN, entity: NOT_APPLICABLE },
        { name: 'call.type', value: 'HTTP', operator: EQUALS, entity: NOT_APPLICABLE }
      ]);
    });
    it('traces - keep the call.latency filter', () => {
      expect(
        updateLatencyFilters(
          'traces',
          [
            { name: 'application.name', value: 'Foo', operator: EQUALS, entity: DESTINATION },
            { name: 'call.latency', value: 40, operator: GREATER_OR_EQUAL_THAN, entity: NOT_APPLICABLE },
            { name: 'trace.latency', value: 80, operator: LESS_THAN, entity: NOT_APPLICABLE },
            { name: 'call.type', value: 'HTTP', operator: EQUALS, entity: NOT_APPLICABLE }
          ],
          { from: 1 }
        )
      ).to.deep.equal([
        { name: 'application.name', value: 'Foo', operator: EQUALS, entity: DESTINATION },
        { name: 'call.latency', value: 40, operator: GREATER_OR_EQUAL_THAN, entity: NOT_APPLICABLE },
        { name: 'trace.latency', value: 1, operator: GREATER_OR_EQUAL_THAN, entity: NOT_APPLICABLE },
        { name: 'call.type', value: 'HTTP', operator: EQUALS, entity: NOT_APPLICABLE }
      ]);
    });
  });
});
