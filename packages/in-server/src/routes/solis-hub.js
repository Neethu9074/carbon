/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

export const solisHubRoute = async (req, res) => {
  const t = req.t;
  const finalResponseBody = { title: t('in-server:mainNavigation.monitoringObservability'), widgets: [] };

  try {
    const customDashboards = await getCustomDashboards(req);
    const customDashboardWidgets = await createCustomDashboardWidgets(req, customDashboards);
    const eventWidgets = await createEventWidgets(req);

    finalResponseBody.widgets.push(...eventWidgets);
    finalResponseBody.widgets.push(...customDashboardWidgets);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(finalResponseBody));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify(error.message));
  }
};

const createRequest = (req, path) => {
  const newRequest = new Request(req.uiBackendBaseUrl + path);
  newRequest.headers.set('Authorization', req.headers.authorization);

  return newRequest;
};

const getCustomDashboards = async req => {
  const dashboardRequest = createRequest(req, '/api/custom-dashboard');
  const response = await fetch(dashboardRequest);
  const responseObject = await response.json();

  if (!response.ok) {
    throw new Error('error calling /custom-dashboard: ' + JSON.stringify(responseObject));
  }

  return responseObject.slice(0, 10);
};

const createCustomDashboardWidgets = async (req, customDashboards) => {
  const t = req.t;

  return await Promise.all(
    customDashboards.map(dashboard => {
      return new Promise((resolve, reject) => {
        const ownerRequest = createRequest(req, '/api/settings/users/' + dashboard.ownerId);

        fetch(ownerRequest)
          .then(async response => {
            const responseObject = await response.json();

            if (!response.ok) {
              throw new Error('error calling /settings/users: ' + JSON.stringify(responseObject));
            }

            return responseObject;
          })
          .then(data => {
            const tagText = dashboard.annotations.includes('SHARED')
              ? t('in-server:mainNavigation.sharedCustomerDashboard')
              : t('in-server:mainNavigation.customerDashboard');

            resolve({
              type: 'kpi_tile',
              properties: {
                title: dashboard.title,
                tag: { type: 'cyan', children: tagText },
                kpi: { label: t('in-server:mainNavigation.owner'), primary_value: data.fullName }
              },
              href: `#/customDashboards/view;dashboardId=${dashboard.id}`
            });
          })
          .catch(error => {
            reject(error);
          });
      });
    })
  )
    .then(values => {
      return values;
    })
    .catch(error => {
      throw new Error('error calling /settings/users: ' + error.message);
    });
};

const createEventWidgets = async req => {
  const t = req.t;
  const eventRequest = createRequest(req, '/api/events?eventTypeFilters=INCIDENT');
  const response = await fetch(eventRequest);
  const events = await response.json();

  if (!response.ok) {
    throw new Error('error calling /events: ' + JSON.stringify(events));
  }

  let warningEvents = 0,
    criticalEvents = 0,
    totalEvents = 0;

  for (const event of events) {
    if (event.state === 'open' && event.type === 'incident') {
      totalEvents++;
      if (event.severity === 5) {
        warningEvents++;
      } else if (event.severity === 10) {
        criticalEvents++;
      }
    }
  }

  return [
    {
      type: 'kpi_tile',
      properties: {
        title: t('in-server:mainNavigation.criticalEvents'),
        tag: { type: 'high-contrast', children: t('in-server:mainNavigation.event') },
        kpi: { label: t('in-server:mainNavigation.activeTotal'), primary_value: `${criticalEvents}/${totalEvents}` }
      },
      href: '#/events;orderDirection=DESC;orderBy=start;filter;view=incident?q=event.severity%3Acritical%20and%20event.state%3AOPEN'
    },
    {
      type: 'kpi_tile',
      properties: {
        title: t('in-server:mainNavigation.warningEvents'),
        tag: { type: 'high-contrast', children: t('in-server:mainNavigation.event') },
        kpi: { label: t('in-server:mainNavigation.activeTotal'), primary_value: `${warningEvents}/${totalEvents}` }
      },
      href: '#/events;orderDirection=DESC;orderBy=start;filter;view=incident?q=event.severity%3Awarning%20and%20event.state%3AOPEN'
    }
  ];
};
