/**
 * Copyright 2015 Vizit Solutions
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

window.vizit         = window.vizit         || {};
window.vizit.utility = window.vizit.utility || {};

(function (ns)
{
  "use strict";

   /**
    * Set of functions to facilitate the setup and execution of GPGPU tasks.
    *
    * @param {integer} width_  The width (x-dimension) of the problem domain.
    *                          Normalized to s in texture coordinates.
    * @param {integer} height_ The height (y-dimension) of the problem domain.
    *                          Normalized to t in texture coordinates.
    *
    * @param {WebGLContextAttributes} attributes_ A collection of boolean values to enable or disable various WebGL features.
    *                                             If unspecified, STANDARD_CONTEXT_ATTRIBUTES are used.
    *                                             @see STANDARD_CONTEXT_ATTRIBUTES
    *                                             @see{@link https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.2}
    */
   ns.GPGPUtility = function (width_, height_, attributes_)
   {
     var attributes;
     var canvas;
     /** @member {WebGLRenderingContext} gl The WebGL context associated with the canvas. */
     var gl;
     var canvasHeight, canvasWidth;
     var problemHeight, problemWidth;
     var standardVertexShader;
     var standardVertices;
     /** @member {Object} Non null if we enable OES_texture_float. */
     var textureFloat;

     /**
      * Create a canvas for computational use. Computations don't
      * require attachment to the DOM.
      *
      * @param {integer} canvasWidth The width (x-dimension) of the problem domain.
      * @param {integer} canvasHeight The height (y-dimension) of the problem domain.
      *
      * @returns {HTMLCanvasElement} A canvas with the given height and width.
      */
     this.makeGPCanvas = function (canvasWidth, canvasHeight)
     {
       var canvas;

       canvas        = document.createElement('canvas');
       canvas.width  = canvasWidth;
       canvas.height = canvasHeight;

       return canvas;
     };

     this.getCanvas = function()
     {
       return canvas;
     };

     /**
      * Get a 3d context, webgl or experimental-webgl. The context presents a
      * javascript API that is used to draw into it. The webgl context API is
      * very similar to OpenGL for Embedded Systems, or OpenGL ES.
      *
      * @returns {WebGLRenderingContext} A manifestation of OpenGL ES in JavaScript.
      */
     this.getGLContext      = function ()
     {
       // Only fetch a gl context if we haven't already
       if(!gl)
       {
         gl             = canvas.getContext("webgl", attributes)
                          || canvas.getContext('experimental-webgl', attributes);
       }

       return gl;
     };

     /**
      * Return a standard geometry with texture coordinates for GPGPU calculations.
      * A simple triangle strip containing four vertices for two triangles that
      * completely cover the canvas. The included texture coordinates range from
      * (0, 0) in the lower left corner to (1, 1) in the upper right corner.
      *
      * @returns {Float32Array} A set of points and textures suitable for a two triangle
      *                         triangle fan that forms a rectangle covering the canvas
      *                         drawing surface.
      */
     this.getStandardGeometry = function ()
     {
       // Sets of x,y,z(=0),s,t coordinates.
       return new Float32Array([-1.0,  1.0, 0.0, 0.0, 1.0,  // upper left
                                -1.0, -1.0, 0.0, 0.0, 0.0,  // lower left
                                 1.0,  1.0, 0.0, 1.0, 1.0,  // upper right
                                 1.0, -1.0, 0.0, 1.0, 0.0]);// lower right
     };

     /**
      * Return verticies for the standard geometry. If they don't yet exist,
      * they are created and loaded with the standard geometry. If they already
      * exist, they are bound and returned.
      *
      * @returns {WebGLBuffer} A bound buffer containing the standard geometry.
      */
     this.getStandardVertices = function ()
     {
       if (!standardVertices)
       {
         standardVertices = gl.createBuffer();
         gl.bindBuffer(gl.ARRAY_BUFFER, standardVertices);
         gl.bufferData(gl.ARRAY_BUFFER, this.getStandardGeometry(), gl.STATIC_DRAW);
       }
       else
       {
         gl.bindBuffer(gl.ARRAY_BUFFER, standardVertices);
       }
       return standardVertices;
     };

     /**
      * Check if floating point textures are available. This is an optional feature,
      * and even if present are usually not usable as a rendering target.
      */
     this.isFloatingTexture = function()
     {
       return textureFloat != null;
     };

     /**
      * The object returned from getExtension, which contains any constants or functions
      * provided by the extension. Or null if the extension is unavailable.
      *
      * @returns {Object} The object returned from gl.getExtension('OES_texture_float')
      *
      * @see {https://www.khronos.org/registry/webgl/specs/1.0/#5.14.14}
      */
     this.getFloatingTexture = function()
     {
       return textureFloat;
     };

     /**
      * Set a height and width for the simulation steps when they are different than
      * the canvas height and width.
      *
      * @param {integer} height The height of the simulation.
      * @param {integer} width  The width of the simulation.
      */
     this.setProblemSize = function(width, height)
     {
       problemHeight = height;
       problemWidth  = width;
     }

     this.getComputeContext = function()
     {
       if (problemWidth != canvasWidth
           || problemHeight != canvasHeight)
       {
         gl.viewport(0, 0, problemWidth, problemHeight);
       }
       return gl;
     }

     this.getRenderingContext = function()
     {
       if (problemWidth != canvasWidth
           || problemHeight != canvasHeight)
       {
         gl.viewport(0, 0, canvasWidth, canvasHeight);
       }
       return gl;
     }

     /**
      * Refresh the data in a preexisting texture using texSubImage2D() to avoiding repeated allocation of texture memory.
      *
      * @param {WebGLTexture}    texture
      * @param {number}          type A valid texture type. FLOAT, UNSIGNED_BYTE, etc.
      * @param {number[] | null} data Either texture data, or null to allocate the texture but leave the texels undefined.
      */
     this.refreshTexture      =  function(texture, type, data)
     {
       // Bind the texture so the following methods effect this texture.
       gl.bindTexture(gl.TEXTURE_2D, texture);

       // Replace the texture data
       gl.texSubImage2D(gl.TEXTURE_2D, // Target, matches bind above.
                        0,             // Level of detail.
                        0,             // xOffset
                        0,             // yOffset
                        problemWidth,  // Width - normalized to s.
                        problemHeight, // Height - normalized to t.
                        gl.RGBA,       // Format for each pixel.
                        type,          // Data type for each chanel.
                        data);         // Image data in the described format, or null.

       // Unbind the texture.
       gl.bindTexture(gl.TEXTURE_2D, null);

       return texture;
     }

     /**
      * Create a width x height texture of the given type for computation.
      * Width and height are usually equal, and must be powers of two.
      *
      * @param {WebGLRenderingContext} The WebGL context for which we will create the texture.
      * @param {integer} width The width of the texture in pixels. Normalized to s in texture coordinates.
      * @param {integer} height The height of the texture in pixels. Normalized to t in texture coordinates.
      * @param {number} type A valid texture type. FLOAT, UNSIGNED_BYTE, etc.
      * @param {number[] | null} data Either texture data, or null to allocate the texture but leave the texels undefined.
      *
      * @returns {WebGLTexture} A reference to the created texture on the GPU.
      */
     this.makeSizedTexture = function(width, height, type, data)
     {
       var texture;

       // Create the texture
       texture = gl.createTexture();
       // Bind the texture so the following methods effect this texture.
       gl.bindTexture(gl.TEXTURE_2D, texture);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       // Pixel format and data for the texture
       gl.texImage2D(gl.TEXTURE_2D, // Target, matches bind above.
                     0,             // Level of detail.
                     gl.RGBA,       // Internal format.
                     width,         // Width - normalized to s.
                     height,        // Height - normalized to t.
                     0,             // Always 0 in OpenGL ES.
                     gl.RGBA,       // Format for each pixel.
                     type,          // Data type for each chanel.
                     data);         // Image data in the described format, or null.
       // Unbind the texture.
       gl.bindTexture(gl.TEXTURE_2D, null);

       return texture;
     };


     /**
      * Create a default width and height texture of the given type for computation.
      * Width and height must be powers of two.
      *
      * @param {WebGLRenderingContext} The WebGL context for which we will create the texture.
      * @param {number} type A valid texture type. FLOAT, UNSIGNED_BYTE, etc.
      * @param {number[] | null} data Either texture data, or null to allocate the texture but leave the texels undefined.
      *
      * @returns {WebGLTexture} A reference to the created texture on the GPU.
      */
     this.makeTexture = function (type, data)
     {
       return this.makeSizedTexture(problemWidth, problemHeight, type, data);
     };

     /**
      * Create and bind a framebuffer, then attach a texture.
      *
      * @param {WebGLTexture} texture The texture to be used as the buffer in this framebuffer object.
      *
      * @returns {WebGLFramebuffer} The framebuffer
      */
     this.attachFrameBuffer = function (texture)
     {
       var frameBuffer;

       // Create a framebuffer
       frameBuffer = gl.createFramebuffer();
       // Make it the target for framebuffer operations - including rendering.
       gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
       gl.framebufferTexture2D(gl.FRAMEBUFFER,       // The target is always a FRAMEBUFFER.
                               gl.COLOR_ATTACHMENT0, // We are providing the color buffer.
                               gl.TEXTURE_2D,        // This is a 2D image texture.
                               texture,              // The texture.
                               0);                   // 0, we aren't using MIPMAPs

       return frameBuffer;
     };

     /**
      * Check the framebuffer status. Return false if the framebuffer is not complete,
      * That is if it is not fully and correctly configured as required by the current
      * hardware. True indicates that the framebuffer is ready to be rendered to.
      *
      * @returns {boolean} True if the framebuffer is ready to be rendered to. False if not.
      */
     this.frameBufferIsComplete = function ()
     {
       var message;
       var status;
       var value;

       status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

       switch (status)
       {
         case gl.FRAMEBUFFER_COMPLETE:
           message = "Framebuffer is complete.";
           value = true;
           break;
         case gl.FRAMEBUFFER_UNSUPPORTED:
           message = "Framebuffer is unsupported";
           value = false;
           break;
         case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
           message = "Framebuffer incomplete attachment";
           value = false;
           break;
         case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
           message = "Framebuffer incomplete (missmatched) dimensions";
           value = false;
           break;
         case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
           message = "Framebuffer incomplete missing attachment";
           value = false;
           break;
         default:
           message = "Unexpected framebuffer status: " + status;
           value = false;
       }
       return {isComplete: value, message: message};
     };

     /**
      * Create and compile a vertex or fragment shader as given by the shader type.
      *
      * @param {string} The GLSL source for the shader.
      * @param {gl.FRAGMENT_SHADER|gl.VERTEX_SHADER} The type of shader.
      * 
      * @returns {WebGLShader} A compiled shader of the given type.
      */
     this.compileShader     = function (shaderSource, shaderType)
     {
       var shader = gl.createShader(shaderType);
       gl.shaderSource(shader, shaderSource);
       gl.compileShader(shader);

       var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
       if (!success)
       {
         throw "Shader compile failed with:" + gl.getShaderInfoLog(shader);
       }

       return shader;
     };

     /**
      * Return a shared, compiled, version of a widespread vertex shader for GPGPU
      * calculations. This shader is expected to be used in multiple programs within
      * a single GPGPU solution. Deleting it before it is linked into all programs
      * is problematic.
      *
      * @returns {WebGLShader} A compiled vertex shader.
      */
     this.getStandardVertexShader = function ()
     {
       var vertexShaderSource;

       if (!standardVertexShader)
       {

         vertexShaderSource   = "attribute vec3 position;"
                              + "attribute vec2 textureCoord;"
                              + ""
                              + "varying highp vec2 vTextureCoord;"
                              + ""
                              + "void main()"
                              + "{"
                              + "  gl_Position = vec4(position, 1.0);"
                              + "  vTextureCoord = textureCoord;"
                              + "}";

         standardVertexShader = this.compileShader(vertexShaderSource, gl.VERTEX_SHADER);
       }

       return standardVertexShader;
     };


     /**
      * Create a program from the shader sources.
      *
      * @param {string|null} vertexShaderSource A GLSL shader, or null to use the standard vertex shader from above.
      * @param {string} fragmentShaderSource    A GLSL shader.
      *
      * @returns {WebGLProgram} A program produced by compiling and linking the given shaders.
      */
     this.createProgram     = function (vertexShaderSource, fragmentShaderSource)
     {
       var fragmentShader;
       var program;
       var vertexShader;

       program        = gl.createProgram();

       // This will compile the shader into code for your specific graphics card.
       if (typeof vertexShaderSource !== "string")
       {
         // What is passed in is not a string, use the standard vertex shader
         vertexShader = this.getStandardVertexShader();
       }
       else
       {
         // It's a string, so compile it.
         vertexShader   = this.compileShader(vertexShaderSource, gl.VERTEX_SHADER);
       }
       fragmentShader = this.compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

       // The program consists of our shaders
       gl.attachShader(program, vertexShader);
       gl.attachShader(program, fragmentShader);

       // Create a runnable program for our graphics hardware.
       // Allocates and assigns memory for attributes and uniforms (explained later)
       // Shaders are checked for consistency.
       gl.linkProgram(program);

       // Shaders are no longer needed as separate objects
       if (vertexShader !== standardVertexShader)
       {
         // Only delete the vertex shader if source was explicitly supplied
         gl.deleteShader(vertexShader);
       }
       gl.deleteShader(fragmentShader);

       return program;
     };

     

     /**
      * Lookup a shader attribute location by name on the given program.
      *
      * @param {WebGLProgram} program   The WebGL program, compiled shaders, containing the attribute.
      *
      * @param {String}       name      The name of the attribute in the given program.
      *
      * @returns WebGLHandlesContextLoss The handle for the named attribute.
      */
     this.getAttribLocation = function (program, name)
     {
       var attributeLocation;

       attributeLocation    = gl.getAttribLocation(program, name);
       if(attributeLocation === -1)
       {
         alert('Can not find attribute ' + name + '.');
       }

       return attributeLocation;
     };

     /**
      * Lookup a shader uniform location by name on the given program.
      *
      * @param {WebGLProgram} program   The WebGL program, compiled shaders, containing the attribute.
      *
      * @param {String}       uniform   The name of the uniform in the given program.
      *
      * @returns WebGLHandlesContextLoss
      */
     this.getUniformLocation    = function (program, name)
     {
       var reference;

       reference = gl.getUniformLocation(program, name);
       if(reference === -1)
       {
         alert('Can not find uniform ' + name + '.');
       }
       return reference;
     };

     canvasHeight  = height_;
     problemHeight = canvasHeight;
     canvasWidth   = width_;
     problemWidth  = canvasWidth;
     attributes    = typeof attributes_ === 'undefined' ? ns.GPGPUtility.STANDARD_CONTEXT_ATTRIBUTES : attributes_;
     canvas        = this.makeGPCanvas(canvasWidth, canvasHeight);
     gl            = this.getGLContext();
     // Attempt to activate the extension, returns null if unavailable
     textureFloat  = gl.getExtension('OES_texture_float');
   };

   // Disable attributes unused in computations.
   ns.GPGPUtility.STANDARD_CONTEXT_ATTRIBUTES = { alpha: false, depth: false, antialias: false };
}(window.vizit.utility));
