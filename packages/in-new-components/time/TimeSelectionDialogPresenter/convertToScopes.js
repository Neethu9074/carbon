export default function convertToScopes(releaseMarker) {
  const { services = [], applications = [] } = releaseMarker;
  let scopes = [];
  if (services.length === 0 && applications.length === 0) {
    return scopes;
  }
  scopes = convertApplications(applications).map(application => application);
  for (const { id, name, scopedTo } of services) {
    const service = {
      serviceId: id,
      serviceName: name
    };
    if (scopedTo) {
      const scopedApps = convertApplications(scopedTo?.applications);
      for (const { applicationId, applicationName } of scopedApps) {
        scopes.push({
          applicationId,
          applicationName,
          ...service
        });
      }
    } else {
      scopes.push(service);
    }
  }
  return scopes;
}

function convertApplications(applications = []) {
  return applications.map(({ id, name }) => ({
    applicationId: id,
    applicationName: name
  }));
}
