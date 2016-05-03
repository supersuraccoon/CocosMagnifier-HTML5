// MainScene.js
var MagnifierSprite = cc.Sprite.extend({
	init:function(scaleFactor, areaSize) {
		if (this.initWithTexture(this.getClippedTexture(cc.p(0, 0), areaSize))) {
			this.drawBoarder = null;
			this.setScaleY(-1);
			this.areaSize = areaSize;
			this.targetSize = cc.size(areaSize.width / scaleFactor, areaSize.height / scaleFactor);
			this.addBoarder();
			return true;
		}
		return false;
	},
	hide:function() {
		this.setVisible(false);
		this.drawBoarder.setVisible(false);
	},
	show:function() {
		this.setVisible(true);
		this.drawBoarder.setVisible(true);
	},
	magnify:function(position) {
		this.show();
		this.setVisible(false);
		this.setTexture(this.getClippedTexture(position, this.targetSize));
		this.setPosition(position);
		this.setVisible(true);
	},
	getClippedTexture:function(position, size) {
  		var render = cc.RenderTexture.create(cc.Director.getInstance().getWinSize().width, cc.Director.getInstance().getWinSize().height);
        render.begin();
        cc.Director.getInstance().getRunningScene().visit();
		var pixelValues = new Uint8Array(4 * size.width * size.height);
		gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
		gl.readPixels(position.x - size.width / 2, position.y - size.height / 2, size.width, size.height, gl.RGBA, gl.UNSIGNED_BYTE, pixelValues);
		render.end();

		var texture = new cc.Texture2D();
		if (texture) {
			texture.initWithData(pixelValues, cc.TEXTURE_2D_PIXEL_FORMAT_RGBA8888, size.width, size.height, cc.size(size.width, size.height));
		}
		return texture;
	},
	addBoarder:function() {
		if (this.drawBoarder == null) {
			this.drawBoarder = cc.DrawNode.create();
			this.drawBoarder.drawPoly([cc.p(0, 0), cc.p(this.areaSize.width, 0), cc.p(this.areaSize.width, this.areaSize.height), cc.p(0, this.areaSize.height)], cc.c4f(0, 0, 0, 0), 2, cc.c4b(0, 0, 0, 1));	
			this.addChild(this.drawBoarder);
		}
	}
});
MagnifierSprite.create = function(scaleFactor, areaSize) {
	var magnifierSprite = new MagnifierSprite();
	if (magnifierSprite && magnifierSprite.init(scaleFactor, areaSize)) {
		return magnifierSprite;
	}
	return null;
}

var MainSceneLayer = cc.Layer.extend({
	init:function() {
		this._super();
		this.winSize = cc.Director.getInstance().getWinSize();

		var bg = cc.Sprite.create(png_bg);
		bg.setPosition(this.winSize.width * 0.5, this.winSize.height / 2);
		this.addChild(bg);

		// normal
		var sprite1 = cc.Sprite.create("res/building2.png");
		sprite1.setPosition(this.winSize.width * 0.5, this.winSize.height * 0.5);
		this.addChild(sprite1);

		this.setTouchMode(cc.TOUCH_ONE_BY_ONE);
		this.setTouchEnabled(true);

		this.magSprite = MagnifierSprite.create(2, cc.size(150, 150));
		this.addChild(this.magSprite, 999);

		return true;
	},
	onTouchBegan:function(touch, event) {
        var pos = touch.getLocation();
        this.magSprite.magnify(pos);        
        return true;
    },
    onTouchMoved:function(touch, event) {
        var pos = touch.getLocation();
        this.magSprite.magnify(pos);
    },
    onTouchEnded:function(touch, event) {
    	this.magSprite.hide();
    }
});

var MainScene = cc.Scene.extend({
	onEnter:function() {
		this._super();
		// add layer
		var mainSceneLayer = new MainSceneLayer();
		mainSceneLayer.init();
		this.addChild(mainSceneLayer);
	}
});