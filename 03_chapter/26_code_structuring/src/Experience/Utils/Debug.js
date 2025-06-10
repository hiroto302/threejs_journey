import GUI from 'lil-gui'

export default class Debug
{
  constructor()
  {
    //NOTE: 実行中のURLの最後尾に 「#debug」を追加した時のみ、DebugUIが表示するためのフラグ
    this.active = window.location.hash == '#debug'
    // console.log(window.location.hash)
    // console.log(this.active)

    if (this.active)
    {
      this.ui = new GUI({
        title: 'Debug GUI'
      })
    }
  }
}