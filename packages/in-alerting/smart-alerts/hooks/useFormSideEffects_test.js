/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createMapForm, createField } from 'formalistic';
/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import useFormSideEffects from 'in-alerting/smart-alerts/hooks/useFormSideEffects';

describe('in-alerting/smart-alerts/hooks/useFormSideEffects', () => {
  context('when updating with the identical form', () => {
    const form = createMapForm().put('foo', createField({ value: 'bar' }));
    it('does not update the state', () => {
      const setForm = sinon.fake();
      const updateForm = useFormSideEffects(form, setForm);

      updateForm(form);
      expect(setForm.callCount).to.equal(0);
    });
  });

  context('when updating the form', () => {
    const form = createMapForm()
      .put(
        'logins',
        createMapForm()
          .put('octocat', createField({ value: 0 }))
          .put('stan', createField({ value: 100 }))
      )
      .put('totalLogins', createField({ value: 0 }));

    it('only executes effects matching the changed path', () => {
      const execute = sinon.fake();
      const dontExecute = sinon.fake();
      const effects = [
        {
          path: ['logins', 'octocat'],
          effects: [dontExecute]
        },
        {
          path: ['logins', 'stan'],
          effects: [execute]
        }
      ];

      const updateForm = useFormSideEffects(form, sinon.fake(), effects);

      updateForm(form.updateIn(['logins', 'stan'], f => f.setValue(101)));

      expect(execute.callCount).to.equal(1);
      expect(dontExecute.callCount).to.equal(0);
    });

    it('also executes effects if the changed path is a sub path', () => {
      const execute = sinon.fake();
      const effects = [
        {
          path: ['logins'],
          effects: [execute]
        }
      ];

      const updateForm = useFormSideEffects(form, sinon.fake(), effects);

      updateForm(form.updateIn(['logins', 'stan'], f => f.setValue(101)));

      expect(execute.callCount).to.equal(1);
    });

    it('can execute multiple effects per changed path', () => {
      const e1 = sinon.fake();
      const e2 = sinon.fake();
      const effects = [
        {
          path: ['logins'],
          effects: [e1, e2]
        }
      ];

      const updateForm = useFormSideEffects(form, sinon.fake(), effects);

      updateForm(form.updateIn(['logins', 'stan'], f => f.setValue(101)));

      expect(e1.callCount).to.equal(1);
      expect(e2.callCount).to.equal(1);
    });

    it('side effects can alter the form', () => {
      const effects = [
        {
          path: ['logins', 'stan'],
          effects: [form => form.updateIn(['logins', 'octocat'], f => f.setValue(5))]
        }
      ];

      const setForm = sinon.fake();
      const updateForm = useFormSideEffects(form, setForm, effects);

      updateForm(form.updateIn(['logins', 'stan'], f => f.setValue(11)));

      expect(setForm.callCount).to.equal(1);
      expect(setForm.lastArg?.get('logins').get('octocat').value).to.equal(5);
    });

    it('side effects dont trigger other side effects when changing the form', () => {
      const updateTotalLogins = sinon.fake(form => form.updateIn(['totalLogins'], f => f.setValue(1)));
      const dontExecute = sinon.fake();
      const effects = [
        {
          path: ['logins'],
          effects: [updateTotalLogins]
        },
        {
          path: ['totalLogins'],
          effects: [dontExecute]
        }
      ];

      const updateForm = useFormSideEffects(form, sinon.fake(), effects);

      updateForm(form.updateIn(['logins', 'stan'], f => f.setValue(11)));

      expect(updateTotalLogins.callCount).to.equal(1);
      expect(dontExecute.callCount).to.equal(0);
    });

    it('can handle effects that trigger on any change', () => {
      const execute = sinon.fake();
      const execute2 = sinon.fake();
      const effects = [
        {
          path: [],
          effects: [execute]
        },
        {
          effects: [execute2]
        }
      ];

      const updateForm = useFormSideEffects(form, sinon.fake(), effects);

      updateForm(form.updateIn(['logins', 'stan'], f => f.setValue(101)));

      expect(execute.callCount).to.equal(1);
      expect(execute2.callCount).to.equal(1);
    });

    it('triggered effects are deduplicated', () => {
      const execute = sinon.fake();
      const effects = [
        {
          path: [],
          effects: [execute]
        },
        {
          effects: [execute]
        }
      ];

      const updateForm = useFormSideEffects(form, sinon.fake(), effects);

      updateForm(form.updateIn(['logins', 'stan'], f => f.setValue(101)));

      expect(execute.callCount).to.equal(1);
    });

    it('effects do not have to return the updated form if they dont modify it', () => {
      const setForm = sinon.fake();
      const execute = sinon.fake();
      const effects = [
        {
          path: [],
          effects: [execute]
        },
        {
          effects: [execute]
        }
      ];

      const updateForm = useFormSideEffects(form, setForm, effects);

      const updatedForm = form.updateIn(['logins', 'stan'], f => f.setValue(101));
      updateForm(updatedForm);

      expect(execute.callCount).to.equal(1);
      expect(setForm.lastArg).to.equal(updatedForm);
    });
  });
});
