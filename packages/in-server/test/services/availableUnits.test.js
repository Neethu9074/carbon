/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
jest.mock('../../src/services/fetch', () => require('fetch-mock-jest').sandbox());
jest.mock('../../src/services/config');
jest.mock('../../src/services/loadingCache');

const { getUnitInfo } = require('../../src/services/availableUnits');
const fetchMock = require('../../src/services/fetch');

describe('in-server/src/services/availableUnits', () => {
  afterEach(() => fetchMock.reset());

  describe('getUnitInfo', () => {
    it('must provide unit information', async () => {
      addMockedGroundskeeperResponse();
      const unit = await getUnitInfo('instana', 'test');
      expect(unit.id).toEqual('b');
    });

    it('must return undefined when unit cannot be found', async () => {
      addMockedGroundskeeperResponse();
      const unit = await getUnitInfo('instana', 'unknown');
      expect(unit).toEqual(undefined);
    });

    it('must error when groundskeeper network access fails', async () => {
      fetchMock.mock(
        {
          url: `https://groundskeeper/internal/units`
        },
        {
          throws: new TypeError('Failed to fetch')
        }
      );

      expect(getUnitInfo('instana', 'unknown')).rejects.toThrow('Failed to fetch');
    });

    it('must error when groundskeeper returns an error', async () => {
      fetchMock.mock(
        {
          url: `https://groundskeeper/internal/units`
        },
        500
      );

      expect(getUnitInfo('instana', 'unknown')).rejects.toThrow(/Failed to provide/);
    });
  });

  function addMockedGroundskeeperResponse() {
    fetchMock.mock(
      {
        url: `https://groundskeeper/internal/units`
      },
      JSON.stringify([
        {
          id: 'a',
          tenant: 'instana',
          unit: 'prod'
        },
        {
          id: 'b',
          tenant: 'instana',
          unit: 'test'
        }
      ])
    );
  }
});
