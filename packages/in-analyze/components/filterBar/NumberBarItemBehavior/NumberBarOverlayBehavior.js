/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm } from 'formalistic';
import { compose, withProps } from 'recompose';
import { negate } from 'lodash';

import NumberBarOverlayPresenter from 'in-analyze/components/filterBar/NumberBarItemBehavior/NumberBarOverlayPresenter';
import { getNumberTagFilters } from 'in-analyze/components/filterBar/NumberBarItemBehavior/util';
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
  withProps(
    ({
      onChange,
      form,
      close,
      setTagFilters,
      tagFilters,
      showRange,
      showEquality,
      tag,
      trackFilterAdded,
      trackFilterChanged,
      trackFilterRemoved
    }) => {
      const operators = ['LESS_THAN', 'GREATER_THAN', 'LESS_OR_EQUAL_THAN', 'GREATER_OR_EQUAL_THAN'];
      const rangeFilter = f => f.name === tag && operators.includes(f.operator);
      const equalityFilter = f => f.name === tag && (f.operator === 'EQUALS' || f.operator === 'NOT_EQUAL');
      return {
        getOnChangeHandler: fieldName => e =>
          onChange({
            form: form.updateIn([fieldName], field => field.setValue(e.target.value).setTouched(true))
          }),
        onClear(e) {
          stopPropagationAndPreventDefault(e);
          let tagFilterChange = tagFilters;
          let filterBeforeChange;

          if (showRange) {
            filterBeforeChange = tagFilterChange.filter(rangeFilter);
            tagFilterChange = tagFilterChange.filter(negate(rangeFilter));
          } else if (showEquality) {
            filterBeforeChange = tagFilterChange.filter(equalityFilter);
            tagFilterChange = tagFilterChange.filter(negate(equalityFilter));
          }

          setTagFilters(tagFilterChange);
          close();

          if (trackFilterRemoved) {
            if (filterBeforeChange && filterBeforeChange.length > 0) {
              trackFilterRemoved({ name: tag, filter: filterBeforeChange[0] });
            } else {
              trackFilterRemoved({ name: tag });
            }
          }
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
          let filterBeforeChange = [];

          if (showRange) {
            filterBeforeChange = tagFilterChange.filter(rangeFilter);
            tagFilterChange = tagFilterChange.filter(negate(rangeFilter));

            if (isNotBlank(form.get('lt').value)) {
              tagFilterChange = tagFilterChange.concat({
                name: tag,
                value: form.get('lt').value,
                numberValue: parseInt(form.get('lt').value, 10),
                operator: 'LESS_THAN'
              });
            }

            if (isNotBlank(form.get('lte').value)) {
              tagFilterChange = tagFilterChange.concat({
                name: tag,
                value: form.get('lte').value,
                numberValue: parseInt(form.get('lte').value, 10),
                operator: 'LESS_OR_EQUAL_THAN'
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

            if (isNotBlank(form.get('gte').value)) {
              tagFilterChange = tagFilterChange.concat({
                name: tag,
                value: form.get('gte').value,
                numberValue: parseInt(form.get('gte').value, 10),
                operator: 'GREATER_OR_EQUAL_THAN'
              });
            }
          } else if (showEquality) {
            filterBeforeChange = tagFilterChange.filter(equalityFilter);
            tagFilterChange = tagFilterChange.filter(negate(equalityFilter));

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

          if (trackFilterChanged && filterBeforeChange.length > 0) {
            trackFilterChanged({ before: filterBeforeChange[0], after: tagFilterChange });
          } else if (trackFilterAdded && filterBeforeChange.length === 0) {
            trackFilterAdded({ filter: tagFilterChange });
          }
        }
      };
    }
  )
)(NumberBarOverlayPresenter);

function getInitialState(props) {
  const { gt, lt, gte, lte, neq, eq } = getNumberTagFilters(props);
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
        'lte',
        createField({
          value: lte ? String(lte.numberValue || lte.value) : undefined,
          validator: numericValidator
        })
      )
      .put(
        'gt',
        createField({
          value: gt ? String(gt.numberValue || gt.value) : undefined,
          validator: numericValidator
        })
      )
      .put(
        'gte',
        createField({
          value: gte ? String(gte.numberValue || gte.value) : undefined,
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
