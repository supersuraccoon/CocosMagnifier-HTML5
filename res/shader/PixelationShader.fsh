// http://www.cocos2d-iphone.org

#ifdef GL_ES
precision lowp float;
#endif

varying vec2 v_texCoord;
uniform sampler2D CC_Texture0;

void main(void) {
	float dx = 15. * (1. / 512.);
	float dy = 10. * (1. / 512.);
	vec2 coord = vec2(dx * floor(v_texCoord.x / dx), dy * floor(v_texCoord.y / dy));
	gl_FragColor = texture2D(CC_Texture0, coord);
}