precision lowp float;

uniform vec3 color; 
varying vec3 vUv;

void main() {
    // Normalize the height value to the range [0, 1]
    float normalizedHeight = mod(vUv.y / 0.3, 0.75) + 0.5;
    gl_FragColor = vec4(mix(vec3(normalizedHeight, normalizedHeight, normalizedHeight), color, 0.6), 1.0);
}
