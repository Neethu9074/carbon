import { isBlank } from 'in-services/util/string';

export const scopeApplication = 'application';
export const scopeEverything = 'all';
export const scopeDfq = 'dfq';

// If the applyOn-scope is set to application, this is represented as a DFQ like
// entity.application.name:"<applicationName>". This regex checks if the query matches this and it also parses out the
// application name as a capturing group.
export const applicationScopeQueryRegex = /^entity.application.name:"([^"]*)"$/;

export function parseQuery(query) {
  if (isBlank(query)) {
    return { applyOn: scopeEverything };
  }
  const applicationScopeMatch = applicationScopeQueryRegex.exec(query);
  if (!applicationScopeMatch || applicationScopeMatch.length < 2) {
    return { applyOn: scopeDfq };
  }
  return { applyOn: scopeApplication, applicationName: applicationScopeMatch[1] };
}

export function serializeQuery(form) {
  const applyOn = form.get('applyOn') ? form.get('applyOn').value : null;
  const query = form.get('query') ? form.get('query').value : null;
  const application = form.get('application') ? form.get('application').value : null;
  if (applyOn === scopeApplication) {
    return applicationNameToDfq(application);
  } else if (applyOn === scopeDfq) {
    return query;
  } else {
    return null;
  }
}

export function applicationNameToDfq(applicationName) {
  return `entity.application.name:"${applicationName}"`;
}
