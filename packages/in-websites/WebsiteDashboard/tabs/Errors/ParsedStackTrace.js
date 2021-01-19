/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { StackTraceLines, StackTraceLine, InfoIndicator } from 'in-new-components/StackTrace';
import { status } from 'in-websites/definitions/stackTraceLineTranslationStatus';
import { getLinkToWebsite } from 'in-websites/navigation/paths';
import { isNotBlank } from 'in-services/util/string';
import { role } from 'in-stores/user';

export default function ParsedStackTrace({ websiteId, lines }) {
  return (
    <StackTraceLines>
      {lines.map((line, i) => (
        <StackTraceLine key={i} {...line} indicator={getIndicator(websiteId, line)} />
      ))}
    </StackTraceLines>
  );
}

function getIndicator(websiteId, line) {
  const translationStatus = status[line.translationStatus];
  if (!translationStatus || !translationStatus.shouldShowExplanation) {
    return null;
  }

  let href$;
  let href;
  let external = false;
  let explanation;
  if (role.canConfigureEumApplications && translationStatus.linkToConfigurationDialog) {
    href$ = getLinkToWebsite(websiteId, {
      tabPath: '/configuration/jsStackTraceTranslation'
    });
    explanation = 'Click to configure file download.';
  } else if (translationStatus.linkToExternalPage) {
    href = translationStatus.linkToExternalPage;
    external = true;
    explanation = 'Click to learn more.';
  }

  return (
    <InfoIndicator href$={href$} href={href} external={external}>
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
