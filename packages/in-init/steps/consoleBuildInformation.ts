/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable no-console */
import { build } from 'in-services/config';

if (!__DEV__) {
  console.log('%cQuestions about Instana? Contact us via support@instana.com!', 'font-size: 14px; font-weight: bold;');
  console.log('Build information: %s', JSON.stringify(build));
}
