/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { createField, createMapForm } from 'formalistic';
import { mount, shallow } from 'enzyme';
import React from 'react';

import { create, just } from '@instana/observables';
import { Message } from '@instana/components';
import { t } from '@instana/i18n-react';

import CreateSliForm from 'in-custom-dashboards/widgets/Slo/sli/components/create/CreateSliForm';
import { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { addMessage as aM } from 'in-components/MessageFlyout/stores/messages';

jest.mock('in-components/MessageFlyout/stores/messages', () => ({
  addMessage: jest.fn()
}));

const addMessage = aM as jest.MockedFunction<typeof aM>;

describe('in-custom-dashboards/widgets/Slo/sli/create/CreateSliForm', () => {
  beforeEach(jest.clearAllMocks);

  it('calls onSubmit with the unpacked form data when the form is submitted', () => {
    // Given
    const form = createMapForm({ items: { application: createField({ value: 'Stans Lab' }) } });
    const onSubmit = jest.fn(() => just({}));

    // When
    const wrapper = shallow(
      <CreateSliForm
        entityType="application"
        form={form}
        onSubmit={onSubmit}
        updateForm={jest.fn()}
        setFooter={jest.fn()}
        close={jest.fn}
      >
        {null}
      </CreateSliForm>
    );
    wrapper.simulate('submit', wrapper.first().prop('form'));

    // Then
    expect(onSubmit).toHaveBeenLastCalledWith(
      expect.objectContaining({
        application: 'Stans Lab'
      })
    );
  });

  it('renders a success message when onSubmit is successful', () => {
    // Given
    const form = createMapForm({ items: { sliName: createField({ value: 'Stans Lab availability' }) } });
    const onSubmit = jest.fn(() => just({}));

    // When
    const wrapper = shallow(
      <CreateSliForm
        entityType="application"
        form={form}
        onSubmit={onSubmit}
        updateForm={jest.fn()}
        setFooter={jest.fn()}
        close={jest.fn}
      >
        {null}
      </CreateSliForm>
    );
    wrapper.simulate('submit', wrapper.first().prop('form'));

    // Then
    expect(addMessage).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: 'info',
        content: expect.stringContaining('Stans Lab availability')
      }),
      expect.anything()
    );
  });

  it('renders a error message when onSubmit fails', () => {
    // Given
    const form = createMapForm({ items: { sliName: createField({ value: 'Stans Lab availability' }) } });
    const create$ = create();
    const onSubmit = jest.fn(() => create$);

    // When
    const wrapper = shallow(
      <CreateSliForm
        entityType="application"
        form={form}
        onSubmit={onSubmit}
        updateForm={jest.fn()}
        setFooter={jest.fn()}
        close={jest.fn}
      >
        {null}
      </CreateSliForm>
    );
    wrapper.simulate('submit', wrapper.first().prop('form'));
    create$.emitError('Low on caffeine');

    // Then
    expect(addMessage).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: 'danger',
        content: expect.not.stringContaining('Low on caffeine')
      }),
      expect.anything()
    );
  });

  it('renders a cancel button that calls close when clicked', () => {
    // Given
    const form = createMapForm({ items: { sliName: createField({ value: 'Stans Lab availability' }) } });
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
        onSubmit={jest.fn()}
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

  it('disables the save button if the filterExpression is invalid', () => {
    // Given
    const form = createMapForm({ items: { sliName: createField({ value: 'Stans Lab availability', touched: true }) } });
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
        onSubmit={jest.fn()}
      >
        {null}
      </CreateSliForm>
    );
    const wrapper = mount(<div>{footer}</div>);

    // Then
    expect(wrapper.find(SaveButton).prop('disabled')).toBeTruthy();
  });

  it('disables the save button if the form has not been touched', () => {
    // Given
    const form = createMapForm({
      items: { sliName: createField({ value: 'Stans Lab availability', touched: false }) }
    });
    let footer: React.ReactNode;
    const setFooter = (f: React.ReactNode) => {
      footer = f;
    };
    const filterExpressionValid = true;

    // When
    mount(
      <CreateSliForm
        entityType="application"
        filterExpressionValid={filterExpressionValid}
        form={form}
        setFooter={setFooter}
        close={jest.fn()}
        updateForm={jest.fn()}
        onSubmit={jest.fn()}
      >
        {null}
      </CreateSliForm>
    );
    const wrapper = mount(<div>{footer}</div>);

    // Then
    expect(wrapper.find(SaveButton).prop('disabled')).toBeTruthy();
  });

  it.each([
    [false, t('in-custom-dashboards:widgets.slo.createSliForm.create')],
    [true, t('in-custom-dashboards:widgets.slo.createSliForm.clone')]
  ])('if editMode is %s it renders a save button with the label %s', (editMode, label) => {
    // Given
    const form = createMapForm({
      items: { sliName: createField({ value: 'Stans Lab availability' }) }
    });
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
        onSubmit={jest.fn()}
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
    const form = createMapForm({
      items: { sliName: createField({ value: 'Stans Lab availability' }) }
    });
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
        onSubmit={jest.fn()}
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
});
