/* NOTE: Specular の求めた方について
    dot(lightReflection, -viewDirection);
        平行光源の pixel に対する 反射方向が、pixel から見て Camera 方向と同じ向きの場合に
        ハイライトが最大となる(1.0の値)ように計算する必要がある。
        viewDirection は、Camera から見た pixel の方向ベクトルなので、
        ベクトルを反転させる必要がある。

    specular = max(0.0, specular);
    specular = pow(specular, specularPower);
        specular が負の値との時、pow関数の specularPower が偶数の時、
        返り値の値が正の数になってしまう。
        平行光源と真反対にあるピクセルも光ってしまうの Clamp する必要がある。

    pow(負の数, 偶数の指数) → 正の値
    pow(負の数, 奇数の指数) → 負の値

    例：反射方向とカメラ方向が逆の場合
        float specular = -0.3;  // 内積の結果が負

        クランプしない場合
        float result1 = pow(-0.3, 8.0);   // 偶数 → 正の値 (約 0.000065)
        float result2 = pow(-0.3, 9.0);   // 奇数 → 負の値 (約 -0.0000196)

        クランプした場合
        specular = max(0.0, -0.3);        // 0.0にクランプ
        float result3 = pow(0.0, 8.0);    // 0.0 (正しい結果)
*/
vec3 directionalLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower)
{
    // Light direction & reflection(入射角と反射角) for specular
    vec3 lightDirection = normalize(lightPosition);
    vec3 lightReflection = reflect(-lightDirection, normal);

    // Shading
    float shading = dot(normal, lightDirection);

    // Specular (inverted viewDirection value to get appropriate highlight)
    // float specular = - dot(lightReflection, viewDirection); 式の意味合いとして ↓ の方が正しい。
    float specular = dot(lightReflection, -viewDirection);
    specular = max(0.0, specular);           // ← Clamp to be >= 0.0
    specular = pow(specular, specularPower); // ← Shininess factor

    // Clamp shading to be >= 0.0
    shading = max(0.0, shading);

    // return lightColor * lightIntensity * shading + lightColor  * lightIntensity * specular;
    return lightColor * lightIntensity * (shading + specular);
    // return vec3(shading);
    // return vec3(specular);
    // return vec3(specular * lightColor * lightIntensity); // ← 反射光に色と光の強度を乗算して返す
}