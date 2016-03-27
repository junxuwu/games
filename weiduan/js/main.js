
var game = new Phaser.Game(240, 400, Phaser.CANVAS, 'game');

game.States = {};

game.States.boot = function() {
  this.preload = function() {
    if(typeof(GAME) !== "undefined") {
      this.load.baseURL = GAME + "/";
    }
    if(!game.device.desktop){
      this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
      this.scale.forcePortrait = true;
      this.scale.refresh();
    }
    game.load.image('loading', 'assets/preloader.gif');
  };
  this.create = function() {
    game.state.start('preload');
  };
};

game.States.preload = function() {
  this.preload = function() {
    var preloadSprite = game.add.sprite(10, game.height/2, 'loading');
    game.load.setPreloadSprite(preloadSprite);
    game.load.image('whitejian', 'assets/whitejian.png');
    game.load.image('greenjian', 'assets/greenjian.png');
    game.load.image('liuqiangdong', 'assets/liuqiangdong.jpg');
    game.load.image('kehu', 'assets/kehu.jpg');
  };
  this.create = function() {
    game.state.start('main');
  };
};

game.States.main = function() {
  this.create = function() {
    // 背景
    game.stage.backgroundColor = '#EBEBEB';
    // 文字样式
    this.textStyle = {
      font: "14px Arial",
      fill: '#000000',
      wordWrap: true,
      wordWrapWidth: game.width - 80
    };
    this.myStyle = {
      font: "14px Arial",
      fill: '#ff0000',
      wordWrap: true,
      wordWrapWidth: game.width - 80
    };
    // 间隙
    this.ellipse = 30;
    // 数组
    this.words = [];
    this.sens = [{
      name: 'liuqiangdong',
      str: '你好，你是做UI设计的 吗？',
      me: false
    }, {
      name: 'kehu',
      str: '你好，是的，请问你有 什么需求？',
      me: true
    }, {
      name: 'liuqiangdong',
      str: '我们公司想做个App，要 高端大气上档次，我们的 预算比较高，1000左右',
      me: false
    }, {
      name: 'kehu',
      str: '你刚才问什么？',
      me: true
    }, {
      name: 'liuqiangdong',
      str: '我们公司想做个App，要 高端大气上档次，预算 1000左右',
      me: false
    }, {
      name: 'kehu',
      str: '不是这句，是前面一句',
      me: true
    }, {
      name: 'liuqiangdong',
      str: '你好，你是做UI设计的 吗？',
      me: false
    }, {
      name: 'kehu',
      str: '不是',
      me: true
    }, {
      name: 'liuqiangdong',
      str: '。。。',
      me: false
    }];
    var count = -1;
    var $this = this;
    var ran = function() {
      if(count < 0) {
        var ranTime = 0;
      } else {
        var ranTime = Math.ceil(Math.random() * 2 + 2);
      }
      game.time.events.add(Phaser.Timer.SECOND * ranTime, function() {
        count++;
        if(count >= $this.sens.length) {
          return;
        }
        $this.say($this.sens[count].name, $this.sens[count].str, $this.sens[count].me);
        ran();
      }, this);
    }
    ran();
  };
  this.say = function(head, text, me) {
    // 虚拟一个text来计算宽高
    var tmp = game.add.text(0, 0, text, this.textStyle);
    tmp.lineSpacing = -3;
    var width = tmp.width;
    var height = tmp.height;
    tmp.kill();
    // 都上移一个高度
    for(var i=0; i<this.words.length; i++) {
      var newpos = this.words[i].pos - height - this.ellipse;
      if(newpos < 0 - this.words[i].height) {
        this.words[i].sprite.kill();
        this.words.splice(0, 1);
        i--;
      } else {
        game.add.tween(this.words[i].sprite).to({y: newpos}, 100, Phaser.Easing.Linear.None, true);
        this.words[i].pos = newpos;
      }
    }
    // 创建一个sprite
    if(me) {
      var sprite = game.add.sprite(game.width - 40, game.height, head);
    } else {
      var sprite = game.add.sprite(10, game.height, head);
    }
    // 背景
    var rounded = game.make.graphics(0, 0);
    if(me) {
      rounded.beginFill(0xa0e75a);
      rounded.drawRoundedRect(-width-29, 0, width+17, height+7, 4);
    } else {
      rounded.beginFill(0xffffff);
      rounded.drawRoundedRect(42, 0, width+17, height+7, 4);
    }
    rounded.endFill();
    sprite.addChild(rounded);
    // 尖尖
    if(me) {
      var jian = game.make.sprite(-12, 10, 'greenjian');
    } else {
      var jian = game.make.sprite(37, 10, 'whitejian');
    }
    sprite.addChild(jian);
    // 文本
    if(me) {
      var txt = game.make.text(-width-19, 7, text, this.textStyle);
    } else {
      var txt = game.make.text(52, 7, text, this.textStyle);
    }
    txt.lineSpacing = -3;
    sprite.addChild(txt);
    game.add.tween(sprite).to({y: game.height - height - this.ellipse}, 100, Phaser.Easing.Linear.None, true);
    this.words.push({
      sprite: sprite,
      height: height,
      pos: game.height - height - this.ellipse
    });
  };
};

game.state.add('boot', game.States.boot);
game.state.add('preload', game.States.preload);
game.state.add('main', game.States.main);

game.state.start('boot');
