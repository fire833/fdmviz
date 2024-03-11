uniform float near; // Near plane value
uniform float far; // Far plane value

void main() {
    // Normalize the height value to the range [0, 1]
    float normalizedHeight = (gl_FragCoord.y) / 1080.0;
    gl_FragColor = vec4(normalizedHeight, normalizedHeight, normalizedHeight, 1.0);
}
