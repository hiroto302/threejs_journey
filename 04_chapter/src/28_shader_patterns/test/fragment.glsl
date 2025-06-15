/* NOTE: UV Map の役割
2D texture をモデルにどのように適用するかだよね！

UV座標とは?
    UV座標は0.0から1.0の範囲で、テクスチャをメッシュにマッピングするための2D座標
    U = 横方向（X軸）、V = 縦方向（Y軸）

Three.js の UV 座標系
    左上が (0, 0)
    右上が (1, 0)
    左下が (0, 1)
    右下が (1, 1)

WebGL標準: 左下が原点 (0, 0)
Three.js: 左上が原点 (0, 0)

float型が使用可能

*/

/* WebGL で活用する 数学関数

    三項演算子 :
        strength = strength < space ? 0.0 : 1.0;

    step(edge, x) :
        x < edge の場合 → 0.0 を返す
        x >= edge の場合 → 1.0 を返す

    mod(x, y) ：
        x を y で割った余りを返す
        結果は常に 0.0 から y の間（yは含まない）

    abs(x) :
        xの値は絶対値を返す。0.0 以上の正の値となる。
        abs関数の重要な特徴
            対称性：基準点を中心とした完全な対称パターン
            最小値：基準点で必ず0.0になる
            線形変化：滑らかに変化する（stepのような急激な変化はない）
            距離計算：2点間の距離を求める際の基本要素
            シェーダーで対称的なパターンや距離ベースの効果を作る際に非常に重要な関数！

    min(a, b) :
        ２つの値の内小さい方を返す

    floor(x) :
        x が 0.8 の時は、0を返す
        x が 1.2 の時は、1.2を返す

    round(x) :
        x が 0.8 の時は、1.0を返す
        x が 1.2 の時は、1.2を返す

    length(vec2(x, y)) = sqrt(x*x + y*y) :
        つまり、原点(0,0)からの距離（ユークリッド距離）を計算をする
        length(vec2(0.0, 0.0)) = 0.0      // 左上角
        length(vec2(1.0, 0.0)) = 1.0      // 右上角
        length(vec2(0.0, 1.0)) = 1.0      // 左下角
        length(vec2(1.0, 1.0)) = 1.414... // 右下角（√2）
        length(vec2(0.5, 0.5)) = 0.707... // 中央（√0.5）

    distance(a, b) = length(a - b) :
        つまり、2点間のユークリッド距離を計算
        任意の２点間の距離が計算可能

    atan(x,y) :
        座標(x,y) から原点に対する角度(ラジアン)を返す
        戻り値範囲 -π ~ π (約-3.14 ~ 3.14)

        atan関数の角度マッピング
            基本的な角度の対応関係
                π/2 (90度)
                    ↑
        π (180度) ← ● → 0 (0度)
                    ↓
                -π/2 (-90度)


    ランダムの値を返すメソッドが WebGL には無いので、.jS のを活用して持ってくる
*/

#define PI 3.141592

varying vec2 vUv;

// https://thebookofshaders.com/10/ をから参考にしたよ
float random (vec2 st) {
    return fract(sin(dot(st.xy,
                        vec2(12.9898,78.233)))*
        43758.5453123);
}

// これはLink不明
vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}


//	Classic Perlin 2D Noise
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);} //Perlin 3D Noise から持ってくる

float cnoise(vec2 P){
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 *
        vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}


