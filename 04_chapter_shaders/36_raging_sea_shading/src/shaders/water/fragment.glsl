uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/directionalLight.glsl

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);

    // Base color
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    mixStrength = smoothstep(0.0, 1.0, mixStrength);
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    // Light
    vec3 light = vec3(0.0);
    light += directionalLight(
        vec3(1.0),             // lightColor
        1.0,                   // lightIntensity
        normal,                // normal
        vec3(-1.0, 0.5, 0.0),  // lightDirection
        viewDirection,         // viewDirection
        30.0                   // specularPower
    );

    // Apply light
    color *= light;

    // Final color
    // gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(vPosition, 1.0);
    gl_FragColor = vec4(vNormal, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}