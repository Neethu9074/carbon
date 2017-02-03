import React from 'react';

import {addNewRole} from 'in-views/configurationView/subview/RolesConfig/stores/roles';
import Roles from 'in-views/configurationView/subview/RolesConfig/components/Roles';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import Button from 'in-components/Button';

export default function RolesConfig() {
  return (
    <SubViewWrapper>
      <SubViewHeader>
        Role Configuration
      </SubViewHeader>

      <Section>
        <Button kind='info'
                onClick={addNewRole}>
          Add New Role
        </Button>
      </Section>

      <Section>
        <SectionHeading>
          Existing Roles
        </SectionHeading>

        <Roles />
      </Section>
    </SubViewWrapper>
  );
}
