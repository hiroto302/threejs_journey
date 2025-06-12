precision mediump float;

// vertex shader から受け取る側の例
varying float vRandom;

//NOTE: color の r・g・b の値を vec3 として扱う
uniform vec3 uColor;

void main()
{
    // (r, g, b, alpha)
    //Title: 「平面を凹凸化」
    //vertexShader で決定した, vRandom を適用することで、凹んでいるところ箇所の色とを区別するような表現もできる！
    // gl_FragColor = vec4(vRandom, vRandom * 0.5, 1.0, 1.0);

    gl_FragColor = vec4(uColor, 1.0);
}