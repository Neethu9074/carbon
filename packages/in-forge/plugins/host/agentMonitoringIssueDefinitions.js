/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

export default {
  ebpf_not_supported: {
    issueDescription: {
      Component: function epbfNotSupported() {
        return (
          <span>
            The Operating System of this host does not seem to offer the extended Berkeley Packet Filter (eBPF)
            functionality that is required by the Process Abnormal Termination detection.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/host#ebpf_not_supported`
  }
};
