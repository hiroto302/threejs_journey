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

/*NOTE: Distance Decay (距離減衰)
        Point Lightなどの場合、距離に基づく減衰を考慮する必要がある。
        距離が遠くなるほど、光の強度が弱くなるように調整する。
        これにより、リアルな照明効果が得られる。
*/

/*NOTE: Directional Light と Point Light の違い
        Directional Light は、無限遠から来る平行な光線を表す。
        そのため、距離減衰は考慮しない。
        一方、Point Light は特定の位置から放射される光を表す。
        そのため、距離減衰を考慮する必要がある。

        また、lightDirection の計算方法も異なる。
        Directional Light では、lightPosition ベクトルを正規化して使用する。
        Point Light では、ピクセル位置からライト位置へのベクトルを計算し、正規化して使用する。
        これは、Point Light が特定の位置から放射されるためである。
*/


uniform vec3 uColor;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl
#include ../includes/pointLight.glsl

void main()
{
    vec3 normal = normalize(vNormal);
    // camera からピクセルへの方向ベクトル
    vec3 viewDirection = normalize(vPosition - cameraPosition);

    vec3 color = uColor;

    // Lights
    vec3 light = vec3(0.0);
    // Ambient Light
    light += ambientLight(
        vec3(1.0, 1.0 , 1.0),   // Light color
        0.03);                  // Light intensity
    // Directional Light
    light += directionalLight(
        vec3(0.1, 0.1 , 1.0),   // Light color
        1.0,                    // Light intensity
        normal,                 // Normal
        vec3(0.0, 0.0, 3.0),    // Light position
        viewDirection,          // Direction from camera to the pixel
        20.0                    // Specular power
    );
    // First Point Light
    light += pointLight(
        vec3(1.0, 0.1 , 0.1),   // Light color
        1.0,                    // Light intensity
        normal,                 // Normal
        vec3(0.0, 2.5, 0.0),    // Light position
        viewDirection,          // Direction from camera to the pixel
        20.0,                   // Specular power
        vPosition,              // Position
        0.25                    // Light decay
    );
    // Second point light
    light += pointLight(
        vec3(0.1, 1.0, 0.5),    // Light color
        1.0,                    // Light intensity
        normal,                 // Normal
        vec3(2.0, 2.0, 2.0),    // Light position
        viewDirection,          // Direction from camera to the pixel
        20.0,                   // Specular power
        vPosition,              // Position
        0.2                     // Light decay
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