import React from 'react';

import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Table from 'in-views/configurationView/subview/AlertsConfig/components/Table';
import Section from 'in-views/configurationView/components/Section';
import {openAlertConfig} from 'in-stores/navigation/configuration';
import {getAlerts} from 'in-services/groundskeeper/alertings';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';


export default connectTo({
  alerts: getAlerts()
},
function AlertsConfig({alerts}) {
  const alertsAvailable = alerts && alerts.size > 0;

  return (
    <SubViewWrapper>
      <SubViewHeader>
        Custom Alert Management
      </SubViewHeader>

      <Section>
        <Button kind='info'
                onClick={() => openAlertConfig()}>
          Add New Alert
        </Button>
      </Section>

      {alertsAvailable ?
        <Section>
          <SectionHeading>
            Custom Alerts
          </SectionHeading>

          <Table items={alerts} />
        </Section>
      : null}
    </SubViewWrapper>
  );
});
