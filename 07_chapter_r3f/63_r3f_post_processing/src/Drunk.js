import { forwardRef } from "react"
import DrunkEffect from "./DrunkEffect"

/* WARNING: forwardRef について
Reactのバージョン19からは、forwardRefを使う代わりに、propsパラメータで直接refを取得できるようになった。
Drunk.jsでは、forwardRefを使わないバージョンに戻し、代わりにprops.refを使用することも可能。

*/

export default function Drunk(props)
{
    const effect = new DrunkEffect(props)
    return <primitive ref={ props.ref } object={effect} />
}