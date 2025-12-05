/* ここでの fragment shader 実装について
    * gl_PointCoord
        gl_PointCoord とは？
        これはパーティクル（Points）専用の特別な変数。
        一つの粒（正方形）の左上を (0, 0)、右下を (1, 1) とする座標系です。
        画面全体の UV ではなく、**「その粒1つの中だけのローカルな住所」**です。

    * 粒の形を丸くする
        粒の形を丸く見せるために、gl_PointCoord を使って、粒の中心からの距離を計算します。
        もしその距離が半径（0.5）より大きければ、そのピクセルを描画しない（discard）ようにします。
        これにより、粒の外側の部分が透明になり、丸い形に見えます。


        webGLの POINTS は、GPUの仕様上、必ず 正方形 で描画させるからそれを、丸い形状に見せているだけ。
*/

varying vec3 vColor;

void main()
{
    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - vec2(0.5));

    if(distanceToCenter > 0.5)
        discard;

    gl_FragColor = vec4(vColor, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}