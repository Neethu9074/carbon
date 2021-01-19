/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import List from 'in-sdk/components/sidebar/List';

export default function DockerPorts({ snapshot }) {
  const data = snapshot.get('data');
  // PortBindings is new as of 1.1.5, Ports for compatibility
  const portBindings = data.get('PortBindings');
  if (portBindings != null && portBindings.size > 0) {
    return (
      <List>
        {portBindings
          .map((value, key) =>
            value.map(v => (
              <List.Item key={key}>{(v.get('HostIp') || '0.0.0.0') + ':' + v.get('HostPort') + '->' + key}</List.Item>
            ))
          )
          .valueSeq()
          .flatten()}
      </List>
    );
  }

  const ports = data.get('Ports');
  if (ports != null && ports.size > 0) {
    return (
      <List>
        {ports.map(port => (
          <List.Item key={port}>
            {port.get('PrivatePort')}/{port.get('Type')}
          </List.Item>
        ))}
      </List>
    );
  }
  return null;
}
