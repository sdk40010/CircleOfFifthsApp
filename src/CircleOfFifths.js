'use strict';

import * as PIXI from 'pixi.js'
import EventEmitter from 'events';
import { getRadian } from './util.js';

export class CircleOfFifths extends EventEmitter {

  /**
   * @param {string} mode 初期のモード
   * @param { Map<string, Function> } modeListeners モード別の処理を保持するMap
   */
  constructor(mode, modeListeners) {
    super();
    this.canvasLength = 500;
    this.margin = 5;
    this.ringWidth = 70;
    this.color = {
      main: 0xE0E0E0,
      light: 0xF5F5F5,
      black: 0x333333,
      white: 0xFFFFFF
    };
    this.fontSize = 20;
    this.noteList = {
      'major': ['C', 'G', 'D', 'A', 'E', 'B', 'F♯ G♭', 'D♭','A♭', 'E♭', 'B♭', 'F'],
      'minor': ['A', 'E', 'B', 'F♯', 'C♯', 'G♯', 'D♯ E♭', 'B♭', 'F', 'C', 'G', 'D']
    };
    this.mode = mode;
    this.modeListeners = modeListeners;
    this.objList = {
      'majorRing': [],
      'minorRing': []
    }
  }

  /**
   * 初期化
   */
  init() {
    // 五度圏の表示サイズを決定
    const container = document.getElementById('circle-of-fifths');
    if (container.clientWidth < this.canvasLength) {
      this.canvasLength = container.clientWidth;
      this.ringWidth = 50;
      this.fontSize = 15;
    }
    this.app = new PIXI.Application({
      width: this.canvasLength,
      height: this.canvasLength,
      backgroundColor: 0xFFFFFF,
      antialias: true,
      autoDensity: true
    });
    container.appendChild(this.app.view);

    const radius1 = this.canvasLength / 2 - this.margin;
    const radius2 = radius1 - this.ringWidth;
    const radius3 = radius2 - this.ringWidth;

    // メージャーとマイナーの環を描画
    const majorRing = this.drawRing(radius1, radius2, 'major');
    const minorRing = this.drawRing(radius2, radius3, 'minor');

    // 環の枠線を描画
    const outline1 = this.drawOutline(radius1);
    const outline2 = this.drawOutline(radius2);
    majorRing.addChild(outline1, outline2);
    const outline3 = this.drawOutline(radius3);
    minorRing.addChild(outline3);

    // モードが変更時に呼び出されるリスナーを登録
    this.onModeChange(() => {
      this.aggreagatedListener({ index: 0, noteName: 'C', scale: 'major'}); // 引数は結果エリアに初期表示を設定するための情報
    });

    // 五度圏と結果エリアを表示
    this.app.stage.addChild(minorRing, majorRing);
    this.setMode(this.mode);
  }

  /**
   * 五度圏の環を描画する
   * @param {number} outerRadius 外側の半径
   * @param {number} innerRadius 内側の半径
   * @param {string} scale 調
   */
  drawRing(outerRadius, innerRadius, scale) {
    const noteList = this.noteList[scale];
    const container = new PIXI.Container();
    const noteAreaContainer = new PIXI.Container();
    container.addChild(noteAreaContainer);

    for (let i = 0; i < 12; i++) {
      const startRad = getRadian(-105 + (30 * i));
      const stopRad = getRadian(-105 + (30 * (i + 1)));
    
      // 各音の領域
      const noteArea = new PIXI.Graphics();
      noteArea.beginFill(this.color.light)
              .arc(this.canvasLength / 2, this.canvasLength / 2, outerRadius, startRad, stopRad)
              .arc(this.canvasLength / 2, this.canvasLength / 2, innerRadius, stopRad, startRad, true)
              .endFill();
    
      noteArea.data = { // クリック時の処理に必要なプロパティーを追加
        index: i,
        noteName: noteList[i],
        scale: scale
      }
      noteArea.interactive = true;
      noteArea.buttonMode = true;
      noteArea
        .on('pointerover', (event) => event.currentTarget.tint = this.color.main)
        .on('pointerout', (event) => event.currentTarget.tint = 0xFFFFFF)
        .on('pointerdown', (event, ) => this.aggreagatedListener(noteArea.data));
      noteAreaContainer.addChild(noteArea);
      if (scale === 'major') {
        this.objList['majorRing'].push(noteArea);
      } else {
        this.objList['minorRing'].push(noteArea);
      }
    
      // 各音の領域の境界線
      const borderline = new PIXI.Graphics();
      borderline.lineStyle(2, this.color.main)
                .moveTo(Math.cos(startRad) * outerRadius, Math.sin(startRad) * outerRadius)
                .lineTo(Math.cos(startRad) * innerRadius, Math.sin(startRad) * innerRadius);
      borderline.position.set(this.canvasLength / 2, this.canvasLength / 2);
      borderline.zIndex = 1; // 領域と重なって見えなくなるのを防ぐ
      container.sortableChildren = true;
      container.addChild(borderline);
    
      // 音名
      const noteName = new PIXI.Text(noteList[i], { fontSize: this.fontSize, fill: this.color.black });
      if (i == 6) {
        noteName.style.wordWrap = true;
        noteName.style.wordWrapWidth = this.fontSize * 2;
      }
      noteName.position.set(
        this.canvasLength / 2 + Math.cos(getRadian(-90 + (30 * i))) * (outerRadius + innerRadius) / 2,
        this.canvasLength / 2 + Math.sin(getRadian(-90 + (30 * i))) * (outerRadius + innerRadius) / 2
      );
      noteName.anchor.set(0.5);
      container.addChild(noteName);
    }
    return container;
  }

  /**
   * 五度圏の枠線を描画する
   * @param {number} radius 枠の半径
   */
  drawOutline(radius) {
    const outline = new PIXI.Graphics();
    outline
      .lineStyle(2, this.color.main)
      .drawCircle(this.canvasLength / 2, this.canvasLength / 2, radius);
    return outline;
  }

  /**
   * 五度圏上で各音の領域がクリックされたときに呼び出されるリスナーを登録する
   * @param {Function}} listener 
   */
  onNoteAreaClick(listener) {
    this.on('noteAreaClick', listener);
  }

  /**
   * モードが変更時に呼び出されるリスナーを登録する
   * @param {Function} listener 
   */
  onModeChange(listener) {
    this.on('modeChange', listener);
  }

  /**
   * モードを変更する
   * @param {string} mode
   */
  setMode(mode) {
    this.mode = mode;
    this.emit('modeChange');
  }

  /**
   * インデックスとスケールによって指定されたnoteAreaの色を変更する
   * @param {number} index 
   * @param {string} scale 
   * @param {string} color 
   */
  setNoteAreaColor(index, scale, color) {
    if (scale === 'major') {
      this.objList['majorRing'][index].tint = color;
    } else {
      this.objList['minorRing'][index].tint = color
    }
  }

  /**
   * モードに応じた処理を行うリスナーと結果エリアに表示するためのリスナーを集約したリスナー関数
   * @param {Object} noteAreaData クリックされたnoteAreaの情報
   */
  aggreagatedListener(noteAreaData) {
    const modeListener = this.modeListeners.get(this.mode);
    const resultData = modeListener(noteAreaData); // 現在のモードに応じた処理を行う
    this.emit('noteAreaClick', resultData); // 結果エリアに表示
  }
}