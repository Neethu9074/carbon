/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { SpanExcerpt } from '@instana/types/typeDefinitions';

import { LogSpanExcerpt } from './LogDetails';
import { getCardTitle } from './utils';

const mockSpanExcerpt: Omit<SpanExcerpt, 'data'> = {
  duration: 500,
  errorCount: 0,
  foreignParentId: '123',
  kind: 'UNKNOWN',
  name: 'testSpan',
  stackTrace: [{ file: 'testFile.ts', line: '10', method: 'testFunction' }],
  start: 1000
};

describe('in-components/Logging/TraceDetails/components/LogDetails/utils', () => {
  describe('getCardTitle', () => {
    it('should get card title for LogSpanExcerpt from upper case log levels', () => {
      // GIVEN
      const logSpans: LogSpanExcerpt[] = [
        {
          ...mockSpanExcerpt,
          data: {
            log: {
              level: 'ERROR'
            }
          }
        },
        {
          ...mockSpanExcerpt,
          data: {
            log: {
              level: 'WARN'
            }
          }
        }
      ];

      const expectedCardTitle = '1 Error, 1 Warning';

      // WHEN
      let cardTitle = getCardTitle(logSpans);

      // THEN
      expect(cardTitle).toBe(expectedCardTitle);
    });

    it('should parse error count', () => {
      // GIVEN
      const logSpans: LogSpanExcerpt[] = [
        {
          ...mockSpanExcerpt,
          errorCount: 1,
          data: {
            log: {}
          }
        },
        {
          ...mockSpanExcerpt,
          data: {
            log: {
              level: 'WARN'
            }
          }
        }
      ];

      const expectedCardTitle = '1 Error, 1 Warning';

      // WHEN
      let cardTitle = getCardTitle(logSpans);

      // THEN
      expect(cardTitle).toBe(expectedCardTitle);
    });

    it('should handle undefined log level as warning', () => {
      // GIVEN
      const logSpans: LogSpanExcerpt[] = [
        {
          ...mockSpanExcerpt,
          data: {
            log: {}
          }
        }
      ];

      const expectedCardTitle = '1 Warning';

      // WHEN
      let cardTitle = getCardTitle(logSpans);

      // THEN
      expect(cardTitle).toBe(expectedCardTitle);
    });
  });
});
