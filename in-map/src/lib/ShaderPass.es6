import THREE from 'three';


THREE.UniformsUtils = {
  merge: function ( uniforms ) {
    var merged = {};

    for ( var u = 0; u < uniforms.length; u ++ ) {
      var tmp = this.clone( uniforms[ u ] );

      for ( var p in tmp ) {
        merged[ p ] = tmp[ p ];
      }
    }
    return merged;
  },

  clone: function ( uniforms_src ) {
    var uniforms_dst = {};

    for ( var u in uniforms_src ) {
      uniforms_dst[ u ] = {};

      for ( var p in uniforms_src[ u ] ) {
        var parameter_src = uniforms_src[ u ][ p ];

        if ( parameter_src instanceof THREE.Color ||
           parameter_src instanceof THREE.Vector2 ||
           parameter_src instanceof THREE.Vector3 ||
           parameter_src instanceof THREE.Vector4 ||
           parameter_src instanceof THREE.Matrix4 ||
           parameter_src instanceof THREE.Texture ) {

          uniforms_dst[ u ][ p ] = parameter_src.clone();

        } else if ( parameter_src instanceof Array ) {
          uniforms_dst[ u ][ p ] = parameter_src.slice();

        } else {
          uniforms_dst[ u ][ p ] = parameter_src;
        }
      }
    }
    return uniforms_dst;
  }
};

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ShaderPass = function ( shader, textureID ) {
  this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";
  this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );
  this.material = new THREE.ShaderMaterial( {
    defines: shader.defines || {},
    uniforms: this.uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader
  });

  this.renderToScreen = false;

  this.enabled = true;
  this.needsSwap = true;
  this.clear = false;

  this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
  this.scene  = new THREE.Scene();

  this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
  this.scene.add( this.quad );
};

THREE.ShaderPass.prototype = {
  render: function ( renderer, writeBuffer, readBuffer, delta ) {
    if ( this.uniforms[ this.textureID ] ) {
      this.uniforms[ this.textureID ].value = readBuffer;
    }

    this.quad.material = this.material;

    if ( this.renderToScreen ) {
      renderer.render( this.scene, this.camera );
    } else {
      renderer.render( this.scene, this.camera, writeBuffer, this.clear );
    }
  }
};
