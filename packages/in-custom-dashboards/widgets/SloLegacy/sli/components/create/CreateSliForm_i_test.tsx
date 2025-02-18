/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { mount, shallow } from 'enzyme';
import React from 'react';

import { Message } from '@instana/components';
import { Application } from '@instana/types';
import { just } from '@instana/observables';

import CreateSliForm from 'in-custom-dashboards/widgets/SloLegacy/sli/components/create/CreateSliForm';
import { createSliConfiguration } from 'in-custom-dashboards/widgets/SloLegacy/sli/api';
import { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { createForm } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliForm';
import { addMessage as aM } from 'in-components/MessageFlyout/stores/messages';
import { error, successObservable } from 'in-services/util/result';
import { t } from 'in-i18n';

jest.mock('in-components/MessageFlyout/stores/messages', () => ({
  addMessage: jest.fn()
}));

jest.mock('in-custom-dashboards/widgets/SloLegacy/sli/api');

const addMessage = aM as jest.MockedFunction<typeof aM>;

describe('in-custom-dashboards/widgets/SloLegacy/sli/create/CreateSliForm', () => {
  beforeEach(jest.clearAllMocks);

  it('renders a success message when onSave is successful', () => {
    // Given
    const sliName = 'someSliName';
    const entityType = 'application';
    const sliConfig = { sliName };
    const mockApplication: Application = {
      id: '1',
      label: 'Stans Lab',
      boundaryScope: 'INBOUND'
    };
    const form = createForm(entityType, sliConfig, '1', mockApplication);

    // @ts-expect-error
    createSliConfiguration.mockReturnValueOnce(
      successObservable({
        id: 'someId',
        createdAt: Date.now(),
        sliName,
        sliEntity: {}
      })
    );

    // When
    const wrapper = shallow(
      <CreateSliForm
        entityType="application"
        form={form}
        onSave={() => just({})}
        updateForm={jest.fn()}
        setFooter={jest.fn()}
        close={jest.fn}
        filterExpressionValid
      >
        {null}
      </CreateSliForm>
    );

    wrapper.simulate('submit', wrapper.first().prop('form'));

    // Then
    expect(addMessage).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: 'info',
        timeout: 4000,
        title: t('in-custom-dashboards:widgets.slo.createSliForm.sliCreateSuccess'),
        content: t('in-custom-dashboards:widgets.slo.createSliForm.sliCreated', {
          sliName
        })
      }),
      expect.stringMatching('custom-dashboard-sli')
    );
  });

  it('renders a error message when onSubmit fails', () => {
    // Given
    const sliName = 'someSliName';
    const entityType = 'application';
    const sliConfig = { sliName };
    const mockApplication: Application = {
      id: '1',
      label: 'Stans Lab',
      boundaryScope: 'INBOUND'
    };
    const form = createForm(entityType, sliConfig, '1', mockApplication);

    // @ts-expect-error
    createSliConfiguration.mockReturnValueOnce(just(error([{ code: 404, message: 'not found' }])));

    // When
    const wrapper = shallow(
      <CreateSliForm
        entityType="application"
        form={form}
        onSave={() => just({})}
        updateForm={jest.fn()}
        setFooter={jest.fn()}
        close={jest.fn}
        filterExpressionValid
      >
        {null}
      </CreateSliForm>
    );

    wrapper.simulate('submit', wrapper.first().prop('form'));

    // Then
    expect(addMessage).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: 'danger',
        timeout: 4000,
        title: t('in-custom-dashboards:widgets.slo.createSliForm.failCreateSli'),
        content: t('in-custom-dashboards:widgets.slo.createSliForm.problemCreateSli', {
          sliName
        })
      }),
      expect.stringMatching('custom-dashboard-error')
    );
  });

  it('renders a cancel button that calls close when clicked', () => {
    // Given
    const entityType = 'application';
    const sliConfig = { sliName: 'someSliName' };
    const mockApplication: Application = {
      id: '1',
      label: 'Stans Lab',
      boundaryScope: 'INBOUND'
    };
    const form = createForm(entityType, sliConfig, '1', mockApplication);
    let footer: React.ReactNode;
    const setFooter = (f: React.ReactNode) => {
      footer = f;
    };
    const close = jest.fn();

    // When
    mount(
      <CreateSliForm
        entityType="application"
        form={form}
        setFooter={setFooter}
        close={close}
        updateForm={jest.fn()}
        onSave={jest.fn()}
      >
        {null}
      </CreateSliForm>
    );
    const wrapper = mount(<div>{footer}</div>);
    wrapper.find(CancelButton).simulate('click');

    // Then
    expect(wrapper.containsMatchingElement(<CancelButton />)).toBeTruthy();
    expect(close).toBeCalled();
  });

  it('does not call createSliConfiguration if the filterExpression is invalid', () => {
    // Given
    const entityType = 'application';
    const sliConfig = { sliName: 'someSliName' };
    const mockApplication: Application = {
      id: '1',
      label: 'Stans Lab',
      boundaryScope: 'INBOUND'
    };
    const form = createForm(entityType, sliConfig, '1', mockApplication);
    let footer: React.ReactNode;
    const setFooter = (f: React.ReactNode) => {
      footer = f;
    };
    const filterExpressionValid = false;

    // When
    mount(
      <CreateSliForm
        entityType="application"
        filterExpressionValid={filterExpressionValid}
        form={form}
        setFooter={setFooter}
        close={jest.fn()}
        updateForm={jest.fn()}
        onSave={jest.fn()}
      >
        {null}
      </CreateSliForm>
    );
    const wrapper = mount(<div>{footer}</div>);
    wrapper.find(SaveButton).simulate('click');

    // Then
    expect(createSliConfiguration).not.toHaveBeenCalled();
  });

  it.each([
    [false, t('in-custom-dashboards:widgets.slo.createSliForm.create')],
    [true, t('in-custom-dashboards:widgets.slo.createSliForm.clone')]
  ])('if editMode is %s it renders a save button with the label %s', (editMode, label) => {
    // Given
    const entityType = 'application';
    const sliConfig = { sliName: 'someSliName' };
    const mockApplication: Application = {
      id: '1',
      label: 'Stans Lab',
      boundaryScope: 'INBOUND'
    };
    const form = createForm(entityType, sliConfig, '1', mockApplication);
    let footer: React.ReactNode;
    const setFooter = (f: React.ReactNode) => {
      footer = f;
    };

    // When
    mount(
      <CreateSliForm
        entityType="application"
        editMode={editMode}
        form={form}
        setFooter={setFooter}
        close={jest.fn()}
        updateForm={jest.fn()}
        onSave={jest.fn()}
      >
        {null}
      </CreateSliForm>
    );
    const wrapper = mount(<div>{footer}</div>);

    // Then
    expect(wrapper.containsMatchingElement(<SaveButton>{label}</SaveButton>)).toBeTruthy();
  });

  it('renders an info message in edit mode', () => {
    // Given
    const entityType = 'application';
    const sliConfig = { sliName: 'someSliName' };
    const mockApplication: Application = {
      id: '1',
      label: 'Stans Lab',
      boundaryScope: 'INBOUND'
    };
    const form = createForm(entityType, sliConfig, '1', mockApplication);
    const editMode = true;

    // When
    const wrapper = shallow(
      <CreateSliForm
        entityType="application"
        editMode={editMode}
        form={form}
        setFooter={jest.fn()}
        close={jest.fn()}
        updateForm={jest.fn()}
        onSave={jest.fn()}
      >
        {null}
      </CreateSliForm>
    );

    // Then
    expect(
      wrapper.containsMatchingElement(
        <Message>{t('in-custom-dashboards:widgets.slo.createSliForm.sliConfigMsg')}</Message>
      )
    ).toBeTruthy();
  });

  it('calls the onSave method when submit results in success', () => {
    // Given
    const sliName = 'someSliName';
    const entityType = 'application';
    const sliConfig = { sliName };
    const mockApplication: Application = {
      id: '1',
      label: 'Stans Lab',
      boundaryScope: 'INBOUND'
    };
    const form = createForm(entityType, sliConfig, '1', mockApplication);
    const onSave = jest.fn(() => just({}));

    // @ts-expect-error
    createSliConfiguration.mockReturnValueOnce(
      successObservable({
        id: 'someId'
      })
    );

    // When
    const wrapper = shallow(
      <CreateSliForm
        entityType="application"
        form={form}
        onSave={onSave}
        updateForm={jest.fn()}
        setFooter={jest.fn()}
        close={jest.fn}
        filterExpressionValid
      >
        {null}
      </CreateSliForm>
    );

    wrapper.simulate('submit', wrapper.first().prop('form'));

    // Then
    expect(onSave).toHaveBeenCalled();
  });

  it('does not call the onSave method when submit results in an error', () => {
    // Given
    const sliName = 'someSliName';
    const entityType = 'application';
    const sliConfig = { sliName };
    const mockApplication: Application = {
      id: '1',
      label: 'Stans Lab',
      boundaryScope: 'INBOUND'
    };
    const form = createForm(entityType, sliConfig, '1', mockApplication);
    const onSave = jest.fn(() => just({}));

    // @ts-expect-error
    createSliConfiguration.mockReturnValueOnce(just(error([{ code: 404, message: 'not found' }])));

    // When
    const wrapper = shallow(
      <CreateSliForm
        entityType="application"
        form={form}
        onSave={onSave}
        updateForm={jest.fn()}
        setFooter={jest.fn()}
        close={jest.fn}
      >
        {null}
      </CreateSliForm>
    );

    wrapper.simulate('submit', wrapper.first().prop('form'));

    // Then
    expect(onSave).not.toHaveBeenCalled();
  });
});
