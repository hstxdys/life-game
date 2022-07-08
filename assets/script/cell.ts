import { _decorator, Component, Node, Color, Prefab, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('cell')
export class cell extends Component {
  private x: number = 0
  private y: number = 0
  start() {
    this.node.on(Node.EventType.MOUSE_ENTER, this.mouseMove, this)
    this.node.on(Node.EventType.MOUSE_LEAVE, this.mouseLeave, this)
    this.node.on(Node.EventType.MOUSE_DOWN, this.mouseDown, this)
  }
  mouseMove() {
    const border = this.node.getComponent(Sprite)
    border.color = new Color(0, 0, 0)
  }
  mouseLeave() {
    const border = this.node.getComponent(Sprite)
    border.color = new Color(255, 255, 255)
  }
  mouseDown() {
    this.node.emit('lift-change', this.x, this.y)
  }
  update(deltaTime: number) {

  }
}

