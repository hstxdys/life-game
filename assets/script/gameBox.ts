import { _decorator, Component, Node, input, Input, EventKeyboard, Vec3, UITransform, EventMouse, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('gameBox')
export class gameBox extends Component {
  private move = { left: false, right: false, top: false, bottom: false };
  private vx: number = 0;
  private vy: number = 0;
  private sf: number = 1;
  @property({ type: Node })
  private cen = null;
  start() {
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    input.on(Input.EventType.MOUSE_WHEEL, this.onWheel, this);
  }
  onWheel(event: EventMouse) {
    const uiTrans = this.cen.getComponent(UITransform)
    this.sf+=event.getScrollY() / 15000
    this.sf = this.sf < 960/uiTrans.width ? 960/uiTrans.width: this.sf
    tween(this.cen).to(0.1, { position: this.setMapPos(this.cen.position.x, this.cen.position.y, this.sf) }, { easing: "linear" }).start();
    tween(this.cen).to(0.1, { scale: new Vec3(this.sf,this.sf, 1) }, { easing: "linear" }).start();
  }
  onKeyDown(event: EventKeyboard) {
    switch (event.keyCode) {
      case 37:
      case 65:
        this.move.left = true
        break;
      case 38:
      case 87:
        this.move.top = true
        break;
      case 39:
      case 68:
        this.move.right = true
        break;
      case 40:
      case 83:
        this.move.bottom = true
        break;
    }
  }

  onKeyUp(event: EventKeyboard) {
    switch (event.keyCode) {
      case 37:
      case 65:
        this.move.left = false
        break;
      case 38:
      case 87:
        this.move.top = false
        break;
      case 39:
      case 68:
        this.move.right = false
        break;
      case 40:
      case 83:
        this.move.bottom = false
        break;
    }
  }
  setMapPos(x: number, y: number,sf: number) {
    const uiTrans = this.cen.getComponent(UITransform)
    let minX = 1400 - uiTrans.width*sf
    let maxy = uiTrans.height*sf - 900
    let rex = x <= minX ? minX : x >= 0 ? 0 : x
    let rey = y <= 0 ? 0 : y > maxy ? maxy : y
    return new Vec3(rex, rey, 0)
  }
  update(dt: number) {
    let tarVx: number = 0, tarVy: number = 0
    this.move.left && (tarVx += -500)
    this.move.right && (tarVx += 500)
    this.move.top && (tarVy += 500)
    this.move.bottom && (tarVy += -500)
    if (tarVx > this.vx) {
      this.vx += 3000 * dt
      if (this.vx > tarVx) this.vx = tarVx
    } else {
      this.vx -= 3000 * dt
      if (this.vx < tarVx) this.vx = tarVx
    }
    if (tarVy > this.vy) {
      this.vy += 3000 * dt
      if (this.vy > tarVy) this.vy = tarVy
    } else {
      this.vy -= 3000 * dt
      if (this.vy < tarVy) this.vy = tarVy
    }
    let x = this.cen.position.x + this.vx * dt
    let y = this.cen.position.y + this.vy * dt
    this.cen.setPosition(this.setMapPos(x, y, this.cen.scale.y))
  }
}

