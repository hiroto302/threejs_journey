// uniform sampler2D uParticles;

void main()
{
  // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 particle = texture(uParticles, uv);
  particle.y += 0.01;

  // gl_FragColor = vec4(uv, 1.0, 1.0);
  gl_FragColor = particle;
}