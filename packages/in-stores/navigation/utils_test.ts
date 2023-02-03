/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { eventsPath, physicalPath, physicalTablePath } from 'in-stores/navigation/paths/mainPaths';
import { removeDFQueryFromLocationWhenChangingArea } from 'in-stores/navigation/utils';
import { Location } from 'in-stores/navigation/types';

function dfQueryAfterNavigating(fromPath: string, toPath: string) {
  const location: Location = {
    matrix: {},
    pathname: fromPath,
    query: { q: 'legacyWithDFQ' }
  };
  removeDFQueryFromLocationWhenChangingArea(location, toPath);
  return location.query.q;
}

describe('in-stores/navigation/navigation#removeDFQueryFromLocationWhenChangingArea', () => {
  describe('should NOT remove query (q=) parameter when', () => {
    it('navigate from infra to same infra page', () => {
      expect(dfQueryAfterNavigating(physicalPath, physicalPath)).toBe('legacyWithDFQ');
    });

    it('navigate from infra to another infra page', () => {
      expect(dfQueryAfterNavigating(physicalTablePath, physicalPath)).toBe('legacyWithDFQ');
    });

    it('navigate from events to same events page', () => {
      expect(dfQueryAfterNavigating(eventsPath, eventsPath)).toBe('legacyWithDFQ');
    });

    it('navigate from events to another events page', () => {
      expect(dfQueryAfterNavigating(eventsPath + '/another', eventsPath)).toBe('legacyWithDFQ');
    });
  });

  describe('should remove the query (q=) parameter when', () => {
    it('navigate from non-infra to an infra page', () => {
      expect(dfQueryAfterNavigating(physicalTablePath, '/anyOtherPage')).toBeUndefined();
    });

    it('navigate from infra to another, non-infra page', () => {
      expect(dfQueryAfterNavigating(physicalTablePath, '/anotherPath')).toBeUndefined();
    });

    it('navigate from non-events to an events page', () => {
      expect(dfQueryAfterNavigating('/anyOtherPage', eventsPath)).toBeUndefined();
    });

    it('navigate from events to a non-events page', () => {
      expect(dfQueryAfterNavigating(eventsPath, '/anyOtherPage')).toBeUndefined();
    });
  });
});
