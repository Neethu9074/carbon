import { compose, withState } from 'recompose';
import React, { Fragment } from 'react';

import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './BetaMarker.mless';

export default compose(withState('expanded', 'setExpanded'))(BetaMarker);

function BetaMarker({ title, children, expanded, setExpanded }) {
  return (
    <div className={locals.wrapper}>
      <div className={locals.betaMarker}>
        <div className={locals.header} onClick={() => setExpanded(!expanded)}>
          <h1 className={locals.headerTitle}>{title}</h1>
          <div className={locals.headerIcon}>
            <SvgIcon
              className={locals.arrowIcon}
              type={expanded ? 'lib_arrow_expand_down' : 'lib_arrow_expand_up'}
              width={16}
              height={16}
            />
          </div>
        </div>
        {expanded && <div className={locals.body}>{children}</div>}
      </div>
    </div>
  );
}

export const KubernetesBetaMarker = (
  <Fragment>
    <p>
      You are looking at the new Kubernetes support from Instana, which is currently in a Tech Preview. Please get in
      touch with us for any questions and feedback
    </p>
    <div className={locals.buttonWrapper}>
      <Button kind="primaryv2" href="mailto:matthias.luebken@instana.com?subject=Feedback on Kubernetes support">
        Provide Feedback
      </Button>
    </div>
  </Fragment>
);
