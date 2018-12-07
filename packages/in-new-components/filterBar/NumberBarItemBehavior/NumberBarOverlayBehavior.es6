import { createField, createMapForm } from 'formalistic';
import { compose, withProps } from 'recompose';

import NumberBarOverlayPresenter from 'in-new-components/filterBar/NumberBarItemBehavior/NumberBarOverlayPresenter';
import { getNumberTagFilters } from 'in-new-components/filterBar/NumberBarItemBehavior/util';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import withPropDependingState from 'in-hoc/withPropDependingState';
import { numericValidator } from 'in-services/validators/number';
import { isNotBlank } from 'in-services/util/string';

export default compose(
  withPropDependingState({
    getInitialState,
    resets: [
      {
        getResettingProps: () => ['tagFilters', 'tag', 'showRange', 'showEquality'],
        onReset: getInitialState
      }
    ],
    reducerName: 'onChange'
  }),
  withProps(({ onChange, form, close, setTagFilters, tagFilters, showRange, showEquality, tag }) => ({
    getOnChangeHandler: fieldName => e =>
      onChange({
        form: form.updateIn([fieldName], field => field.setValue(e.target.value).setTouched(true))
      }),
    onClear(e) {
      stopPropagationAndPreventDefault(e);
      let tagFilterChange = tagFilters;

      if (showRange) {
        tagFilterChange = tagFilterChange.filter(
          f => !(f.name === tag && (f.operator === 'LESS_THAN' || f.operator === 'GREATER_THAN'))
        );
      }

      if (showEquality) {
        tagFilterChange = tagFilterChange.filter(
          f => !(f.name === tag && (f.operator === 'EQUALS' || f.operator === 'NOT_EQUAL'))
        );
      }

      setTagFilters(tagFilterChange);
      close();
    },
    onSubmit(e) {
      stopPropagationAndPreventDefault(e);
      if (!form.hierarchyValid) {
        onChange({
          form: form.setTouched(true, {
            recurse: true
          })
        });
        return;
      }

      let tagFilterChange = tagFilters;
      if (showRange) {
        tagFilterChange = tagFilterChange.filter(
          f => !(f.name === tag && (f.operator === 'LESS_THAN' || f.operator === 'GREATER_THAN'))
        );

        if (isNotBlank(form.get('lt').value)) {
          tagFilterChange = tagFilterChange.concat({
            name: tag,
            value: form.get('lt').value,
            numberValue: parseInt(form.get('lt').value, 10),
            operator: 'LESS_THAN'
          });
        }

        if (isNotBlank(form.get('gt').value)) {
          tagFilterChange = tagFilterChange.concat({
            name: tag,
            value: form.get('gt').value,
            numberValue: parseInt(form.get('gt').value, 10),
            operator: 'GREATER_THAN'
          });
        }
      }

      if (showEquality) {
        tagFilterChange = tagFilterChange.filter(
          f => !(f.name === tag && (f.operator === 'EQUALS' || f.operator === 'NOT_EQUAL'))
        );

        if (isNotBlank(form.get('eq').value)) {
          tagFilterChange = tagFilterChange.concat({
            name: tag,
            value: form.get('eq').value,
            numberValue: parseInt(form.get('eq').value, 10),
            operator: 'EQUALS'
          });
        }

        if (isNotBlank(form.get('neq').value)) {
          tagFilterChange = tagFilterChange.concat({
            name: tag,
            value: form.get('neq').value,
            numberValue: parseInt(form.get('neq').value, 10),
            operator: 'NOT_EQUAL'
          });
        }
      }

      setTagFilters(tagFilterChange);
      close();
    }
  }))
)(NumberBarOverlayPresenter);

function getInitialState(props) {
  const { gt, lt, neq, eq } = getNumberTagFilters(props);
  const { showRange, showEquality } = props;
  let form = createMapForm();

  if (showRange) {
    form = form
      .put(
        'lt',
        createField({
          value: lt ? String(lt.numberValue || lt.value) : undefined,
          validator: numericValidator
        })
      )
      .put(
        'gt',
        createField({
          value: gt ? String(gt.numberValue || gt.value) : undefined,
          validator: numericValidator
        })
      );
  }

  if (showEquality) {
    form = form
      .put(
        'eq',
        createField({
          value: eq ? String(eq.numberValue || eq.value) : undefined,
          validator: numericValidator
        })
      )
      .put(
        'neq',
        createField({
          value: neq ? String(neq.numberValue || neq.value) : undefined,
          validator: numericValidator
        })
      );
  }

  return {
    form
  };
}
