/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import Breadcrumbs from 'in-logging/dashboard/Management/Breadcrumbs';

import locals from 'in-logging/dashboard/Management/Management.mless';

export default function PatternRecognition() {
  return (
    <>
      <Breadcrumbs />
      <section className={locals.content}>Pattern Recognition</section>
    </>
  );
}
