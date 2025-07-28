/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render } from '@testing-library/react';
import { MapForm, createMapForm } from 'formalistic';
import React, { FormEvent } from 'react';

import { just } from '@instana/observables';

import { MessageProps, RenderProps } from 'in-settings/tabs/UserSettings/pages/Profile/apiItemViewDefinitions';
import Profile from 'in-settings/tabs/UserSettings/pages/Profile/Profile';
import { updateUserName } from 'in-settings/api/userProfile';
import { Role } from 'in-types';

const mockGetUser = jest.fn(() => ({ email: 'test@test.test', fullName: 'myTestName', role: {} as Role }));
const mockCreateForm = jest.fn(createMapForm);
const mockTriggerSubmit = jest.fn();
// @ts-expect-error missing types
const mockedUpdateUserName = jest.mocked(updateUserName);
const mockPreventDefault = jest.fn();
const mockSetMessage = jest.fn();

jest.mock('in-settings/api/userProfile');
jest.mock('in-i18n', () => ({
  ...jest.requireActual('in-i18n'),
  t: (key: string) => key,
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey
}));

interface ApiItemViewProps {
  readonly getObservables: any;
  readonly render: (props: RenderProps) => JSX.Element;
  readonly enrichForm: (form: MapForm<any>, data: { result: any } | undefined) => MapForm<any>;
  readonly onSubmit: (
    e: FormEvent,
    { form, setMessage }: { form: MapForm<any>; setMessage: (msg: MessageProps) => void }
  ) => void;
}

jest.mock('in-settings/components/ApiItemView', () => ({
  ...jest.requireActual('in-settings/components/ApiItemView'),
  __esModule: true,
  default: (props: ApiItemViewProps) => {
    expect(props.getObservables).toBeTruthy();
    expect(props.render).toBeTruthy();
    expect(props.enrichForm).toBeTruthy();
    expect(props.onSubmit).toBeTruthy();

    let form = props.enrichForm(mockCreateForm(), { result: { user: mockGetUser() } });
    mockTriggerSubmit.mockImplementation(() =>
      // @ts-expect-error mocking issue
      props.onSubmit({ preventDefault: mockPreventDefault }, { form, setMessage: mockSetMessage })
    );
    return (
      <div id="api-item-view">
        <props.render form={form} setForm={f => (form = f)} setCanSaveItem={() => null} user={mockGetUser()} />
      </div>
    );
  }
}));

describe('in-settings/tabs/UserSettings/pages/Profile/Profile', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should render the page as expected', async () => {
    const { getByText, getByPlaceholderText } = render(<Profile />);

    expect(getByText('in-settings:tabs.profile.pageName')).toBeInTheDocument(); // Page Title
    expect(getByText('in-settings:tabs.profile.email')).toBeInTheDocument(); // Email heading
    expect(getByText('test@test.test')).toBeInTheDocument(); // actual email
    expect(getByText('in-settings:tabs.profile.emailHint')).toBeInTheDocument(); // email hint
    expect(getByText('in-settings:tabs.profile.name')).toBeInTheDocument(); // name heading
    expect(getByPlaceholderText('in-settings:tabs.profile.name')).toBeInTheDocument();
    expect(getByPlaceholderText('in-settings:tabs.profile.name')).toHaveValue('myTestName');
    expect(getByText('in-settings:tabs.profile.nameHint')).toBeInTheDocument(); // name hint
  });

  it('should allow to change the name', async () => {
    mockedUpdateUserName.mockImplementation((fullName: string) => just({ email: 'test@test.test', fullName }));
    const { getByPlaceholderText } = render(<Profile />);

    const nameInput = getByPlaceholderText('in-settings:tabs.profile.name');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue('myTestName');
    fireEvent.change(nameInput, { target: { value: 'my-new-name' } });
    expect(nameInput).toHaveValue('my-new-name');
    mockTriggerSubmit();
    expect(mockedUpdateUserName).toHaveBeenCalledTimes(1);
    expect(mockedUpdateUserName).toHaveBeenCalledWith('my-new-name');
  });
});
