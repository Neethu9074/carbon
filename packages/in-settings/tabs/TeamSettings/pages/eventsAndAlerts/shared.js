/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export const scopeApplication = 'application';
export const scopeEverything = 'all';
export const scopeDfq = 'dfq';

export const applyOnOptions = [
  { value: scopeApplication, label: t('in-settings:tabs.applicationPerspective') },
  {
    value: scopeDfq,
    label: t('in-settings:tabs.selectedEntitiesOnlyDynamicFocusQuery')
  },
  { value: scopeEverything, label: t('in-settings:tabs.allAvailableEntities') }
];

// If the applyOn-scope is set to application, this is represented as a DFQ like
// entity.application.name:"<applicationName>". This regex checks if the query matches this and it also parses out the
// application name as a capturing group.
export const applicationScopeQueryRegex = /^entity.application.name:"([^"]*)"$/;
export const applicationIdScopeQueryRegex = /^entity.application.id:"([^"]*)"$/;

export function parseQuery(query) {
  if (isBlank(query)) {
    return { applyOn: scopeEverything };
  }

  const splittedQuery = query.split(' OR ');
  let applicationIds = [];
  if (splittedQuery.length >= 1) {
    splittedQuery.map(q => {
      const applicationIdScopeMatch = applicationIdScopeQueryRegex.exec(q);
      if (applicationIdScopeMatch) {
        applicationIds.push(applicationIdScopeMatch[1]);
      }
    });
  }
  const applicationScopeMatch = applicationScopeQueryRegex.exec(query);

  if (applicationIds.length > 0) {
    return {
      applyOn: scopeApplication,
      applicationName: '',
      applicationIds: applicationIds
    };
  }

  if (applicationScopeMatch) {
    return {
      applyOn: scopeDfq,
      applicationName: applicationScopeMatch,
      applicationIds: []
    };
  }
  return { applyOn: scopeDfq };
}

export function serializeQuery(form) {
  const applyOn = form.get('applyOn') ? form.get('applyOn').value : null;
  const query = form.get('query') ? form.get('query').value : null;
  const applicationIds = form.get('applicationIds') ? form.get('applicationIds').value : null;
  if (applyOn === scopeApplication) {
    return applicationIdsToDfq(applicationIds);
  } else if (applyOn === scopeDfq) {
    return query;
  } else {
    return null;
  }
}

export function applicationIdsToDfq(applicationIds) {
  let applicationIdsQueryPart = '';
  if (applicationIds && applicationIds.length > 0) {
    applicationIdsQueryPart = applicationIds.map(appId => `entity.application.id:"${appId}"`).join(' OR ');
  }
  return applicationIdsQueryPart;
}
