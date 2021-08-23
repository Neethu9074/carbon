/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { SPECS } from 'in-forge/plugins/domino/Dashboard/Content';

import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.domino,

  technologyDescriptor: {
    label: 'Domino'
  }
});
