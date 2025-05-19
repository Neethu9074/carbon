/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// eslint-disable-next-line no-restricted-imports
import { AILabel, AILabelContent } from '@carbon/react';
import React from 'react';

import { Link } from '@instana/components';

import {
  localisationStrings,
  patterRecognitionLocalisationStrings
} from 'in-logging/dashboard/Management/localisationStrings';

import locals from 'in-logging/dashboard/Management/Management.mless';

export function LogPatternsAiLabel() {
  return (
    <AILabel>
      <AILabelContent>
        <div className={locals.popHoverContainer}>
          <span>{patterRecognitionLocalisationStrings.aiExpained}</span>
          <h1>{localisationStrings.patternRecognition}</h1>
          <p>{patterRecognitionLocalisationStrings.popHoverFirstDescription}</p>
          <hr />
          <span>{patterRecognitionLocalisationStrings.hotItWorks}</span>
          <p className={locals.popHoverDesc}>{patterRecognitionLocalisationStrings.popHoverSecondDescription}</p>
          <hr />
          <Link externalWithIcon href={'#'}>
            {patterRecognitionLocalisationStrings.learnMore}
          </Link>
        </div>
      </AILabelContent>
    </AILabel>
  );
}
