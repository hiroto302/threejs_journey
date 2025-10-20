uniform vec3 uColor;

varying vec3 vNormal;

#include ../includes/ambientLight.glsl

/*NOTE: lightPosition と pixelPosition への方向ベクトルと、法線ベクトルの内積を使って、
        ライトの影響度を計算する。
        内積の結果が1に近いほど、ライトは法線と同じ方向を向いており、
        逆に-1に近いほど、ライトは法線と反対方向を向いている、
        この結果を、加算また減算するなどして、directional lightの最終的な影響度を決定する。

        今回で言えば、反対方向を向いている箇所を一番明るく、0度に近い箇所を一番暗くしたい。反対面は全く影響
        を受けないよう表現を作成したい。
*/
vec3 directionalLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition)
{
    vec3 lightDirection = normalize(lightPosition);

    // Shading
    float shading = dot(normal, lightDirection);

    return lightColor * lightIntensity * shading;
    // return vec3(shading);
}

void main()
{
    vec3 color = uColor;

    // Light
    vec3 light = vec3(0.0);
    // light += ambientLight(
    //     vec3(1.0, 1.0 , 1.0),   // Light color
    //     0.03);                  // Light intensity
    light += directionalLight(
        vec3(0.1, 0.1 , 1.0),
        1.0,
        normalize(vNormal),
        vec3(0.0, 0.0, 3.0)
    );

    // Combine light with base color
    color *= light;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(color * vNormal, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}