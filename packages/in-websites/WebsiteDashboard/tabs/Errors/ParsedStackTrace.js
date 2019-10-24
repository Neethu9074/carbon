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
  if (role.canConfigureEumApplications && translationStatus.linkToConfigurationDialog) {
    href$ = getLinkToWebsite(websiteId, {
      tabPath: '/configuration/jsStackTraceTranslation'
    });
  }

  return (
    <InfoIndicator href$={href$}>
      {translationStatus.explanation}
      {isNotBlank(translationStatus.translationExplanation) &&
        translationStatus.translationExplanation !== 'null' && (
          <Fragment>
            <br />
            <strong>translationStatus.translationExplanation</strong>
          </Fragment>
        )}
      {href$ && (
        <Fragment>
          <br />
          <strong>Click to configure file download.</strong>
        </Fragment>
      )}
    </InfoIndicator>
  );
}
