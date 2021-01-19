/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import getProcessCompanionsInternal from 'in-subscription/getProcessCompanions';
import getHostCompanionsInternal from 'in-subscription/getHostCompanions';
import { timeConfig$ } from 'in-stores/time/config';

export function getHostCompanions(snapshotId) {
  return timeConfig$.flatMap(timeConfig => getHostCompanionsInternal({ timeConfig, snapshotId }));
}

export function getProcessCompanions(snapshotId) {
  return timeConfig$.flatMap(timeConfig => getProcessCompanionsInternal({ timeConfig, snapshotId }));
}
