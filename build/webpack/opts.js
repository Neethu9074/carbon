/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */

exports.isDevModeBuild = process.env.BUILD_DEV === 'true';
exports.hasDetailedSourceMaps = process.env.DETAILED_SOURCEMAPS === 'true';
