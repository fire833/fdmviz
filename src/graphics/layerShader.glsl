void main() {
    // Normalize the height value to the range [0, 1]
    float height = (gl_FragCoord.y / 20.0);
    float normalizedHeight = mod(height, 5.0 * gl_FragCoord.w) + 0.7;
    gl_FragColor = vec4(normalizedHeight, normalizedHeight, normalizedHeight, 1.0);
}
