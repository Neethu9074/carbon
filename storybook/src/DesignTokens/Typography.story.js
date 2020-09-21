import theme from 'in-themes';
import React from 'react';

const lorem = (
  <p>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum fuga eveniet omnis, eius laudantium distinctio ut
    nobis dignissimos nesciunt ab! Iste nobis earum harum iure sit nostrum qui sequi in.
  </p>
);

export default {
  title: 'DesignTokens|Typography'
};

export const Typography = () => {
  return (
    <>
      {Object.keys(theme.lib.typography).map(configName => (
        <TypoComponent key={configName} config={theme.lib.typography[configName]}>
          {configName}
        </TypoComponent>
      ))}
    </>
  );
};

function TypoComponent({ config, children }) {
  return <div style={{ marginBottom: 76, ...config }}>{children}</div>;
}

export function Overview() {
  return (
    <>
      <h1>Typography Tests</h1>
      <p>This file shows Instana typography. Specifically, what default HTML components look like. This file covers:</p>

      <ul>
        <li>headings</li>
        <li>paragraphs</li>
        <li>ordered, numbered and description lists</li>
        <li>links</li>
        <li>code sections</li>
      </ul>

      <h2>Headings</h2>
      <Example>
        <h1>First Level Header</h1>
        {lorem}

        <h2>Second Level Header</h2>
        {lorem}

        <h3>Third Level Header</h3>
        {lorem}

        <h4>Fourth Level Header</h4>
        {lorem}

        <h5>Fifth Level Header</h5>
        {lorem}

        <h6>Sixth Level Header</h6>
        {lorem}
      </Example>

      <h2>Lists</h2>

      <h3>Ordered</h3>
      <Example>
        <ol>
          <li>{`Abstraction principle (programming)`}</li>
          <li>{`Code duplication`}</li>
          <li>{`Code reuse`}</li>
        </ol>
      </Example>

      <h3>Unordered</h3>
      <Example>
        <ul>
          <li>{`Abstraction principle (programming)`}</li>
          <li>{`Code duplication`}</li>
          <li>{`Code reuse`}</li>
        </ul>
      </Example>

      <h3>Description Lists</h3>
      <Example>
        <dl>
          <dt>DRY</dt>
          <dd>{`Don't Repeat Yourself`}</dd>

          <dt>SRP</dt>
          <dd>{`Single responsibility principle`}</dd>

          <dt>LSP</dt>
          <dd>{`Liskov substitution principle`}</dd>

          <dt>ISP</dt>
          <dd>{`Interface segregation principle`}</dd>

          <dt>DIP</dt>
          <dd>{`Dependency inversion principle`}</dd>
        </dl>
      </Example>

      <h2>Inline Text Styling</h2>
      <dl>
        <dt>Links</dt>
        <dd>
          To become happy, you <a href="https://www.youtube.com/watch?v=kfVsfOSbJY0">should watch YouTube</a>.
        </dd>

        <dt>Inline Code</dt>
        <dd>
          Please deploy <code>ui-client</code> <code>master</code> version <code>1.132.40</code> to all environments.
        </dd>
      </dl>
    </>
  );
}

function Example({ children }) {
  return <div style={{ paddingLeft: '1rem', marginLeft: '1rem', borderLeft: '1px solid #563d7c' }}>{children}</div>;
}
