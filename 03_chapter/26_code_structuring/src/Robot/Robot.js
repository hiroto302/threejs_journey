/**
 * Classes
 */
export class Robot
{
  constructor(name, legs)
  {
    // this : Context と読んでいる
    // 自動でプロパティを生成してくれていて、他のクラス値の参照・変更が可能となっている
    this.name = name
    this.legs = legs
    this.sayHi()
  }

  sayHi()
  {
    //NOTE: ダブル・シングルクォートではなく、バッククォートで囲んで ${変数} を挿入することが可能
    console.log(`I am ${this.name}. Thank you creator`)
  }

  intro()
  {
    console.log("I am Robot")
  }
}