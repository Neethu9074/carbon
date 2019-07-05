import { compose, withState, setPropTypes, withProps } from 'recompose';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import StaticKeyValuePairsEditor from './StaticKeyValuePairsEditor';
import SectionHeading from 'in-settings/components/SectionHeading';
import Tooltip from 'in-components/Tooltip/Tooltip';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import { createField } from 'formalistic';

import locals from './Step5.mless';

export const staticJsonPayloadFieldName = 'staticJsonPayload';

export default compose(
  setPropTypes({
    form: PropTypes.object.isRequired,
    setForm: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  }),
  withProps(({ form }) => ({
    value: form.get(staticJsonPayloadFieldName) && form.get(staticJsonPayloadFieldName).value
  })),
  withState('expanded', 'setExpanded', false),
  withState('error', 'setError', null)
)(Step5);

function Step5({ expanded, setExpanded, error, setError, form, setForm, value, onChange }) {
  return (
    <section>
      <SectionHeading>
        5. Advanced
        <ExpandIconWithTooltip
          expanded={expanded}
          setExpanded={setExpanded}
          expansionTracker={expanded => onExpandedChange(expanded, form, value, setForm)}
        />
      </SectionHeading>
      {expanded && (
        <Fragment>
          <div className={locals.title}>Custom Payload (JSON)</div>
          <div className={locals.editor}>
            <StaticKeyValuePairsEditor
              value={value}
              onChange={json => onChange(staticJsonPayloadFieldName, json)}
              onParseError={setError}
            />
          </div>
          {error && <p className={locals.errorMsg}>{error}</p>}
        </Fragment>
      )}
    </section>
  );
}

function onExpandedChange(expanded, form, value, setForm) {
  let updatedForm;

  if (expanded) {
    updatedForm = form.put(
      staticJsonPayloadFieldName,
      createField({
        value: value,
        validator(value) {
          if (value === null) {
            return [
              {
                severity: 'error',
                message: `Please fix JSON errors.`
              }
            ];
          }
        }
      })
    );
  } else {
    updatedForm = form.remove(staticJsonPayloadFieldName);
  }

  setForm(updatedForm);
}

function ExpandIconWithTooltip({ expanded, setExpanded, expansionTracker }) {
  return (
    <Tooltip content={expanded ? 'Show less' : 'Show more'}>
      <SvgIcon
        className={locals.icon}
        type={expanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
        onClick={() => {
          if (expansionTracker) {
            expansionTracker({
              expanded: !expanded
            });
          }
          setExpanded(!expanded);
        }}
        width={20}
        height={20}
      />
    </Tooltip>
  );
}
