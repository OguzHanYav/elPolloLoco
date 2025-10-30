class CollectableObjectBottle extends MovableObject {
    collectedBottleSound = new Audio(`audio/collectBottle.wav`);
  constructor(x, y) {
    super();
    this.loadImage(`img/6_salsa_bottle/1_salsa_bottle_on_ground.png`);
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 70;
    this.offset = { top: 0, bottom: 0, left: 0, right: 0 };

  }
}

class CollectableObjectCoin extends MovableObject {
    collectedCoinSound = new Audio(`audio/collecCoins.wav`);
  constructor(x, y) {
    super();
    this.loadImage(`img/8_coin/coin_2.png`);
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 90;
    this.offset = { top: 0, bottom: 0, left: 0, right: 0 };
  }
}
