/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */
import { createOptionsList } from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/createOptions';

describe('in-alerting/smart-alerts/applications/chart/ChartEntitySelector/createOptions', () => {
  describe('createOptionList for AP selection', () => {
    const isSelectApLevel = true;
    const dummyId = '0815';

    it('should be empty when no APs given', () => {
      const list = createOptionsList();

      expect(list).toStrictEqual([]);
    });

    it('should ignore "empty" entries', () => {
      const emptyEntry = {};
      const validEntry = { data: { id: '123' } };

      const list = createOptionsList([emptyEntry, validEntry], [dummyId], isSelectApLevel);

      expect(list.map(i => i.id)).toStrictEqual(['123']);
    });

    it('should sort APs alphabetically', () => {
      const apWithLabel = label => ({ data: { label } });

      const list = createOptionsList(['1', 'a', 'B', 'c', 'aa'].map(apWithLabel), [dummyId], isSelectApLevel);

      expect(list.map(i => i.label)).toStrictEqual(['1', 'a', 'aa', 'B', 'c']);
    });
  });
});
