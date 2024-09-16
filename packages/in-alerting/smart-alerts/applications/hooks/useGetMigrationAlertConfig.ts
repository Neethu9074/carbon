/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useObservable } from '@instana/hooks';

//@ts-expect-error  Need TS migration
import { doMigrationInTearSheet } from 'in-alerting/migration/MigrateToSmartAlerts';

export default function useGetMigrationAlertConfig(
  eventSpecificationId: string,
  migrationMode: boolean,
  isGlobalSmartAlert: boolean
) {
  const fetchMigrationConfig = useObservable(migrationMode && doMigrationInTearSheet(eventSpecificationId), [
    migrationMode,
    eventSpecificationId
  ]);

  if (!migrationMode) {
    return {};
  }
  //@ts-expect-error
  const { globalApplicationsAlertConfig, applicationAlertConfig, scopeMigrationDetails } = fetchMigrationConfig ?? {};
  const migrateAlertConfig = isGlobalSmartAlert ? globalApplicationsAlertConfig : applicationAlertConfig;

  return { scopeMigrationDetails, migrateAlertConfig };
}
