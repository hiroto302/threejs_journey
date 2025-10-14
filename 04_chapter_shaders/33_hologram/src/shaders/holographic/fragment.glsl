varying vec3 vPosition;

/*NOTE: 使用する関数
  mod(x, y) ：
          x を y で割った余りを返す
          結果は常に 0.0 から y の間（yは含まない）

  pow(x, y) ：
          x の y 乗を返す。
            x の値が0に近い場合は結果が0に近づき、
            x の値が1に近い場合は結果が1に近づく。
          この緩急を調整するのに便利。
            yの値が大きいほど、x の値が0に近い場合は結果がより小さくなり、
            x の値が1から遠ざかる場合は結果がより大きくなる。一気に上昇する。
          実際にxの3乗関数とか見てみるとわかりやすい。
*/


void main()
{
  // ③ Stripes
  float stripes = mod(vPosition.y * 20.0, 1.0);
  // ④ Make stripes sharper
  stripes = pow(stripes, 3.0);
  

  // ① Base color based on position → これはこれ可愛い!
  // gl_FragColor = vec4(vPosition, 1.0);

  // ② Stripes color
  gl_FragColor = vec4(stripes, stripes, stripes, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}