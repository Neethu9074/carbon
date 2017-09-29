import React from 'react';

import { keys$, enable, disable } from 'in-views/configurationView/subview/EumKeys/stores/keys';
import NewAppForm from 'in-views/configurationView/subview/EumKeys/components/NewAppForm';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Key from 'in-views/configurationView/subview/EumKeys/components/Key';
import Section from 'in-views/configurationView/components/Section';
import LifecycleObserver from 'in-components/LifecycleObserver';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

export default connectTo(
  {
    keys: keys$
  },
  function EumKeys({ keys }) {
    return (
      <SubViewWrapper>
        <Title title="Eum Keys" />
        <LifecycleObserver onWillMount={enable} onWillUnmount={disable} />
        <SubViewHeader>Website Monitoring Keys</SubViewHeader>

        {keys == null ? <LoadingIndicator type="dark" /> : null}

        {keys != null ? (
          <Section>
            <NewAppForm />
          </Section>
        ) : null}

        {keys != null ? keys.map(key => <Key key={key.id} apiKey={key.id} name={key.appName} />) : null}
      </SubViewWrapper>
    );
  }
);
