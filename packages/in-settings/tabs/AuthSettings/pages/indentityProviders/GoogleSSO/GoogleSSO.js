import React from 'react';

import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import Title from 'in-components/Title';

export default function GoogleSSO() {
  return (
    <SettingsDetailPage>
      <Title title="Google SSO Configuration" />
      <SubViewHeader subscript="Configure allowed email domains.">Google SSO Configuration</SubViewHeader>

      <form>
        <p>
          Only users with email addresses at the following domains will be allowed to sign in to your Instana tenant:
        </p>
      </form>
    </SettingsDetailPage>
  );
}
