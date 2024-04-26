/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import DetailParamsTab from 'in-automation/components/ActionHistory/DetailParamsTab';

jest.mock(
  'in-components/tables/ServerTable/ServerTablePresenter',
  // eslint-disable-next-line react/no-unused-prop-types
  () => (props: { items: any[]; page: number; pageSize: number; orderBy: string; orderDirection: string }) =>
    <div data-testid="server-table-presenter">ServerTablePresenter - {JSON.stringify(props)}</div>
);

type Parameter = {
  displayName: string;
  name: string;
  value: string;
  type: string;
};

describe('DetailParamsTab', () => {
  const mockParams: Parameter[] = [
    { displayName: 'CPU', name: 'cpu', value: 'test', type: 'static' },
    { displayName: 'Memory', name: 'memory', value: '16GB', type: 'dynamic' }
  ];

  it('renders without crashing', () => {
    render(<DetailParamsTab inputParameters={mockParams} />);
    expect(screen.getByTestId('server-table-presenter')).toBeInTheDocument();
  });

  it('passes correct props to ServerTablePresenter', () => {
    render(<DetailParamsTab inputParameters={mockParams} />);
    const presenterElement = screen.getByTestId('server-table-presenter');
    const propsText = presenterElement.textContent!;
    expect(propsText).toContain(
      '"items":[{"displayName":"CPU","name":"cpu","value":"test","type":"static"},{"displayName":"Memory","name":"memory","value":"16GB","type":"dynamic"}]'
    );
    expect(propsText).toContain('"page":0');
    expect(propsText).toContain('"pageSize":10');
    expect(propsText).toContain('"orderBy":"id"');
    expect(propsText).toContain('"orderDirection":"ASC"');
  });
});
