import React from 'react';

import UsageMessage from 'in-components/MessageFlyout/UsageMessage';

export default {
  title: 'Atoms|UsageMessage',
  component: UsageMessage
};

export function Default() {
  return (
    <UsageMessage
      message={{
        type: 'warning',
        onClick: () => {},
        icon: 'lib_kubernetes_label',
        content: 'Your license expires in 6 days!'
      }}
    />
  );
}
