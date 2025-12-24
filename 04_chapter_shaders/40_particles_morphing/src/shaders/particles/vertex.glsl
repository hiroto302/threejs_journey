/* モーフィングの実装方法
    ノイズを使って各パーティクルの移動タイミングをずらすことで、有機的で美しいモーフィングを実現
    * ノイズ計算 (移動タイミングのずらしに使用)
    開始位置のノイズ値(-1.0 ~ 1.0)
        float noiseOrigin = simplexNoise3d(position);

    目標位置のノイズ値(-1.0 ~ 1.0)
        float noiseTarget = simplexNoise3d(aPositionTarget);

    2つのノイズを補間(uProgressに応じて変化)
        float noise = mix(noiseOrigin, noiseTarget, uProgress);
            uProgress = 0.0 → noiseOrigin
            uProgress = 0.5 → 中間
            uProgress = 1.0 → noiseTarget

    -1.0 ~ 1.0 を 0.0 ~ 1.0 に変換(滑らかに)
        noise = smoothstep(-1.0, 1.0, noise)

    * モーフィングのタイミング計算
    duration = 0.4  // 各パーティクルの移動時間は全体の40%

    delay: 移動開始時刻(0.0 ~ 0.6の範囲)
        delay = (1.0 - 0.4) * noise
            = 0.6 * noise

    end: 移動終了時刻
        end = delay + 0.4

    ### タイムライン視覚化
    uProgress:  0.0 ────────────── 0.5 ────────────── 1.0
    パーティクルA:  [====移動====]
    パーティクルB:       [====移動====]
    パーティクルC:            [====移動====]
    結果: 波のように順次移動する!

    * 線形補間
    progress = smoothstep(delay, end, uProgress)
        smoothstep(edge0, edge1, x)
        x が edge0~edge1 の範囲で 0→1 に滑らかに変化

    * 最終位置の計算
    mixedPosition = mix(position, aPositionTarget, progress)
        progress = 0.0 → position (開始位置)
        progress = 0.5 → 中間位置
        progress = 1.0 → aPositionTarget (目標位置)

    * 各パラメーターの影響
    duration が大きい → 多くのパーティクルが同時に動く
        duration = 0.8  // 80%の期間で移動
        delay = 0.2 * noise  // 開始タイミングの差が小さい

    duration が小さい → より波のような動き
        duration = 0.2  // 20%の期間で移動
        delay = 0.8 * noise  // 開始タイミングの差が大きい

    ### 視覚的な違い
    duration = 0.8 (大):
        パーティクルA: [========移動========]
        パーティクルB:  [========移動========]
        パーティクルC:   [========移動========]
        → ほぼ同時に動く

    duration = 0.2 (小):
        パーティクルA: [==移動==]
        パーティクルB:        [==移動==]
        パーティクルC:                [==移動==]
        → 明確な波動
*/

uniform vec2 uResolution;
uniform float uSize;
uniform float uProgress;
uniform vec3 uColorA;
uniform vec3 uColorB;

attribute vec3 aPositionTarget;
attribute float aSize;

varying vec3 vColor;

#include ../includes/simplexNoise3d.glsl

void main()
{
    // Mixed position
    float noiseOrigin = simplexNoise3d(position);
    float noiseTarget = simplexNoise3d(aPositionTarget);
    float noise = mix(noiseOrigin, noiseTarget, uProgress);
    noise = smoothstep(-1.0, 1.0, noise);

    // Timing for morphing
    float duration = 0.4;
    float delay = (1.0 - duration) * noise;
    float end = delay + duration;
    float progress = smoothstep(delay, end, uProgress);
    vec3 mixedPosition = mix(position, aPositionTarget, progress);

    // Final position
    vec4 modelPosition = modelMatrix * vec4(mixedPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Point size
    gl_PointSize = aSize * uSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // varyings
    vColor = mix(uColorA, uColorB, noise); // Color gradient based on noise
}