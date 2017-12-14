import { storiesOf } from '@storybook/react';
import { Map } from 'immutable';
import React from 'react';

import DetailPopupPresenter from 'in-components/DetailPopupPresenter/DetailPopupPresenter';
import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';

storiesOf('components/KeyValuePopup', module).add('Common', () => <Simple />);

function Simple() {
  return (
    <div style={{ padding: '1rem', width: 300 }}>
      <DetailPopupPresenter />
      <KeyValuePopup
        header="Labels"
        data={Map({
          'io.kubernetes.container.name': 'sidecar',
          'io.kubernetes.docker.type': 'container',
          'io.kubernetes.pod.name': 'kube-dns-3468831164-66kjp',
          'io.kubernetes.pod.namespace': 'kube-system',
          'io.kubernetes.container.name2': 'sidecar',
          'io.kubernetes.docker.type2': 'container',
          'io.kubernetes.pod.name2': 'kube-dns-3468831164-66kjp',
          'io.kubernetes.pod.namespace2': 'kube-system'
        })}
      />
    </div>
  );
}
