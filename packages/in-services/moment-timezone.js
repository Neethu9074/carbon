/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// A re-export of moment-tz to ensure that all users are relying on the same moment-tz build
// eslint-disable-next-line no-restricted-imports
import moment from 'moment-timezone/builds/moment-timezone-with-data-10-year-range';

export default moment;
