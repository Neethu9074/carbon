/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { patterRecognitionLocalisationStrings as t } from 'in-logging/dashboard/Management/localisationStrings';

import locals from 'in-logging/dashboard/Management/PatternRecognitionModal/InitialScreen.mless';

export default function InitialModalScreen() {
  return (
    <div className={locals.container}>
      <h2>{t.gettingStarted}</h2>
      <section>
        <h3>{t.howDoesItWorks}</h3>
        <div>{t.firstDescription_0}</div>
      </section>
      <section>
        <h3>{t.howWillHelpMe}</h3>
        <div>{t.secondDescription_0}</div>
      </section>
    </div>
  );
}
