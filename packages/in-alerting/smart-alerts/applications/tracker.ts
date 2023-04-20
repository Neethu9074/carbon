/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  track,
  APPLICATIONS_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE,
  APPLICATIONS_ALERTING_EVENT_DETAILS_VIEW_EDIT_CONFIG,
  APPLICATIONS_ALERTING_MIGRATION_BANNER_DOCS,
  APPLICATIONS_ALERTING_SHOW_DEPRECATION_BANNER,
  APPLICATIONS_ALERTING_SHOW_MIGRATION_NOTIFICATION,
  APPLICATIONS_ALERTING_MIGRATION_NOTIFICATION_DOCS,
  APPLICATIONS_ALERTING_MIGRATION_BANNER_EVENTS,
  APPLICATIONS_ALERTING_MIGRATION_NOTIFICATION_EVENTS,
  APPLICATIONS_ALERTING_DEPRECATED_EVENT_OPEN,
  APPLICATIONS_ALERTING_DEPRECATED_EVENT_MARK_MIGRATED,
  APPLICATIONS_ALERTING_DEPRECATED_EVENT_CONFIRM_MIGRATED,
  APPLICATIONS_ALERTING_DEPRECATED_EVENT_MIGRATE_STARTED,
  APPLICATIONS_ALERTING_DEPRECATED_EVENT_MIGRATE_FINISHED
} from 'in-services/tracking/tracking';

export const applicationsAlertingEventDetailsGoToAnalyze = (e: any) =>
  track(APPLICATIONS_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE, e);
export const applicationsAlertingEventDetailsViewEditConfig = (e: any) =>
  track(APPLICATIONS_ALERTING_EVENT_DETAILS_VIEW_EDIT_CONFIG, e);

export const applicationsAlertingShowDeprecationBanner = (e: object) =>
  track(APPLICATIONS_ALERTING_SHOW_DEPRECATION_BANNER, e);
export const applicationsAlertingShowMigrationNotification = (e: object) =>
  track(APPLICATIONS_ALERTING_SHOW_MIGRATION_NOTIFICATION, e);
export const applicationsAlertingMigrationBannerDocs = (e: object) =>
  track(APPLICATIONS_ALERTING_MIGRATION_BANNER_DOCS, e);
export const applicationsAlertingMigrationNotificationDocs = (e: object) =>
  track(APPLICATIONS_ALERTING_MIGRATION_NOTIFICATION_DOCS, e);
export const applicationsAlertingMigrationBannerEvents = (e: object) =>
  track(APPLICATIONS_ALERTING_MIGRATION_BANNER_EVENTS, e);
export const applicationsAlertingMigrationNotificationEvents = (e: object) =>
  track(APPLICATIONS_ALERTING_MIGRATION_NOTIFICATION_EVENTS, e);
export const applicationsAlertingDeprecatedEventOpen = (e: object) =>
  track(APPLICATIONS_ALERTING_DEPRECATED_EVENT_OPEN, e);
export const applicationsAlertingDeprecatedEventMarkMigrated = (e: object) =>
  track(APPLICATIONS_ALERTING_DEPRECATED_EVENT_MARK_MIGRATED, e);
export const applicationsAlertingDeprecatedEventConfirmMigrated = (e: object) =>
  track(APPLICATIONS_ALERTING_DEPRECATED_EVENT_CONFIRM_MIGRATED, e);
export const applicationsAlertingDeprecatedEventMigrateStarted = (e: object) =>
  track(APPLICATIONS_ALERTING_DEPRECATED_EVENT_MIGRATE_STARTED, e);
export const applicationsAlertingDeprecatedEventMigrateFinished = (e: object) =>
  track(APPLICATIONS_ALERTING_DEPRECATED_EVENT_MIGRATE_FINISHED, e);
