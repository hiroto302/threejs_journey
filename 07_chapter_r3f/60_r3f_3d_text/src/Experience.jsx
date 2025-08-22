import { OrbitControls, Text3D, Center, useMatcapTexture } from '@react-three/drei'
import { Perf } from 'r3f-perf'

//NOTE: https://gero3.github.io/facetype.js/ ここからフォントをダウンロード・作成できる

/*NOTE: Matcapture
https://github.com/emmelleppi/matcaps?tab=readme-ov-file MatcapTextureのサンプル, 気に入ったもの id を使用。
idは github.com/emmelleppi/matcaps から取得される。
今回の実装方法は、CDN(Content Delivery Network)に依存している。なので id が変わると、matcapTexture も変わる。
なので、本番環境では、matcapTexture をローカルに保存して使用することを推奨。
*/

/* NOTE: 配列を使った繰り返し処理でコンポーネントを大量生成するテクニック
Array(100) → [empty × 100] (これは動作しない)
[...Array(100)] → [undefined × 100] (動作する！)
スプレッド演算子によって、実際のインデックス（0, 1, 2...99）が作成され、全てにundefinedが割り当てられる。
これにより、map()メソッドを使用して、100個の要素を生成することができる。
    value: undefined, index: 0
    value: undefined, index: 1
    value: undefined, index: 2 これらが map()の引数として渡される。

map()は、存在するプロパティ（インデックス）に対してのみコールバックを実行
*/

export default function Experience()
{
    // id: 8B892C_D4E856_475E2D_47360A
    const [matcapTexture] = useMatcapTexture('8B892C_D4E856_475E2D_47360A', 256)

    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        {/* Center: pivot（基準点）を幾何学的中心に移動させるイメージ */}
        <Center position={[0, 0, 0]}>
            <Text3D
                    font="./fonts/helvetiker_regular.typeface.json"
                    size={1}                   // テキストのサイズ
                    height={0.2}               // テキストの厚み（Z軸方向の深さ）
                    curveSegments={12}         // 曲線部分の分割数（滑らかさ）
                    bevelEnabled={true}        // ベベル（角の丸み）を有効にするか
                    bevelThickness={0.02}      // ベベルの厚み
                    bevelSize={0.02}           // ベベルのサイズ
                    bevelOffset={0}            // ベベルのオフセット
                    bevelSegments={5}          // ベベルの分割数
            >
                Hello World!
                <meshMatcapMaterial matcap={ matcapTexture } />
            </Text3D>
        </Center>

        { [...Array(100)].map((value, index) =>
            <mesh
                position={[
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10
                ]}
                scale={0.2 + Math.random() * 0.2}
                rotation={[
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    0
                ]}
                // key={crypto.randomUUID()}
                key={index}
            >
                <torusGeometry args={[1, 0.6, 16, 32]}/>
                <meshMatcapMaterial matcap={ matcapTexture } />
            </mesh>
        )}
    </>
}