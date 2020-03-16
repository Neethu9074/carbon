# in-server

A small Node.js app responsible for serving of the ui-client.

## Used APIs

### Butler

 - `/tos-privacy-agreement/checkUserAcceptance`
 - `/tos-privacy-agreement/checkUserAccessPermitted`
 - `/tos-privacy-agreement/csrf/token`
 - `/tenants/${tenant}/unit/${unit}/acceptors` (TODO whitelisting in LB? Move to other path prefix for whitelisting?)

### Groundskeeper
 - `/internal/units`

### ui-backend
  - `/api/application-monitoring/catalog/tags`
  - `/api/csrf/token`
  - `/api/infrastructure-monitoring/monitoring-state`
  - `/api/permissions`
  - `/api/search/fields`
  - `/api/starred-item`
  - `/api/tos-privacy-agreement/checkUserAcceptance`
  - `/api/ui/settings`
  - `/api/user-settings`
