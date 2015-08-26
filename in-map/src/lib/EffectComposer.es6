import THREE from 'three';

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

THREE.MaskPass = function ( scene, camera ) {
  this.scene = scene;
  this.camera = camera;

  this.enabled = true;
  this.clear = true;
  this.needsSwap = false;

  this.inverse = false;
};

THREE.MaskPass.prototype = {
  render: function ( renderer, writeBuffer, readBuffer, delta ) {
    var context = renderer.context;

    // don't update color or depth
    context.colorMask( false, false, false, false );
    context.depthMask( false );

    // set up stencil
    var writeValue, clearValue;

    if ( this.inverse ) {
      writeValue = 0;
      clearValue = 1;

    } else {
      writeValue = 1;
      clearValue = 0;
    }

    context.enable( context.STENCIL_TEST );
    context.stencilOp( context.REPLACE, context.REPLACE, context.REPLACE );
    context.stencilFunc( context.ALWAYS, writeValue, 0xffffffff );
    context.clearStencil( clearValue );

    // draw into the stencil buffer
    renderer.render( this.scene, this.camera, readBuffer, this.clear );
    renderer.render( this.scene, this.camera, writeBuffer, this.clear );

    // re-enable update of color and depth
    context.colorMask( true, true, true, true );
    context.depthMask( true );

    // only render where stencil is set to 1
    context.stencilFunc( context.EQUAL, 1, 0xffffffff );  // draw if == 1
    context.stencilOp( context.KEEP, context.KEEP, context.KEEP );
  }
};


THREE.ClearMaskPass = function () {
  this.enabled = true;
};

THREE.ClearMaskPass.prototype = {
  render: function ( renderer, writeBuffer, readBuffer, delta ) {
    var context = renderer.context;
    context.disable( context.STENCIL_TEST );
  }
};

THREE.CopyShader = {
  uniforms: {
    'tDiffuse': { type: 't', value: null },
    'opacity':  { type: 'f', value: 1.0 }
  },

  vertexShader: [
    'varying vec2 vUv;',

    'void main() {',
      'vUv = uv;',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
    '}'

  ].join('\n'),

  fragmentShader: [
    'uniform float opacity;',
    'uniform sampler2D tDiffuse;',
    'varying vec2 vUv;',

    'void main() {',
      'vec4 texel = texture2D( tDiffuse, vUv );',
      'gl_FragColor = opacity * texel;',
    '}'
  ].join('\n')
};

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.EffectComposer = function ( renderer, renderTarget ) {
  this.renderer = renderer;

  if ( renderTarget === undefined ) {
    var pixelRatio = renderer.getPixelRatio();

    var width  = Math.floor( renderer.context.canvas.width  / pixelRatio ) || 1;
    var height = Math.floor( renderer.context.canvas.height / pixelRatio ) || 1;
    var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

    renderTarget = new THREE.WebGLRenderTarget( width, height, parameters );
  }

  this.renderTarget1 = renderTarget;
  this.renderTarget2 = renderTarget.clone();

  this.writeBuffer = this.renderTarget1;
  this.readBuffer = this.renderTarget2;

  this.passes = [];

  if ( THREE.CopyShader === undefined )
    console.error( 'THREE.EffectComposer relies on THREE.CopyShader' );

  this.copyPass = new THREE.ShaderPass( THREE.CopyShader );
};

THREE.EffectComposer.prototype = {
  swapBuffers: function() {
    var tmp = this.readBuffer;
    this.readBuffer = this.writeBuffer;
    this.writeBuffer = tmp;
  },

  addPass: function ( pass ) {
    this.passes.push( pass );
  },

  insertPass: function ( pass, index ) {
    this.passes.splice( index, 0, pass );
  },

  render: function ( delta ) {
    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;

    var maskActive = false;

    var pass, i, il = this.passes.length;

    for ( i = 0; i < il; i ++ ) {
      pass = this.passes[ i ];

      if ( !pass.enabled ) continue;
      pass.render( this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive );

      if ( pass.needsSwap ) {
        if ( maskActive ) {
          var context = this.renderer.context;
          context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );
          this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, delta );
          context.stencilFunc( context.EQUAL, 1, 0xffffffff );
        }
        this.swapBuffers();
      }

      if ( pass instanceof THREE.MaskPass ) {
        maskActive = true;
      } else if ( pass instanceof THREE.ClearMaskPass ) {
        maskActive = false;
      }
    }
  },

  reset: function ( renderTarget ) {
    if ( renderTarget === undefined ) {
      renderTarget = this.renderTarget1.clone();
      var pixelRatio = this.renderer.getPixelRatio();

      renderTarget.width  = Math.floor( this.renderer.context.canvas.width  / pixelRatio );
      renderTarget.height = Math.floor( this.renderer.context.canvas.height / pixelRatio );
    }

    this.renderTarget1 = renderTarget;
    this.renderTarget2 = renderTarget.clone();

    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;
  },

  setSize: function ( width, height ) {
    var renderTarget = this.renderTarget1.clone();

    renderTarget.width = width;
    renderTarget.height = height;

    this.reset( renderTarget );
  }
};
