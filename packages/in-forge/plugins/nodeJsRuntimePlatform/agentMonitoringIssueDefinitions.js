import React from 'react';

export default {
  nodejs_collector_initialized_too_late: {
    issueDescription: {
      Component: function nodejsCollectorInitializedTooLate() {
        return (
          <span>
            It seems you have initialized the <code>@instana/collector</code> package too late. Tracing might only work
            partially with this setup, that is, some calls will not be captured.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/node-js/#nodejs_collector_initialized_too_late`
  },
  nodejs_collector_native_addon_autoprofile_missing: {
    issueDescription: {
      Component: function nodejsCollectorNativeAddonAutoProfileMissing() {
        return (
          <span>
            The package <code>@instana/autoprofile</code> could not be loaded. You will not get profiling information
            for this Node.js app in Instana, although autoprofiling has been enabled via configuration. This typically
            occurs when native addons could not be installed during module installation (<code>npm install</code>/
            <code>yarn</code>
            ).
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/node-js/#nodejs_collector_native_addon_autoprofile_missing`
  }
};
