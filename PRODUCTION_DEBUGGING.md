# Production debugging

The Instana Ui is a complex component which retrieves a lot of information at a high frequency. Sometimes, it can
happen that user activity results in severe issues. This document describes a few debugging endpoints that come in
handy when analyzing production issues.

## Gathering ui-client debugging data

We have a backchannel which can be used to instruct connected clients to transmit their state to the server. To use
this backchannel, a request has to be sent to a tenant unit's ui-backend:

```
curl -X POST <ui-backend>:<admin-port>/admin/get-ui-debug-data -v --header "Content-Type: application/json" -d '{}'
```

This will do the following:

1.  Enable debug logging for a specific logger within this ui-backend for three minutes.
2.  Forward the debugging instructions to connected clients.
3.  Connected clients will receive these instructions (see `in-services/debuggingBackchannel.js`), gather
    debugging data and transmit this back to ui-backend.
4.  ui-backend will enrich this debugging data and debug log this.

The debugging data will be available in the ui-backend's debug log. Note that this is not forwarded to papertrail!

The debugging instructions support various optional parameters which are described in the following snippet. The
instructions are transmitted with the post request `see the -d parameter`.

```javascript
{
  "selector": {
    // An array of paths which describe what fields should be transmitted for debugging purposes.
    // This is optional and not defining any paths means that no filtering will be applied.
    // Note that this might in turn result in too much data which might in itself result in problems.
    "paths": [
      ["href"],
      ["storeStates"],
      ["visibilityState"],
      ["windowOpenTime"],
      ["subscriptions"],
      ["perSubscriptionCounts"],
      ["transport"]
    ]
  },

  "filter": {
    // Optional filter which ensures that debugging data will only be retrieved for this user. Not defining
    // this parameter implies that debugging data should be retrieved for all users.
    "email": "stan@instana.com"
  }
}
```

A good first debugging instructions can be transmitted in the following way.

```
curl -X POST <ui-backend>:<admin-port>/admin/get-ui-debug-data -v --header "Content-Type: application/json" -d '
{
  "selector": {
    "paths": [
      ["href"],
      ["visibilityState"],
      ["windowOpenTime"],
      ["perSubscriptionCounts"],
      ["transport"]
    ]
  }
}'
```

Which will result in log output like this:

```
2018-09-05 06:41:16,068 [vert.x-eventloop-thread-1] DEBUG c.i.ui.service.UiDebuggingService - Debugging data from stan@instana.com (role: Owner): {"visibilityState":"visible","role":{"id":"-1","name":"Owner","canConfigureServiceMapping":true,"canConfigureEumApplications":true,"canConfigureUsers":true,"canInstallNewAgents":true,"canSeeUsageInformation":true,"canConfigureIntegrations":true,"canSeeOnPremLicenseInformation":true,"canConfigureRoles":true,"canConfigureCustomAlerts":true,"canConfigureApiTokens":true,"canConfigureAgentRunMode":true,"canViewAuditLog":true,"canConfigureObjectives":true,"canConfigureAgents":true,"canConfigureAuthenticationMethods":true,"canConfigureApplications":true},"windowOpenTime":"9s","perSubscriptionCounts":{"subscribe-view":1,"subscribe-snapshot":157,"subscribe-ui-debugging-instructions":1,"subscribe-usage-info":1,"subscribe-health-info":138,"subscribe-is-monitoring":1,"subscribe-raw-events-count":1,"subscribe-message":1,"timestamp":1},"userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36","href":"https://local-instana.instana.io:4000/#/physical?timeline.to&timeline.ws=3600000&v2=true","transport":{"metrics":{"maxSubscriptionId":303,"connectionAttempts":1,"received":222,"transmitted":303},"type":"websocket","url":"wss://local-instana.instana.io:4000/api/data/076/soyqvymm/websocket"},"user":"stan@instana.com"}
```

## Signing out all users

In case of backend problems caused by a flood of UI requests, a good second step (after gathering debugging data) is
to stop these requests from hitting our backend. To do so, we need to force clients to attempt a reconnect that we are
rejecting on the server side. This can be achieved by:

1.  Signing out users which access to a specific tenant unit.
2.  Restarting the ui-backend of that tenant unit.

To sign out users, the following request can be used:

```
# The request is transmitted against the butler admin endpoint
curl -X POST groundskeeper-0-eu-west-1.instana.io:8481/admin/signOutUsersWithAccessTo?tenant=<tenant name>
```

Don't forget to restart ui-backend after signing out these users to force a reconnect!
