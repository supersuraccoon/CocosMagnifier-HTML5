// http://www.cocos2d-iphone.org

#ifdef GL_ES
precision lowp float;
#endif

varying vec2 v_texCoord;
uniform sampler2D CC_Texture0;

void main(void) {
  	vec2 cen = vec2(0.5, 0.5) - v_texCoord;
 	vec2 mcen = 0.1 * log(length(cen)) * normalize(cen);
 	gl_FragColor = texture2D(CC_Texture0, v_texCoord + mcen);
}