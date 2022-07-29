/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import useApdexFormSideEffects from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexFormSideEffects';
import { createForm } from 'in-custom-dashboards/widgets/Apdex/form';

describe('in-custom-dashboards/widgets/Apdex/hooks/useApdexFormSideEffects', () => {
  it('resets the entity id to undefined if the entityType changes', () => {
    // Given
    let updatedForm = {};
    const form = createForm({
      entityId: 'someEntity',
      entityType: 'application'
    });

    const updateForm = useApdexFormSideEffects(form, f => {
      updatedForm = f.toJS();
    });

    // When
    updateForm(form.updateIn(['entityType'], f => f.setValue('website')));

    // Then
    expect(updatedForm).toEqual(expect.objectContaining({ entityId: undefined }));
  });

  it('resets the apdex id to undefined if the entityType changes', () => {
    // Given
    let updatedForm = {};
    const form = createForm({
      apdexId: 'someApdex',
      entityType: 'application'
    });

    const updateForm = useApdexFormSideEffects(form, f => {
      updatedForm = f.toJS();
    });

    // When
    updateForm(form.updateIn(['entityType'], f => f.setValue('website')));

    // Then
    expect(updatedForm).toEqual(expect.objectContaining({ apdexConfigId: undefined }));
  });
});
