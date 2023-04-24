/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createForm } from 'in-custom-dashboards/widgets/TimeZones/form';

describe('in-custom-dashboards/widgets/TimeZones/form.ts', () => {
  describe('create form', () => {
    it('create timezone form without saved state', () => {
      const listForm = createForm(undefined);
      const timeZone = listForm.getIn([0, 'timeZone']).value;
      const label = listForm.getIn([0, 'label']).value;

      expect(timeZone).toBe('UTC');
      expect(label).toBe('');
    });

    it('create form with empty timezone and label', () => {
      const listForm = createForm([
        {
          timeZone: undefined,
          label: undefined
        }
      ]);

      const timeZone = listForm.getIn([0, 'timeZone']).value;
      const label = listForm.getIn([0, 'label']).value;

      expect(timeZone).toBe('UTC');
      expect(label).toBe('');

      const newListForm = listForm.updateIn([0, 'timeZone'], item => {
        const newItem = item;
        return newItem.setValue('');
      });

      const secondTimeZone = newListForm.getIn([0, 'timeZone']).valid;

      expect(secondTimeZone).toBeFalsy();
    });

    it('Test if form is not valid if it doesnt have a timeZone field', () => {
      const listForm = createForm(undefined);

      expect(listForm.remove(0).valid).toBeFalsy();
    });
  });
});
