/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { InfoIndicator, StackTraceLine, StackTraceLines } from 'in-components/StackTrace';
import { status } from 'in-websites/definitions/stackTraceLineTranslationStatus';
import { useGenerateLinkToWebsite } from 'in-websites/navigation/paths';
import { isNotBlank } from 'in-services/util/string';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function ParsedStackTrace({ websiteId, lines }) {
  return (
    <StackTraceLines>
      {lines.map((line, i) => (
        <StackTraceLine key={i} {...line} indicator={<Indicator websiteId={websiteId} line={line} />} />
      ))}
    </StackTraceLines>
  );
}

function Indicator({ websiteId, line }) {
  const translationStatus = status[line.translationStatus];

  const getLinkToWebsite = useGenerateLinkToWebsite();

  if (!translationStatus || !translationStatus.shouldShowExplanation) {
    return null;
  }

  let href;
  let explanation;
  if (role.canConfigureEumApplications && translationStatus.linkToConfigurationDialog) {
    href = getLinkToWebsite(websiteId, {
      tabPath: '/configuration/jsStackTraceTranslation'
    });
    explanation = t('in-websites:websiteDashboard.tabs.errors.parsedStackTraceExplanationClickToConfigureFileDownload');
  } else if (translationStatus.linkToExternalPage) {
    href = translationStatus.linkToExternalPage;
    explanation = t('in-websites:websiteDashboard.tabs.errors.parsedStackTraceExplanationClickToLearnMore');
  }

  return (
    <InfoIndicator href={href}>
      {translationStatus.explanation}
      {isNotBlank(line.translationExplanation) && line.translationExplanation !== 'null' && (
        <Fragment>
          <br />
          <strong>{line.translationExplanation}</strong>
        </Fragment>
      )}
      {explanation && (
        <Fragment>
          <br />
          <strong>{explanation}</strong>
        </Fragment>
      )}
    </InfoIndicator>
  );
}
