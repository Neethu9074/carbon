import React from 'react';

import {keys$, enable, disable} from 'in-views/configurationView/subview/EumKeys/stores/keys';
import NewAppForm from 'in-views/configurationView/subview/EumKeys/components/NewAppForm';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Key from 'in-views/configurationView/subview/EumKeys/components/Key';
import Section from 'in-views/configurationView/components/Section';
import LifecycleObserver from 'in-components/LifecycleObserver';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';

import './EumKeys.less';

const block = 'in-eum-keys-config';

export default connectTo({
  keys: keys$
}, function EumKeys({keys}) {
  return (
    <div className={block}>
      <LifecycleObserver onWillMount={enable}
                         onWillUnmount={disable} />
      <SubViewHeader>
        End-User Monitoring Keys
      </SubViewHeader>

      {keys == null ?
        <LoadingIndicator type='dark' />
      : null}

      {keys != null ?
        <Section>
          <NewAppForm />
        </Section>
      : null}

      {keys != null ?
        keys.map(key =>
          <Key key={key.id}
               apiKey={key.id}
               name={key.appName} />
        )
      : null}
    </div>
  );
});
