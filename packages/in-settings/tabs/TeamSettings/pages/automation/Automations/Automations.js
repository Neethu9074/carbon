/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

// import React, { Fragment, useState } from 'react';
// import classNames from 'classnames';

// import { useObservable } from '@instana/hooks';
// import { Link } from '@instana/components';

// import {
//   getEntityHref,
//   getEntityIdView,
//   teamSettingsAlertingEventBuiltIn,
//   teamSettingsAlertingEventCustom,
//   teamSettingsAlertingEventCustomNew
// } from 'in-settings/navigation/paths';
// import { getPluginsWithCustomMetricsOptionsObservable } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/customMetricUtils';
// import List, { createNewEntityButton, leftHeaderWithSelectAll } from 'in-settings/components/List';
// import { openEventSubmitFormTracker, viewEventTracker } from 'in-settings/tracker';
// import ComboBox from 'in-components/ComboBox';
// import { t } from 'in-i18n';

// import locals from './Events.mless';

// export default function Events({
//   setTitle = true,
//   tableActions = defaultTableActions,
//   loadEntities,
//   noDataMessage,
//   hiddenIds,
//   pageSize = 20,
//   rightHeader,
//   isSearchable = true,
//   onRowClick,
//   hasRowNavigation = true,
//   inSelectListDialog = false,
//   getHeader = defaultGetHeader(inSelectListDialog, tableActions),
//   /**
//    * 1. Removes filter items for deprected/migrated events
//    * 2. Filters out deprecated/migrated events
//    */
//   withoutDeprecatedEvents
// }) {
//   const [type, setType] = useState(null);
//   const [severity, setSeverity] = useState(null);
//   const [entityType, setEntityType] = useState(null);
//   const [enabled, setEnabled] = useState(null);

//   const entityTypeOptionsOfCustomMetrics = useObservable(getPluginsWithCustomMetricsOptionsObservable, []);
//   const allEntityTypeOptions = filterEntityTypeOptions(
//     withoutDeprecatedEvents,
//     combineAndSortByLabel(entityTypeOptionsOfBuiltInMetrics, entityTypeOptionsOfCustomMetrics)
//   );

//   const loadEvents = useLoadEventsFunction(withoutDeprecatedEvents, loadEntities);
//   adjustTypeOptions(withoutDeprecatedEvents);

//   return (
//     <List
//       title={setTitle ? t('in-settings:tabs.events') : null}
//       getHeader={getHeader}
//       getEntityName={getEntityName}
//       columnDefinitions={columnDefinitions(hasRowNavigation)}
//       tableActions={tableActions}
//       loadEntities={loadEvents}
//       noDataMessage={noDataMessage}
//       pageSize={pageSize}
//       initialOrderBy="name"
//       rightHeader={getRightHeader()}
//       isSearchable={true}
//       searchAttributes={['name', 'description']}
//       extraFilters={createFilters(hiddenIds, type, severity, entityType, enabled)}
//       extraFilterValues={{ type, severity, entityType, enabled }}
//       searchPlaceholder={t('in-settings:tabs.filterEvents')}
//       searchMaxWidth={210}
//       onRowClick={onRowClick}
//       getDetailsHref={
//         onRowClick || !hasRowNavigation ? null : entity => getEntityHref(getDetailsPath(entity), entity.id)
//       }
//     />
//   );

//   function getRightHeader() {
//     return !inSelectListDialog ? rightHeader ?? defaultRightHeader() : inSelectListDialogRightHeader();
//   }

//   function defaultRightHeader() {
//     return (
//       <Fragment>
//         {createNewEntityButton({
//           labelNew: t('in-settings:tabs.newEvent'),
//           pathNew: teamSettingsAlertingEventCustomNew,
//           trackEvent: openEventSubmitFormTracker
//         })}
//         {inSelectListDialogRightHeader()}
//       </Fragment>
//     );
//   }

//   function inSelectListDialogRightHeader() {
//     return (
//       <Fragment>
//         <ComboBox
//           name="filter-type"
//           value={type}
//           options={typeOptions}
//           onChange={e => (e ? setType(e.value) : setType(null))}
//           placeholder={t('in-settings:tabs.type')}
//           className={locals.filterDropdown}
//         />
//         <ComboBox
//           name="filter-severity"
//           value={severity}
//           options={severityOptions}
//           onChange={e => (e ? setSeverity(e.value) : setSeverity(null))}
//           placeholder={t('in-settings:tabs.incidentsSeverity')}
//           className={classNames(locals.severityDropdown, locals.filterDropdown)}
//         />
//         <ComboBox
//           name="filter-entity-type"
//           value={entityType}
//           options={allEntityTypeOptions}
//           onChange={e => (e ? setEntityType(e.value) : setEntityType(null))}
//           placeholder={t('in-settings:tabs.entityType')}
//           className={classNames(locals.entityTypeDropdown, locals.filterDropdown)}
//         />
//         <ComboBox
//           name="filter-enabled"
//           value={enabled}
//           options={enabledOptions}
//           onChange={e => (e ? setEnabled(e.value) : setEnabled(null))}
//           placeholder={t('in-settings:tabs.state')}
//           className={locals.stateDropdown}
//         />
//       </Fragment>
//     );
//   }
// }
