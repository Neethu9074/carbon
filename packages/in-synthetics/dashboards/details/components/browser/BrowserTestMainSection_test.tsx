/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';

import BrowserTestMainSection from 'in-synthetics/dashboards/details/components/browser/BrowserTestMainSection';
import { t } from 'in-i18n';

describe(BrowserTestMainSection, () => {
  afterEach(() => {
    cleanup();
  });

  it('Render BrowserTestMainSection if request url and content type are defined', () => {
    const dummyResultDataDocType = {
      data: {
        har: {
          log: {
            entries: [
              {
                _resourceType: 'document',
                cache: {},
                connection: '87',
                id: '1b91983f5127d092',
                pageref: 'page_1',
                serverIPAddress: '9.30.161.95',
                startedDateTime: '2024-04-18T10:04:03.600Z',
                time: 134.2749,
                request: {
                  url: 'https://www.ibm.com'
                },
                response: {
                  status: 200,
                  size: 5233,
                  content: {
                    type: 'Document'
                  }
                },
                timings: {}
              }
            ],
            pages: [
              {
                _mimeType: 'text/html',
                _url: 'http://www.ibm.com/',
                comment: '',
                id: 'page_x0',
                pageTimings: {
                  totalTime: 71
                },
                startedDateTime: '2024-04-18T11:38:10.740Z',
                title: 'http://www.ibm.com/',

                totalResponseSize: 1198
              }
            ]
          }
        }
      },
      progress: { loading: false },
      errors: []
    };
    render(
      <BrowserTestMainSection
        details={dummyResultDataDocType}
        startTime={1713440290740}
        finishTime={1713440297570}
        isBrowserType
      />
    );
    expect(screen.getByText(t('in-synthetics:dashboard.detailsPage.timeLineWidget'))).toBeVisible();
  });

  it('Render BrowserTestMainSection even if request url is undefined', () => {
    const dummyResultDataUndefinedType = {
      data: {
        har: {
          log: {
            entries: [
              {
                _resourceType: 'document',
                cache: {},
                connection: '87',
                id: '1b91983f5127d092',
                pageref: 'page_1',
                serverIPAddress: '9.30.161.95',
                startedDateTime: '2024-04-18T10:04:03.600Z',
                time: 134.2749,
                request: {},
                response: {
                  status: 200,
                  size: 5233,
                  content: {
                    type: 'Document'
                  }
                },
                timings: {}
              }
            ],
            pages: [
              {
                _mimeType: 'text/html',
                _url: 'http://www.ibm.com/',
                comment: '',
                id: 'page_x0',
                pageTimings: {
                  totalTime: 71
                },
                startedDateTime: '2024-04-18T11:38:10.740Z',
                title: 'http://www.ibm.com/',

                totalResponseSize: 1198
              }
            ]
          }
        }
      },
      progress: { loading: false },
      errors: []
    };
    render(
      <BrowserTestMainSection
        details={dummyResultDataUndefinedType}
        startTime={1713440290740}
        finishTime={1713440297570}
        isBrowserType
      />
    );
    expect(screen.getByText(t('in-synthetics:dashboard.detailsPage.timeLineWidget'))).toBeVisible();
  });

  it('Render BrowserTestMainSection even if content type is undefined', () => {
    const dummyResultDataUndefinedType = {
      data: {
        har: {
          log: {
            entries: [
              {
                _resourceType: 'document',
                cache: {},
                connection: '87',
                id: '1b91983f5127d092',
                pageref: 'page_1',
                serverIPAddress: '9.30.161.95',
                startedDateTime: '2024-04-18T10:04:03.600Z',
                time: 134.2749,
                request: {
                  url: 'https://www.ibm.com'
                },
                response: {
                  status: 200,
                  size: 5233,
                  content: {}
                },
                timings: {}
              }
            ],
            pages: [
              {
                _mimeType: 'text/html',
                _url: 'http://www.ibm.com/',
                comment: '',
                id: 'page_x0',
                pageTimings: {
                  totalTime: 71
                },
                startedDateTime: '2024-04-18T11:38:10.740Z',
                title: 'http://www.ibm.com/',

                totalResponseSize: 1198
              }
            ]
          }
        }
      },
      progress: { loading: false },
      errors: []
    };
    render(
      <BrowserTestMainSection
        details={dummyResultDataUndefinedType}
        startTime={1713440290740}
        finishTime={1713440297570}
        isBrowserType
      />
    );
    expect(screen.getByText(t('in-synthetics:dashboard.detailsPage.timeLineWidget'))).toBeVisible();
  });

  it('Render BrowserTestMainSection if both request url and content type are undefined', () => {
    const dummyResultDataDocType = {
      data: {
        har: {
          log: {
            entries: [
              {
                _resourceType: 'document',
                cache: {},
                connection: '87',
                id: '1b91983f5127d092',
                pageref: 'page_1',
                serverIPAddress: '9.30.161.95',
                startedDateTime: '2024-04-18T10:04:03.600Z',
                time: 134.2749,
                request: {},
                response: {
                  status: 200,
                  size: 5233,
                  content: {}
                },
                timings: {}
              }
            ],
            pages: [
              {
                _mimeType: 'text/html',
                _url: 'http://www.ibm.com/',
                comment: '',
                id: 'page_x0',
                pageTimings: {
                  totalTime: 71
                },
                startedDateTime: '2024-04-18T11:38:10.740Z',
                title: 'http://www.ibm.com/',

                totalResponseSize: 1198
              }
            ]
          }
        }
      },
      progress: { loading: false },
      errors: []
    };
    render(
      <BrowserTestMainSection
        details={dummyResultDataDocType}
        startTime={1713440290740}
        finishTime={1713440297570}
        isBrowserType
      />
    );
    expect(screen.getByText(t('in-synthetics:dashboard.detailsPage.timeLineWidget'))).toBeVisible();
  });
});
