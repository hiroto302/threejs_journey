uniform vec3 uColor;
uniform vec2 uResolution;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl
#include ../includes/pointLight.glsl

vec3 halftone(
    vec3 color,
    float repetitions,
    vec3 direction,
    vec3 normal,
    float low,
    float high,
    vec3 pointColor
)
{
    // Grid
    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv = mod(uv * repetitions, 1.0);

    // Radius & Intensity
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);

    // Point distance from center
    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.5 * intensity, point);

    // Apply halftone
    return mix(color, pointColor, point);
}

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
    // Parameters
    float repetitions = 50.0;
    vec3 direction = vec3(0.0, -1.0, 0.0);
    float low = -0.8;
    float high = 1.5;
    vec3 pointColor = vec3(1.0, 0.0, 0.0);

    // Grid
    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv = mod(uv * repetitions, 1.0);

    // Radius & Intensity
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);

    // Point distance from center
    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.5 * intensity, point);

    // Apply halftone
    // color = mix(color, pointColor, point);

    // Final color
    // gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(uv, 1.0, 1.0);
    // gl_FragColor = vec4(point, point, point, 1.0);
    // gl_FragColor = vec4(intensity, intensity, intensity, 1.0);


    // use func halftone
    color = halftone(
        color,
        30.0,
        vec3(0.0, -1.0, 0.0),
        normal,
        - 0.8,
        1.5,
        vec3(1.0, 0.0, 0.0)
    );

    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}