//POINT: 各ピクセル(フラグメント)で実行される
void main()
{
    // 1. uv map の位置に応じて各頂点の色を変化
    // gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);

    /* NOTE: 実際の表示される時の注意点
        Three.jsの内部処理では左上が(0,0)
        WebGLの画面表示では左下が(0,0)
        結果としてUV座標のY軸が上下反転して表示される
        テクスチャマッピングでも同様の現象が発生する
        なので、必要に応じて以下のように y 座標をどのように反映させるか制御する
*/
    // 2. 上下逆転 表示
    // gl_FragColor = vec4(vUv.x, 1.0 - vUv.y, 1.0, 1.0);


    // 3. グラディエント カラー
    // float strength = vUv.x;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 4. シャッター グラディエント
    // float shutterGrid = 10.0;
    // float strength = mod(vUv.y * shutterGrid, 1.0);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 5: シャッター 単色格子
    // float shutterGrid = 10.0;
    // float strength = mod(vUv.y * shutterGrid, 1.0);
    // float space = 0.8;
    // strength = step(space, strength);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 6: シャッター 横と縦のコンビネーション
    // float shutterGrid = 10.0;
    // float space = 0.8;
    // float strengthX = step(space, mod(vUv.x * shutterGrid, 1.0));
    // float strengthY = step(space, mod(vUv.y * shutterGrid, 1.0));
    // float combination = strengthX + strengthY;
    // gl_FragColor = vec4(combination, combination, combination, 1.0);


    // 7: 格子点 (縦と横が重なっている箇所のみ表示)
    // float shutterGrid = 10.0;
    // float space = 0.8;
        // step関数の結果：
        // strengthXは、X軸方向の特定の位置で 1.0（白）、それ以外で 0.0（黒）
        // strengthYは、Y軸方向の特定の位置で 1.0（白）、それ以外で 0.0（黒）
    // float strengthX = step(space, mod(vUv.x * shutterGrid, 1.0));
    // float strengthY = step(space, mod(vUv.y * shutterGrid, 1.0));
        // 乗算の結果 :
        // strengthX と strengthY 同士の値が1同士の時のみ 1。それ以外の計算は 1*0, 0*1, 0*0 のような結果で 0。
        // なので重なっている箇所のみ表示される。
    // float combination = strengthX * strengthY;
    // gl_FragColor = vec4(combination, combination, combination, 1.0);


    // 13: 格子点 の縦と横の大きさの制御
    // float grid = 10.0;
    // float spaceX = 0.2;
    // float spaceY = 0.8;
    // float strength = step(spaceX, mod(vUv.x * grid, 1.0));
    // strength *= step(spaceY, mod(vUv.y * grid, 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 14: 格子点 横長と縦長を組み合わせたもの！
    // float grid = 10.0;
    // float spaceX = 0.4;
    // float spaceY = 0.8;

    // float strengthX = step(spaceX, mod(vUv.x * grid, 1.0));
    // strengthX *= step(spaceY, mod(vUv.y * grid, 1.0));

    // float strengthY = step(spaceY, mod(vUv.x * grid, 1.0));
    // strengthY *= step(spaceX, mod(vUv.y * grid, 1.0));

    // float strengthXY = strengthX + strengthY;
    // gl_FragColor = vec4(strengthXY, strengthXY, strengthXY, 1.0);


    // 15: 格子点 横長と縦長 をクロスした十字架模様のもの (イメージは14で作成した縦長と横長の点を並行移動させたもの！)
    // float grid = 10.0;
    // float spaceX = 0.4;
    // float spaceY = 0.8;

    // float strengthX = step(spaceX, mod(vUv.x * grid , 1.0));
    // strengthX *= step(spaceY, mod(vUv.y * grid + spaceX * 0.5, 1.0));

    // float strengthY = step(spaceY, mod(vUv.x * grid + spaceX * 0.5, 1.0));
    // strengthY *= step(spaceX, mod(vUv.y * grid, 1.0));

    // float strengthXY = strengthX + strengthY;
    // gl_FragColor = vec4(strengthXY, strengthXY, strengthXY, 1.0);



    // 16: 中央から左右にかけて、グラディエントカラー (イメージとして中央が黒色 : 0.5 ~ 0 ~ 0.5)
    // 0~1の値を返す vUv の値を -0.5することで、-0.5~0.5の値を取得
    // それらの値に絶対値にすることで、0.5 ~ 0 ~ 0.5 の値を取得
    // float strength = abs(vUv.x - 0.5);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 17_a: ◇グラディエントカラー
    // float strength = abs(vUv.x - 0.5);
    // strength += abs(vUv.y - 0.5);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 17: 中央から左右上下 グラディエントカラー (四角形の同心円のようなパターン)
        // abs(vUv.x - 0.5) → X軸方向の中央からの距離（0.0〜0.5）
        // abs(vUv.y - 0.5) → Y軸方向の中央からの距離（0.0〜0.5）
        // min(...) → 2つの距離のうち小さい方を選択
        // この結果、上下左右真ん中は暗く(0)、そこから離れている各角にかけて白(1)くなるようなものになる
        // 言い換えれば、画面中央が最も暗く、四隅に向かって段階的に明るくなる四角形状のグラデーション
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 18: 上の max にしたパターン(白と黒が逆転)
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 19 : 上の step を組み合わせて 白の正方形の真ん中に黒の正方形を作成
        // strength の値が 0 ~ 0.5 の値なので、 step の値はそれ以下の値でなければならないことに注意
        // 単純な閾値判定：距離が0.3以上で白、未満で黒
        //  結果：中央に黒い正方形、外側が白
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    // float stepStrength = step(0.3, strength);
    // gl_FragColor = vec4(stepStrength, stepStrength, stepStrength, 1.0);

    // 20 : 白いリング パターン (19とは実装の考えが全くちがうことに注意)
        // square1 = step(0.2, distance) → 距離0.2以上の時1.0、未満の時は0.0
        // square2 = 1.0 - step(0.25, distance) → 距離0.25未満の時1.0、以上の時は0.0
        // strength = square1 * square2 → 両方が1.0の範囲のみ白 (0.2 ~ 0.25 の中心からの距離のみ箇所)
    // float square1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float square2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float strength = square1 * square2;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);



    // 21: グラディエントカラー 縦セパレイト10
        // vUv.x の値は 0.0 ~ 1.0の値を返す。それらの値を10倍にしたものをfloorすると 1 ~ 10 の第一小数点以下が無いものだけになる
        // 上記の値を 10 で割ることで、 0.1 ~ 1.0 の 10種類の値だけが取得可能となるのだ！
    // float strength = floor(vUv.x * 10.0) / 10.0;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 22: グラディエントカラー 縦横セパレイト10 ((感覚的に書いてしまったが理解できた)
    // float strengthX = floor(vUv.x * 10.0) / 10.0;
    // float strengthY = floor(vUv.y * 10.0) / 10.0;
    // float strengthXY = strengthX * strengthY;
    // gl_FragColor = vec4(strengthXY, strengthXY, strengthXY, 1.0);


    // 23: テレビノイズ (ランダムな値を返すメソッドを借りてきたやつを使用)
    // float strength = random(vUv);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 24: テレビノイズ Grid 四角形 (22 でやったやつとの合わせ技)
    // vec2 gridUv = vec2 (
    //     floor(vUv.x * 10.0) / 10.0,
    //     floor(vUv.y * 10.0) / 10.0
    // );
    // float strength = random(gridUv);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 25: テレビノイズ Grid 四角形の形を統一されている平行四辺形に！
    // vec2 gridUv = vec2 (
    //     floor(vUv.x * 10.0) / 10.0,
    //     floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0  // 横線をy方向に加算して、斜めになるよう少し変更しただけ!
    // );
    // float strength = random(gridUv);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);



    // 26: 原点(0,0)からの距離（ユークリッド距離）を計算してグラデーション色を形成
    // float strength = length(vUv);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 27: 原点(0.5,0.5)からの距離（ユークリッド距離）を計算してグラデーション色を形成
    // float strength = length(vUv - 0.5);                     // 中心点が左下から右上にかけての直線上にしか変更できない
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 27_a: distance 距離を利用して、origin と 計測位置から値を算出。。
    // vec2 origin = vec2(0.1, 0.1);                               // 中心点をどこでもずらずような感じの表現ができる
    // float strength = distance(origin, vUv);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 28: 白黒の逆転
    // vec2 origin = vec2(0.5, 0.5);
    // float strength = 1.0 - distance(origin, vUv);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 29: 中心が白色の色味が強くなるような表現
    // vec2 origin = vec2(0.5, 0.5);
    // float strength = 0.015 / distance(origin, vUv) ;  // 中心点から離れる程、値が小さくなる
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 29_a: 上記では中心点から離れたところが完全な黒色とかにする
    // vec2 origin = vec2(0.5, 0.5);
    // float strength = 0.015 / distance(origin, vUv) - 0.1 ;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 30: 中心の白玉を横にストレッチさせる(ここでは、1.0以下の値を掛け合わせて圧縮する)
    // float stretchX = 0.1;                 // X軸 圧縮率
    // float stretchY = 0.5;                 // Y軸 圧縮率
    // vec2 origin = vec2(0.5, 0.5);         // 中心位置
    // // 圧縮後、白玉の中心位置から stretch/2 だけずれてしまう。それを見越して、中心位置を変更しとく
    // float offsetX = 0.5 - stretchX * 0.5;
    // float offsetY = 0.5 - stretchY * 0.5;

    // vec2 lightUv = vec2(
    //     // origin から 均等に広がる白色の円形をX軸・y軸方向に圧縮 → 押し潰され結果的に楕円形のようになる
    //     vUv.x * stretchX + offsetX,
    //     vUv.y * stretchY + offsetY
    // );
    // float strength = 0.015 / distance(origin, lightUv);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 31・32: 中心の白玉を上下左右に伸ばす ◇のライトを表現 ・ついでに45回転もさせた
    // vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));

    // float stretchX = 0.1;
    // float stretchY = 0.5;
    // vec2 origin = vec2(0.5, 0.5);
    // float offsetX = 0.5 - stretchX * 0.5;
    // float offsetY = 0.5 - stretchY * 0.5;

    // vec2 lightUvX = vec2(
    //     rotatedUv.x * stretchX + offsetX,
    //     rotatedUv.y * stretchY + offsetY
    // );
    // float lightX = 0.015 / distance(origin, lightUvX);

    // vec2 lightUvY = vec2(
    //     rotatedUv.x * stretchY + offsetY,
    //     rotatedUv.y * stretchX + offsetX
    // );
    // float lightY = 0.015 / distance(origin, lightUvY);

    // float strength = lightX * lightY;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);



    // 33. 真ん中が黒色に抜かれたやつ (27の発展系 step)
    // float strength = step(0.25, distance(vUv, vec2(0.5)));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 34. 真ん中のその周りが黒色になる(27の発展系 abs)
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 35. 真ん中のその周りが黒色になるはっきり区別されるやつ(33の発展系)
    // float strength = step(0.01,abs(distance(vUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 36. 白黒を反転したやつ (35の発展系)
    // float strength = 1.0 - step(0.01,abs(distance(vUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 37. ぐにゃぐにゃするやつ (36の発展系)
    // vec2 wavedUv = vec2(
    //     vUv.x,
    //     vUv.y + sin(vUv.x * 100.0) * 0.1    // 縦方向にsin波を連続で反映させる
    // );
    // float strength = 1.0 - step(0.01,abs(distance(wavedUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 38. 縦にも横にもぐにゃぐにゃさせる アメーバなやつ (37の発展系)
    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * 30.0) * 0.1,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1    // 縦方向にsin波を連続で反映させる
    // );
    // float strength = 1.0 - step(0.01,abs(distance(wavedUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 39. 38のやつの値を色々変えるとおもろいよ (ここら辺は理解を超えている)
    // float wave = 100.0;
    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * wave) * 0.1,
    //     vUv.y + sin(vUv.x * wave) * 0.1    // 縦方向にsin波を連続で反映させる
    // );
    // float strength = 1.0 - step(0.01,abs(distance(wavedUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);



    // 40. atan を利用した「左下原点」のグラディエントカラー
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 41. atan を利用した「中心原点」のグラディエントカラー
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float strength = angle;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 42. 中心から外側への角度ベースの円形グラデーション (41発展系)
        // vUv は 0 ~ 1 値しか返さない
        // つまり、下記は 0 ~ 180 度の範囲しか陰影の結果を出さない
        // (-0.5しているので、中心点から真下が0スタートで、そこから180度進んだ真上まで反映させている)
        // 結果 -π ~ π の範囲
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;      // 2π で割って、0-1範囲への正規化。中心点ズレしているのので結果は -0.5 ~ 0.5 となってしまっている
    // angle += 0.5;           // 正の値へ変換 0~1の範囲 (色の値への適用 0 ~ 1が欲しいからね! 負だと黒色になるだけ)
    // float strength = angle;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 43. Grid 中心から外側への角度ベースの円形グラデーション (42発展系 mod を利用したGrid表現)
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;

    // float grid = 20.0;
    // angle *= grid;
    // angle = mod(angle, 1.0);

    // float strength = angle;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 44. 白黒の表現をはっきりとさせる (42発展系 sin)
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = sin(angle * 100.0);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);



    // 45. 花形 真ん中の円を綺麗に波状形にして作成(36 を 44で使用した技で 発展)
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float sinusoid = sin(angle * 100.0);
    // float flower = 0.2; // この値を変更して色々な形状を試してみてね！

    // float radius = 0.25 + sinusoid * flower;
    // float strength = 1.0 - step(0.01,abs(distance(vUv, vec2(0.5)) - radius));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);



    // 46. Perlin noise と呼ばれるパターン 水・cloud・smoke とかの様々な表現で使われているやつ！
    // https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83 で参考になるやつがあるが、Three.jsだとそのまま持ってきても動かないことに注意！
    // cnoise : 2D coordinates provide Classic Perlin Noise
    // float strength = cnoise(vUv * 10.0);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);


    // 47. Perlin noise の色々なパターン 1
    // float strength = step(0.0, cnoise(vUv * 10.0));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 48. Perlin noise の色々なパターン 2
    // float strength = 1.0 - abs(cnoise(vUv * 10.0));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 49. Perlin noise の色々なパターン 2
    // float strength = sin(cnoise(vUv * 10.0) * 20.0);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 50. Perlin noise の色々なパターン 3
    float strength = step(0.9, sin(cnoise(vUv * 5.0) * 20.0));
    gl_FragColor = vec4(strength, strength, strength, 1.0);








}