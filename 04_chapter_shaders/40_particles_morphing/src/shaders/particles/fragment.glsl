varying vec3 vColor;

void main()
{
    // Compute alpha based on distance to center
    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - 0.5);
    // Adjusted alpha calculation for better visibility
    float alpha = 0.05 / distanceToCenter - 0.1;

    // Final color
    gl_FragColor = vec4(vColor, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}