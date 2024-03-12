precision highp float;

uniform vec3 color; 
uniform float layerHeight; 
varying vec3 vUv;

void main() {
    // Constants (TODO: make these uniforms?)
    float curveFactor = 0.6; // How much the layer's edge is curved
    float shadowMagnitude = 0.4; // How much the curve increases/decreases the color
    float shadowOffset = 0.8; // Scalar modifier to lighten or darken
    float colorMix = 0.6; // Proportion of original color vs shading

    // Normalize the offset value to the range [-1, 1]
    float offset = mod(vUv.y, layerHeight) / layerHeight; // [0, 1]
    offset = offset * 2.0; // [0, 2]
    offset = offset - 1.0; // [-1, 1]
    vec3 offsetV = vec3(offset, offset, offset);

    // Alter color vased on offset
    vec3 slope = asin(offsetV * curveFactor) * shadowMagnitude + shadowOffset;
    gl_FragColor = vec4( mix(slope, color, 0.6) , 1.0);
}
