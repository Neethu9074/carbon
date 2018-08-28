// needs to be kept in sync with
// https://github.com/instana/fleet/blob/master/ansible/roles/fleet_deploy_component/templates/ui-client.hcl.j2
module.exports = {
  releaseNotesEnabled: true,
  maintenanceNotesEnabled: false,
  useInstanaSaasEumTrackingUrlEnabled: true,
  tenantSwitcherEnabled: true,
  onPremLicenseInformationEnabled: false,
  oneZeroAppDataPresentationEnabled: true,
  oneZeroSupportedUntilMessageEnabled: true,
  twoZeroAppDataEnabled: true,
  twoZeroAppDataPresentationEnabled: true,
  twoZeroLearnMoreButtonEnabled: true,
  particlesInFlowMapEnabled: true,
  pingComparisonEnabled: true
};
