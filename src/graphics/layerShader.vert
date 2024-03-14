// See https://threejs.org/docs/index.html#api/en/renderers/webgl/WebGLProgram for other predefined uniforms/attributes

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
attribute vec3 position;
varying vec3 vUv;

void main() {
    vUv = position;

    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
}