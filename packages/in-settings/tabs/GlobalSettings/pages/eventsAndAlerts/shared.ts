/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';

import { isBlank } from 'in-services/util/string';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

export const scopeApplication = 'application';
export const scopeEverything = 'all';
export const scopeDfq = 'dfq';
export const scopeHostsByTag = 'hostsByTag';

const scopeEverythingOption = { value: scopeEverything, label: t('in-settings:tabs.allAvailableEntities') };
const scopeHostsByTagOption = { value: scopeHostsByTag, label: t('in-settings:tabs.selectedEntitiesHostByTag') };
const scopeDfqOption = { value: scopeDfq, label: t('in-settings:tabs.selectedEntitiesOnlyDynamicFocusQuery') };
const scopeApplicationOption = { value: scopeApplication, label: t('in-settings:tabs.applicationPerspective') };

export const applyOnOptions = [scopeApplicationOption, scopeDfqOption, scopeEverythingOption];

export const applyOnOptionsForHostAvailability = [scopeEverythingOption, scopeHostsByTagOption];

// If the applyOn-scope is set to application, this is represented as a DFQ like
// entity.application.name:"<applicationName>". This regex checks if the query matches this and also parses out the
// application name as a capturing group.
export const applicationScopeQueryRegex = /^entity.application.name:"([^"]*)"$/;
export const applicationIdScopeQueryRegex = /^entity.application.id:"([^"]*)"$/;

export interface QueryParsingResult {
  applyOn: string;
  applicationName?: string;
  applicationIds?: string[];
}

export function parseQuery(query: string | Nullish): QueryParsingResult {
  if (isBlank(query)) {
    return { applyOn: scopeEverything };
  }

  const splittedQuery = query!.split(' OR ');
  let applicationIds: string[] = [];
  if (splittedQuery.length >= 1) {
    splittedQuery.map(q => {
      const applicationIdScopeMatch = applicationIdScopeQueryRegex.exec(q);
      if (applicationIdScopeMatch) {
        applicationIds.push(applicationIdScopeMatch[1]);
      }
    });
  }

  if (applicationIds.length > 0) {
    return {
      applyOn: scopeApplication,
      applicationName: '',
      applicationIds: applicationIds
    };
  }

  const applicationScopeMatch = applicationScopeQueryRegex.exec(query!);
  if (applicationScopeMatch) {
    return {
      applyOn: scopeDfq,
      // finding: even while there was a bug of returing the regex instead of the name,
      // there was no place effected. Seems to be dead code.
      // will do some more testing, before removing...
      applicationName: applicationScopeMatch[1]! /* capturing group always exists */,
      applicationIds: []
    };
  }
  return { applyOn: scopeDfq };
}

export function serializeQuery(form: MapForm<any>) {
  const applyOn = (form.get('applyOn') as Field<string>)?.value ?? null;
  const query = (form.get('query') as Field<string>)?.value ?? null;
  const applicationIds = (form.get('applicationIds') as Field<string[]>)?.value ?? null;

  if (applyOn === scopeApplication) {
    return applicationIdsToDfq(applicationIds);
  } else if (applyOn === scopeDfq) {
    return query;
  } else {
    return null;
  }
}

export function applicationIdsToDfq(applicationIds: string[] | Nullish): string {
  return (applicationIds ?? []).map(appId => `entity.application.id:"${appId}"`).join(' OR ');
}
