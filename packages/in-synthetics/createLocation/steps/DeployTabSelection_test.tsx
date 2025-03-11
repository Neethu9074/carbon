/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import DeployTabSelection from 'in-synthetics/createLocation/steps/DeployTabSelection';

describe('DeployTabSelection component', () => {
  it('Renders DeployTabSelection component correctly', () => {
    const { container } = render(<DeployTabSelection downloadKey={''} agentKey={''} syntheticAcceptorURL={''} />);

    expect(screen.getByText('Synthetic PoP commands')).toBeInTheDocument();
    const linkElement = screen.getByText('Deploying a self-hosted PoP');
    expect(linkElement.getAttribute('href')).toBe('https://ibm.biz/pop_deployment');

    expect(container.getElementsByTagName('li').length).toBe(2);
    expect(container.getElementsByTagName('li')[0]).toHaveTextContent('Simple');
    expect(container.getElementsByTagName('li')[1]).toHaveTextContent('Redis TLS');

    expect(
      screen.getByRole('button', {
        name: 'Copy'
      })
    ).toBeTruthy();
    expect(
      screen.getByRole('button', {
        name: 'Copy'
      })
    ).not.toBeDisabled();
  });

  test('renders CodeComponent when Simple tab is clicked', () => {
    const { container } = render(<DeployTabSelection downloadKey={''} agentKey={''} syntheticAcceptorURL={''} />);

    fireEvent.click(container.getElementsByTagName('li')[0]);
    expect(screen.getByText('--set redis.tls.enabled=').nextSibling?.textContent).toEqual('false');
  });

  test('renders RedisTLSDeployContent when Redis TLS tab is clicked', () => {
    const { container } = render(<DeployTabSelection downloadKey={''} agentKey={''} syntheticAcceptorURL={''} />);

    fireEvent.click(container.getElementsByTagName('li')[1]);
    expect(screen.getByText('--set redis.tls.enabled=').nextSibling?.textContent).toEqual('true');
    expect(screen.getByText('openssl genrsa -out tls.key')).toBeInTheDocument();
    expect(screen.getByText('kubectl create secret generic syntheticpop-redis -n syn \\')).toBeInTheDocument();
  });
});
