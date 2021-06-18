/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */
import { createOptionsList } from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/createOptions';

describe('in-alerting/smart-alerts/applications/chart/ChartEntitySelector/createOptions', () => {
  describe('createOptionList for an empty AP selection', () => {
    it('should be empty when no APs given', () => {
      const list = createOptionsList();

      expect(list).toStrictEqual([]);
    });
  });

  describe('createOptionList for AP selection', () => {
    const isSelectApLevel = true;
    const dummyId = '0815';

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

describe('createOptionList for Service selection', () => {
  const isSelectServiceLevel = true;

  const dummyId = '0815';
  it('should create services list for only one AP', () => {
    const apListWithOneEntry = {
      data: {
        app: { id: dummyId },
        services: [
          {
            service: { id: dummyId, label: 'testService' },
            metrics: {
              endpoints: [[-1, 1]]
            }
          }
        ]
      }
    };
    const list = createOptionsList([apListWithOneEntry], [dummyId], false, isSelectServiceLevel, {});

    expect(list).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "appId": "0815",
              "icon": "lib_application_service",
              "id": "0815",
              "label": "testService",
              "type": "SERVICE",
            },
          ],
          "label": "Services:",
        },
      ]
    `);
  });
});
