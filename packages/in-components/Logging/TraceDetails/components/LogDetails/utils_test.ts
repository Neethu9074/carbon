/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024, 2024
 */

import { LogSpanExcerpt } from './LogDetails';
import { getCardTitle } from './utils';

describe('utils', () => {
  describe('getCardTitle', () => {
    it('should get card title for LogSpanExcerpt from upper case log levels', () => {
      // GIVEN
      const logSpans: LogSpanExcerpt[] = [
        {
          data: {
            log: {
              level: 'ERROR'
            }
          }
        },
        {
          data: {
            log: {
              level: 'WARN',
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
          errorCount: 1,
          data: {
            level: undefined
          }
        },
        {
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
          data: {}
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
