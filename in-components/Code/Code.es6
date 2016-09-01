/* eslint-disable max-len */

import PureRenderMixin from 'react-addons-pure-render-mixin';
import 'highlight.js/styles/default.css';
import hljs from 'highlight.js';
import ReactDOM from 'react-dom';
import React from 'react';

import './Code.less';

const rpt = React.PropTypes;

// possible languages
//
// 1c.js             cal.js            delphi.js         gams.js           inform7.js        mathematica.js    openscad.js       rib.js            stata.js          vhdl.js
// accesslog.js      capnproto.js      diff.js           gauss.js          ini.js            matlab.js         oxygene.js        roboconf.js       step21.js         vim.js
// actionscript.js   ceylon.js         django.js         gcode.js          irpf90.js         maxima.js         parser3.js        rsl.js            stylus.js         x86asm.js
// apache.js         clojure-repl.js   dns.js            gherkin.js        java.js           mel.js            perl.js           ruby.js           swift.js          xl.js
// applescript.js    clojure.js        dockerfile.js     glsl.js           javascript.js     mercury.js        pf.js             ruleslanguage.js  taggerscript.js   xml.js
// arduino.js        cmake.js          dos.js            go.js             json.js           mipsasm.js        php.js            rust.js           tcl.js            xquery.js
// armasm.js         coffeescript.js   dts.js            golo.js           julia.js          mizar.js          powershell.js     scala.js          tex.js            yaml.js
// asciidoc.js       cos.js            dust.js           gradle.js         kotlin.js         mojolicious.js    processing.js     scheme.js         thrift.js         zephir.js
// aspectj.js        cpp.js            elixir.js         groovy.js         lasso.js          monkey.js         profile.js        scilab.js         tp.js
// autohotkey.js     crmsh.js          elm.js            haml.js           less.js           moonscript.js     prolog.js         scss.js           twig.js
// autoit.js         crystal.js        erb.js            handlebars.js     lisp.js           nginx.js          protobuf.js       smali.js          typescript.js
// avrasm.js         cs.js             erlang-repl.js    haskell.js        livecodeserver.js nimrod.js         puppet.js         smalltalk.js      vala.js
// axapta.js         csp.js            erlang.js         haxe.js           livescript.js     nix.js            python.js         sml.js            vbnet.js
// bash.js           css.js            fix.js            hsp.js            lua.js            nsis.js           q.js              sqf.js            vbscript-html.js
// basic.js          d.js              fortran.js        htmlbars.js       makefile.js       objectivec.js     qml.js            sql.js            vbscript.js
// brainfuck.js      dart.js           fsharp.js         http.js           markdown.js       ocaml.js          r.js              stan.js           verilog.js


export default React.createClass({
  displayName: 'Code',

  mixins: [PureRenderMixin],

  propTypes: {
    code: rpt.string.isRequired,
    lang: rpt.string,
    className: rpt.string
  },

  componentDidMount() {
    this.updateCode();
  },

  componentDidUpdate() {
    this.updateCode();
  },

  updateCode() {
    const element = ReactDOM.findDOMNode(this.refs.code);
    element.textContent = this.props.code.trim();

    if (this.props.lang) {
      hljs.highlightBlock(element);
    }
  },

  render() {
    let classes = 'in-code';
    if (this.props.lang) {
      classes = `${classes} lang-${this.props.lang}`;
    }
    if (this.props.className) {
      classes = `${classes} ${this.props.className}`;
    }

    return (
      <pre>
        <code className={classes}
              ref='code' />
      </pre>
    );
  }
});
