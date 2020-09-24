jest.mock('../../src/services/fetch', () => require('fetch-mock-jest').sandbox());
jest.mock('../../src/services/config');
jest.mock('../../src/serverConfig');

const { getCsrfToken } = require('../../src/services/csrf');
const serverConfig = require('../../src/serverConfig');
const fetchMock = require('../../src/services/fetch');

const validCsrfToken = 'kldsa90031klhjdsa';
const validCookieValue = 'someValidCookieValue';

describe('in-server/src/services/csrf', () => {
  afterEach(() => fetchMock.reset());

  describe('getCsrfToken', () => {
    it('must resolve with CSRF token in response header', async () => {
      fetchMock.mock(
        {
          url: `https://butler/tos-privacy-agreement/csrf/token`,
          headers: {
            Cookie: `${serverConfig.cookie.name}=${validCookieValue}`
          }
        },
        {
          status: 200,
          headers: {
            'x-csrf-token': validCsrfToken
          }
        }
      );

      const result = await getCsrfToken({
        cookies: {
          [serverConfig.cookie.name]: validCookieValue
        }
      });

      expect(result).toEqual(validCsrfToken);
    });

    it('must throw when cookie is invalid', async () => {
      fetchMock.mock(
        {
          url: `https://butler/tos-privacy-agreement/csrf/token`,
          headers: {
            Cookie: `${serverConfig.cookie.name}=abc`
          }
        },
        400
      );

      return getCsrfToken({
        cookies: {
          [serverConfig.cookie.name]: 'abc'
        }
      }).then(
        () => {
          throw new Error('Expected rejected promise');
        },
        () => Promise.resolve()
      );
    });
  });
});
