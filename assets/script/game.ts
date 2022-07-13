import { _decorator, Component, Node, Prefab, instantiate, Vec3, Color, Sprite, UITransform, Label } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('game')
export class game extends Component {
  private w: number = 160;
  private h: number = 90;
  private v: number = 100;
  private suspend: boolean = false;
  private deVivalRatio: number = 60
  private cellArr: any[] = [];
  private history: any[] = [];
  @property({ type: Prefab })
  private cell = null;
  @property({ type: Node })
  private ztBtn = null;
  start() {
    this.generateCell()
    this.generateLift()
    this.schedule(function() {
      if(!this.suspend) {
        this.rule();
      }
    }, 1/this.v);
  }
  // 生成网格
  generateCell() {
    const uiTrans = this.node.getComponent(UITransform)
    uiTrans.width = this.w*10
    uiTrans.height = this.h*10
    let sf = Math.max(1400/uiTrans.width, 900/uiTrans.height)
    this.node.scale =  new Vec3(sf, sf, 1)
    for (let i = 0; i < this.h; i++) {
      const arr = []
      for (let j = 0; j < this.w; j++) {
        const cell = instantiate(this.cell)
        const ts = cell.getComponent('cell')
        ts.x = i
        ts.y = j
        cell.setPosition(new Vec3(j * 10, -i * 10, 0))
        cell.on('lift-change', (x: number, y: number) => {
          let ce = this.cellArr[x][y]
          this.liftChange(!ce.lift, x, y)
        })
        arr.push({ count: 0, lift: false, cell: cell, x: i, y: j })
        this.node.addChild(cell)
      }
      this.cellArr.push(arr)
    }
  }
  // 按比例随机生成生命
  generateLift() {
    const deNum = this.w*this.h*this.deVivalRatio/100
    let lpArr = []
    this.cellArr.map(item => {lpArr = [...lpArr, ...item]})
    this.shuffle(lpArr)
    const deVival = lpArr.splice(0, deNum)
    deVival.map(item => { this.liftChange(true, item.x, item.y) })
  }
  // 获取比例
  deVivalRatioChange(customEventData) {
    this.deVivalRatio = parseInt(customEventData) 
  }
  // 暂停/开始 生命变化
  openSuoebd() {
    this.suspend = !this.suspend
    this.ztBtn.children[0].getComponent(Label).string = this.suspend ? '开始' : '暂停'
  }
  // 清除所有生命
  clear() {
    let die = []
    this.cellArr.map(item => { die = [...die, ...item.filter((c: any) => c.lift)] })
    die.map(item => {this.liftChange(false, item.x, item.y)})
  }
  // 下一生命状态
  rule() {
    // 保存当前状态
    let his = []
    this.cellArr.map(item => { his = [...his, ...item.filter((c: any) => c.lift)] })
    this.history.unshift(his)
    if(this.history.length > 100) {
      this.history.pop()
    }
    // 按规则生成下一状态
    let revive = []
    this.cellArr.map(item => { revive = [...revive, ...item.filter((c: any) => (!c.lift && (c.count == 3)))] })
    let die = []
    this.cellArr.map(item => { die = [...die, ...item.filter((c: any) => (c.lift && ((c.count < 2) || (c.count > 3))))] })
    revive.map(item => { this.liftChange(true, item.x, item.y) })
    die.map(item => {this.liftChange(false, item.x, item.y)})
  }
  //  下一生命状态
  nextStep() {
    this.rule();
  }
  // 上一生命状态
  upStep() {
    let upArr = this.history.shift()
    this.clear()
    upArr.map(item => { this.liftChange(true, item.x, item.y) })
  }
  // 打乱数组
  shuffle(arr: any) {
    let l = arr.length
    let index: number, temp: any
    while(l>0) {
      index = Math.floor(Math.random()*l)
      temp = arr[l-1]
      arr[l-1] = arr[index]
      arr[index] = temp
      l--
    }
  }
  /**
   * 生命状态改变
   * @param lift 改变后生命状态
   * @param x 目标x位置
   * @param y 目标y位置
   */
  liftChange(lift: boolean, x: number, y: number) {
    let ce = this.cellArr[x][y]
    ce.lift = lift
    const cen = ce.cell.children[0].getComponent(Sprite)
    const color = ce.lift ? 0 : 255
    cen.color = new Color(color, color, color)
    let count = lift ? 1 : -1
    let xt = this.cellArr[x - 1] ? x - 1 : this.cellArr.length - 1
    let xb = this.cellArr[x + 1] ? x + 1 : 0
    let yl = this.cellArr[x][y - 1] ? y - 1 : this.cellArr[x].length - 1
    let yr = this.cellArr[x][y + 1] ? y + 1 : 0
    this.cellArr[xt][yl].count += count
    this.cellArr[xt][y].count += count
    this.cellArr[xt][yr].count += count
    this.cellArr[x][yl].count += count
    this.cellArr[x][yr].count += count
    this.cellArr[xb][yl].count += count
    this.cellArr[xb][y].count += count
    this.cellArr[xb][yr].count += count
  }
  update(d: number) {
    // if(!this.suspend) {
    //   this.rule();
    // }
  }
}

