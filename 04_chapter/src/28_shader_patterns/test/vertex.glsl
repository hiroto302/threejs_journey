/* NOTE: ERROR: 0:69: 'uv' : redefinition
    attribute vec2 uv;
    上記のように、ShaderMaterial ではすでに定義されているものあるから RawShaderMaterial との区別はしっかりね！
*/

varying vec2 vUv;

//POINT: 各頂点で実行される処理
void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // 上記の頂点の
    vUv = uv;
}