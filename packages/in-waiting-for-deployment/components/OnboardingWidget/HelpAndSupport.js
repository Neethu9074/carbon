import React from 'react';

import ExpandableCard from 'in-new-components/ExpandableCard';
import Button from 'in-new-components/Button';

export default function HelpAndSupport({ trackingService }) {
  return (
    <ExpandableCard title="Help & Support" framed={false} openByDefault={false}>
      <Button
        kind="secondary"
        icon="lib_help_error_help_outline"
        target="_blank"
        href="https://docs.instana.io"
        onClick={() => trackingService.helpAndSupportClicked()}
      >
        Help & Documentation
      </Button>
    </ExpandableCard>
  );
}
