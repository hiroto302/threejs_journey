vec3 directionalLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower)
{
    // Light direction & reflection(入射角と反射角) for specular
    vec3 lightDirection = normalize(lightPosition);
    vec3 lightReflection = reflect(-lightDirection, normal);

    // Shading
    float shading = dot(normal, lightDirection);

    // Specular (inverted value to get appropriate highlight)
    float specular = - dot(lightReflection, viewDirection);
    specular = max(0.0, specular);           // ← Clamp to be >= 0.0
    specular = pow(specular, specularPower); // ← Shininess factor

    // Clamp shading to be >= 0.0
    shading = max(0.0, shading);

    // return lightColor * lightIntensity * shading + lightColor  * lightIntensity * specular;
    return lightColor * lightIntensity * (shading + specular);
    // return vec3(shading);
    // return vec3(specular * lightColor * lightIntensity); // ← 反射光に色と光の強度を乗算して返す
}