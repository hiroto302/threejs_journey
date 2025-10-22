
/*NOTE: lightPosition と pixelPosition への方向ベクトルと、法線ベクトルの内積を使って、
        ライトの影響度を計算する。
        内積の結果が1に近いほど、ライトは法線と同じ方向を向いており、
        逆に-1に近いほど、ライトは法線と反対方向を向いている、
        この結果を、加算また減算するなどして、directional lightの最終的な影響度を決定する。

        今回で言えば、反対方向を向いている箇所を一番明るく、0度に近い箇所を一番暗くしたい。反対面は全く影響
        を受けないよう表現を作成したい。

        ただし、反対側の面の値が 0 ~ -1 の値なると、他の ambient light に対して負の影響を与えてしまうため、
        0未満の値は全て0にクランプする。
*/

/* NOTE: Specular light (鏡面反射光) は、視線ベクトルと反射ベクトルの内積を使って計算する。
        反射ベクトルは、ライトベクトルと法線ベクトルを使って計算できる。
        反射ベクトルと視線ベクトルが近いほど、鏡面反射光の影響度が高くなる。
        これにより、光沢のある表面が実現される。

        reflect 関数は、入射ベクトルと法線ベクトルを使って反射ベクトルを計算する。
        ただし返り値は、反射ベクトルの方向を示すベクトルである。
        lightDirection は ピクセルからライトへのベクトルなので、入射ベクトルとして使うには反転させる必要がある。
        そのため、「-lightDirection」 を使っている。
*/
uniform vec3 uColor;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl

void main()
{
    vec3 normal = normalize(vNormal);
    // camera からピクセルへの方向ベクトル
    vec3 viewDirection = normalize(vPosition - cameraPosition);

    vec3 color = uColor;

    // Light
    vec3 light = vec3(0.0);

    light += ambientLight(
        vec3(1.0, 1.0 , 1.0),   // Light color
        0.03);                  // Light intensity

    light += directionalLight(
        vec3(0.1, 0.1 , 1.0),   // Light color
        1.0,                    // Light intensity
        normal,                 // Normal
        vec3(0.0, 0.0, 3.0),    // Light position
        viewDirection,          // Direction from camera to the pixel
        20.0                    // Specular power
    );

    // Combine light with base color
    color *= light;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(color * vNormal, 1.0);
    // gl_FragColor = vec4(vPosition, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}