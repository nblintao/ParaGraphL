#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D m;
varying vec2 vTextureCoord;
void main()
{
  float xDist, yDist, dist, repulsiveF, attractiveF, node_j_id, d, gf, limitedDist;
  int i, j = 0;
  float dx = 0.0, dy = 0.0;
  vec4 node_i, node_j;
  float value = 0.0;
  i = int(vTextureCoord.s);

  node_i = texture2D(m, vec2(i, 1));





  for (; j < ` + this.nodesCount.toString() + `; j++) {
    if (i != j) {
      node_j = texture2D(m, vec2(j, 1));

      xDist = node_i.r - node_j.r;
      yDist = node_i.g - node_j.g;
      dist = sqrt(xDist * xDist + yDist * yDist) + 0.01;

      if (dist > 0.0) {
        repulsiveF = ` + this.k_2.toString() + ` / dist;
        dx += xDist / dist * repulsiveF;
        dy += yDist / dist * repulsiveF;
      }
    }
  }

  int offset = int(node_i.b);
  int length = int(node_i.a);
  int end = offset + length;
  for (int p = 0; p < `+ String(this.maxLen) +`; p++) {
    if (p >= length) break;
    int t = offset + p;
    node_j_id = texture2D(m, vec2(t, 1)).r;
    node_j = texture2D(m, vec2(node_j_id, 1));

    xDist = node_i.r - node_j.r;
    yDist = node_i.g - node_j.g;
    dist = sqrt(xDist * xDist + yDist * yDist) + 0.01;

    attractiveF = dist * dist / ` + this.k + `;

    if (dist > 0.0) {
      dx -= xDist / dist * attractiveF;
      dy -= yDist / dist * attractiveF;
      dx += xDist / dist * attractiveF;
      dy += yDist / dist * attractiveF;
    }
  }

  // Gravity
  d = sqrt(node_i.r * node_i.r + node_i.g * node_i.g);
  gf = ` + String(0.01 * this.k * self.config.gravity) + ` * d;
  dx -= gf * node_i.r / d;
  dy -= gf * node_i.g / d;

  // Speed
  dx *= ` + String(self.config.speed) + `;
  dy *= ` + String(self.config.speed) + `;

  // Apply computed displacement
  xDist = dx;
  yDist = dy;
  dist = sqrt(xDist * xDist + yDist * yDist);

  if (dist > 0.0) {
    limitedDist = min(` + String(this.maxDisplace * self.config.speed) + `, dist);
    gl_FragColor.r = node_i.r + xDist / dist * limitedDist;
    gl_FragColor.g = node_i.g + yDist / dist * limitedDist;
  }
}