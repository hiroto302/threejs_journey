uniform vec3 uColor;
uniform vec2 uResolution;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl
#include ../includes/pointLight.glsl

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = uColor;

    // Lights
    vec3 light = vec3(0.0);
    light += ambientLight(
        vec3(1.0),   // Light color
        1.0          // Light intensity
    );
    light += directionalLight(
        vec3(1.0, 1.0, 1.0),
        1.0,
        normal,
        vec3(1.0, 1.0, 0.0),
        viewDirection,
        1.0
    );
    color *= light;


    // Halftone
    // Grid
    float repetitions = 30.0;
    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv = mod(uv * repetitions, 1.0);
    // Point distance from center
    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.5, point);


    // Final color
    // gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(uv, 1.0, 1.0);
    gl_FragColor = vec4(point, point, point, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}