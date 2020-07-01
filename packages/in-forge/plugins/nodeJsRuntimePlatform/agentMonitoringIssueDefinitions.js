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
    explanationLinkHref: `https://www.instana.com/docs/ecosystem/node-js/#nodejs_collector_initialized_too_late`
  }
};
