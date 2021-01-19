/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
jest.mock('../src/services/fetch', () => require('fetch-mock-jest').sandbox());
jest.mock('../src/serverConfig');

const fetchMock = require('../src/services/fetch');

const { getCurrentUser } = require('../src/auth');
const config = require('../src/serverConfig');

const uiBackendBaseUrl = 'https://ui-backend.example.com';
const validCookieValue = 'someValidCookieValue';
const validUserStringValue = JSON.stringify({ name: 'Jane' });

describe('in-server/src/auth', () => {
  afterEach(() => fetchMock.reset());

  describe('getCurrentUser', () => {
    it('must resolve with user string', async () => {
      fetchMock.mock(
        {
          url: `${uiBackendBaseUrl}/api/checkUserAccessPermitted`,
          headers: {
            Cookie: `${config.cookie.name}=${validCookieValue}`
          }
        },
        validUserStringValue
      );

      const result = await getCurrentUser({
        uiBackendBaseUrl,
        cookies: {
          [config.cookie.name]: validCookieValue
        }
      });

      expect(result).toMatchSnapshot();
    });

    it('must resolve without user string on request error', async () => {
      fetchMock.mock(`${uiBackendBaseUrl}/api/checkUserAccessPermitted`, 401);

      const result = await getCurrentUser({
        uiBackendBaseUrl,
        cookies: {
          [config.cookie.name]: 'some cookie value'
        }
      });

      expect(result).toMatchSnapshot();
    });

    it('must not issue backend requests when the cookie is missing', async () => {
      fetchMock.mock(`${uiBackendBaseUrl}/api/checkUserAccessPermitted`, 401);

      const result = await getCurrentUser({
        uiBackendBaseUrl
      });

      expect(result).toMatchSnapshot();
    });
  });
});
