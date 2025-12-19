/* NOTE: 計算方法について
    * gl_PointCoord
        各パーティクルのポイントスプライト内でのUV座標を提供します。
        座標系:左上が (0, 0)、右下が (1, 1). 中心が常に (0.5, 0.5)

        new THREE.Points(particles.geometry, particles.material) のみ利用可能

    * distanceToCenter
        uv - 0.5 で中心(0.5, 0.5)からの相対位置ベクトルを計算
        length() でそのベクトルの長さ(距離)を計算
        中心 (0.5, 0.5): distanceToCenter = 0.0
        端 (0.0, 0.0) や (1.0, 1.0): distanceToCenter ≈ 0.707 (√2/2) の値となる

    * float alpha = 0.05 / distanceToCenter - 0.1;
        これは**逆数関数**を使った計算
            - 中心に近い (distanceToCenter が小さい) → 大きな値
            - 外側 (distanceToCenter が大きい) → 小さな値
            - 0.05 はスケーリングファクターで、全体の透明度を調整
            - -0.1 はオフセットで、透明度を微調整
*/

varying vec3 vColor;

void main()
{
    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - 0.5);
    float alpha = 0.05 / distanceToCenter - 0.1;

    // Final color
    gl_FragColor = vec4(vColor, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}