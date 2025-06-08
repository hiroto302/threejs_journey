/**
 * Default Export の場合
 */

// 1. 関数を Default export
// export default () => {
//   console.log("関数を Default export")
// }

// 2: クラスを default export
// export default class TestClass {
//   constructor() {
//     console.log("TestClass コンストラクタ")
//   }
// }

// 3: オブジェクトを default export
export default {
    hello: "module hello in test.js",
    sayHello: () => console.log("Hello !")
}


/**
 * Named Export の場合
 */
// Property
const oneThing = {
  hello: 'hello property in oneThing'
}
// 関数
const anotherThing = () =>
{
  console.log("Hi !! from anotherThing")
}
//NOTE: 複数をまとめて export
export { oneThing, anotherThing }

//NOTE: export しながら定義
export const yetAnother = () => {
  console.log("同時に定義してExport")
}