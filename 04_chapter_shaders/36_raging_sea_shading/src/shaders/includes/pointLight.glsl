vec3 pointLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower, vec3 position, float lightDecay)
{
    // Light direction & reflection for point light
    vec3 lightDelta = lightPosition - position;
    float lightDistance = length(lightDelta);
    vec3 lightDirection = normalize(lightDelta);
    vec3 lightReflection = reflect(-lightDirection, normal);

    // Shading
    float shading = dot(normal, lightDirection);
    shading = max(0.0, shading);

    // Specular (inverted value to get appropriate highlight)
    float specular = - dot(lightReflection, viewDirection);
    specular = max(0.0, specular);           // ← Clamp to be >= 0.0
    specular = pow(specular, specularPower); // ← Shininess factor

    // Decay based on distance (距離に基づく減衰)
    float decay = 1.0 - lightDistance * lightDecay; // ← Adjust the 0.2 value to control the decay rate


    return lightColor * lightIntensity * decay * (shading + specular);
}