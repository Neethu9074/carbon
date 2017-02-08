import React from 'react';

import AddAlertDialog from 'in-views/configurationView/subview/Alerts/AddAlertDialog';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import {setActiveDialog, close} from 'in-components/DialogPresenter/store';
import {getAlerts, addAlert} from 'in-services/groundskeeper/alertings';
import Section from 'in-views/configurationView/components/Section';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './Alerts.less';


const block = 'in-alters-config';

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
                onClick={openAddAlert}>
          Add Alert
        </Button>
      </Section>

      {alertsAvailable ?
        <Section>
          <SectionHeading>
            Custom Alerts
          </SectionHeading>

          <ul className={`${block}__alerts`}>
            {alerts.map(alert =>
              <Alert key={alert.get('id')}
                     map={alert} />
            )}
          </ul>
        </Section>
      : null}
    </SubViewWrapper>
  );
});

function Alert({map}) {
  return (
    <li className={`${block}__alert`}>
      {map.get('id')}
    </li>
  );
}

function openAddAlert() {
  setActiveDialog(<AddAlertDialog onSubmit={onDoAddAlert} />);
}

function onDoAddAlert(alertId) {
  close();

  addAlert({
    id: alertId
  });
}
