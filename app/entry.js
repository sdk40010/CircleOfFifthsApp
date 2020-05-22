import * as PIXI from 'pixi.js'

const appObj = {
  canvasWidth: 500,
  canvasHeihgt: 500,
  margin: 40,
  ringWidth: 70,
  color: {
    main: 0xE0E0E0,
    light: 0xF5F5F5,
    black: 0x333333
  },
  majorNotes: ['C', 'G', 'D', 'A', 'E', 'B', 'F♯ / G♭', 'D♭','A♭', 'E♭', 'B♭', 'F'],
  minorNotes: ['A', 'E', 'B', 'F♯', 'C♯', 'G♯', 'E♭/D♯', 'B♭', 'F', 'C', 'G', 'D']
}

appObj.app = new PIXI.Application({
  width: appObj.canvasWidth,
  height: appObj.canvasHeihgt,
  backgroundColor: 0xFFFFFF,
  antialias: true,
});
$('#circle-of-fifths').append(appObj.app.view);

function init() {
  const appWidth = appObj.app.view.width;
  const appHeight = appObj.app.view.height;
  const radius1 = appWidth / 2 - appObj.margin + (appObj.ringWidth / 2);
  const radius2 = radius1 - appObj.ringWidth;
  const radius3 = radius2 - appObj.ringWidth;

  // メージャーとマイナーの環
  const majorRing = drawRing(radius1, radius2, appObj.majorNotes);
  const minorRing = drawRing(radius2, radius3, appObj.minorNotes);

  // 環の枠線
  const outline1 = new PIXI.Graphics();
  outline1.lineStyle(2, appObj.color.main);
  outline1.drawCircle(appWidth / 2, appHeight / 2, radius1);
  outline1.drawCircle(appWidth / 2, appHeight / 2, radius2);
  majorRing.addChild(outline1);

  const outline2 = new PIXI.Graphics();
  outline2.lineStyle(2, appObj.color.main);
  outline2.drawCircle(appWidth / 2, appHeight / 2, radius3);
  minorRing.addChild(outline2);

  appObj.app.stage.addChild(minorRing, majorRing);

}
init();

function getRadian(deg) {
  return deg * (Math.PI / 180);
}

function drawRing(outerRadius, innerRadius, noteList) {
  const appWidth = appObj.app.view.width;
  const appHeight = appObj.app.view.height;
  const container = new PIXI.Container();

  for (let i = 0; i < 12; i++) {
    const startRad = getRadian(-105 + (30 * i));
    const stopRad = getRadian(-105 + (30 * (i + 1)));

    // 各音の領域
    const noteArea = new PIXI.Graphics();
    noteArea.lineStyle(appObj.ringWidth, appObj.color.light, 1, 0); // 線の幅は指定した半径の内側に入る
    noteArea.arc(appWidth / 2, appHeight / 2, outerRadius, startRad, stopRad);
    noteArea.interactive = true;
    noteArea.buttonMode = true;
    noteArea.hitArea =  new PIXI.Polygon(
      appWidth / 2 + Math.cos(startRad) * outerRadius, appHeight / 2 + Math.sin(startRad) * outerRadius,
      appWidth / 2 + Math.cos(startRad) * innerRadius, appHeight / 2 + Math.sin(startRad) * innerRadius,
      appWidth / 2 + Math.cos(stopRad) * innerRadius, appHeight / 2 + Math.sin(stopRad) * innerRadius,
      appWidth / 2 + Math.cos(stopRad) * outerRadius, appHeight / 2 + Math.sin(stopRad) * outerRadius,
    );
    noteArea
      .on('pointerover', function (event) { this.tint = appObj.color.main; })
      .on('pointerout', function (event) { this.tint = 0xFFFFFF; });
    container.addChild(noteArea);

    // 各音の領域の境界線
    const borderline = new PIXI.Graphics();
    borderline.lineStyle(2, appObj.color.main);
    borderline.moveTo(Math.cos(startRad) * outerRadius, Math.sin(startRad) * outerRadius);
    borderline.lineTo(Math.cos(startRad) * innerRadius, Math.sin(startRad) * innerRadius);
    borderline.position.set(appWidth / 2, appHeight / 2);
    borderline.zIndex = 1; // 領域と重なって見えなくなるのを防ぐ
    container.sortableChildren = true;
    container.addChild(borderline);

    // 音名
    const noteName = new PIXI.Text(noteList[i], { fontSize: 20, fill: appObj.color.black });
    noteName.position.set(
      appWidth / 2 + Math.cos(getRadian(-90 + (30 * i))) * (outerRadius + innerRadius) / 2,
      appHeight / 2 + Math.sin(getRadian(-90 + (30 * i))) * (outerRadius + innerRadius) / 2
    );
    noteName.anchor.set(0.5);
    container.addChild(noteName);
  }
  return container;
}