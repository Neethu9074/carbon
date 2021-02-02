/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

export const status = {
  1: {
    explanation: t('in-websites:definitions.stackTraceExplanation01SuccessfullyTranslated'),
    shouldShowExplanation: false,
    linkToConfigurationDialog: false
  },
  2: {
    explanation: t('in-websites:definitions.stackTraceExplanation02CouldNotDownloadJavaScriptMissingAuthentication'),
    shouldShowExplanation: true,
    linkToConfigurationDialog: true
  },
  3: {
    explanation: t('in-websites:definitions.stackTraceExplanation03CouldNotDownloadJavaScriptFailedAuthorization'),
    shouldShowExplanation: true,
    linkToConfigurationDialog: true
  },
  4: {
    explanation: t('in-websites:definitions.stackTraceExplanation04CouldNotDownloadJavaScriptFileWasNotFound'),
    shouldShowExplanation: true,
    linkToConfigurationDialog: true
  },
  5: {
    explanation: t('in-websites:definitions.stackTraceExplanation05CouldNotDownloadJavaScriptHTTPRequestFailed'),
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  },
  6: {
    explanation: t('in-websites:definitions.stackTraceExplanation06NoReferenceToSourceMap'),
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  },
  7: {
    explanation: t('in-websites:definitions.stackTraceExplanation07AnUnknownErrorHappened'),
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  },
  8: {
    explanation: t('in-websites:definitions.stackTraceExplanation08CouldNotDownloadSourceMapMissingAuthentication'),
    shouldShowExplanation: true,
    linkToConfigurationDialog: true
  },
  14: {
    explanation: t('in-websites:definitions.stackTraceExplanation14CouldNotDownloadSourceMapailedAuthorization'),
    shouldShowExplanation: true,
    linkToConfigurationDialog: true
  },
  9: {
    explanation: t('in-websites:definitions.stackTraceExplanation09CouldNotDownloadSourceMapFileWasNotFound'),
    shouldShowExplanation: true,
    linkToConfigurationDialog: true
  },
  10: {
    explanation: t('in-websites:definitions.stackTraceExplanation10CouldNotDownloadSourceMapHTTPRequestFailed'),
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  },
  11: {
    explanation: t('in-websites:definitions.stackTraceExplanation11SourceMapFileParsingFailed'),
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  },
  12: {
    explanation: t('in-websites:definitions.stackTraceExplanation12AnUnknownErrorOccurred'),
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  },
  13: {
    explanation: t('in-websites:definitions.stackTraceExplanation13CouldNotFindOriginalMapping'),
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  },
  15: {
    explanation: t('in-websites:definitions.stackTraceExplanation15TranslationIsOnlyPossible'),
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  },
  16: {
    explanation: t('in-websites:definitions.stackTraceExplanation16ThisStackTraceLinesFileReferenceDoesNotPoint'),
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  },
  17: {
    explanation: t('in-websites:definitions.stackTraceExplanation17CouldCotEstablishTCPTLSConnectionJavaScript'),
    shouldShowExplanation: true,
    linkToConfigurationDialog: false,
    linkToExternalPage:
      'https://instana.com/docs/website_monitoring/faq/#how-can-i-ensure-that-the-instana-servers-can-establish-a-tcptls-connection'
  },
  18: {
    explanation: t('in-websites:definitions.stackTraceExplanation18CouldCotEstablishTCPTLSConnectionSourceMap'),
    shouldShowExplanation: true,
    linkToConfigurationDialog: false,
    linkToExternalPage:
      'https://instana.com/docs/website_monitoring/faq/#how-can-i-ensure-that-the-instana-servers-can-establish-a-tcptls-connection'
  },
  19: {
    explanation: t('in-websites:definitions.stackTraceExplanation19ARequestTimeoutOccurredJavaScript'),
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  },
  20: {
    explanation: t('in-websites:definitions.stackTraceExplanation20ARequestTimeoutOccurredJavaScriptSourceMap'),
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  }
};
