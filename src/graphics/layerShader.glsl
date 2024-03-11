void main() {
    // Normalize the height value to the range [0, 1]
    float height = (gl_FragCoord.y / gl_FragCoord.w) / 50.0;
    float normalizedHeight = mod(height, 5.0);
    gl_FragColor = vec4(normalizedHeight, normalizedHeight, normalizedHeight, 1.0);
}
