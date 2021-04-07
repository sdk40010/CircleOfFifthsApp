'use strict';

import * as PIXI from 'pixi.js'
import EventEmitter from 'events';
import { getRadian } from './util.js';

export class CircleOfFifths extends EventEmitter {

  /**
   * @param {number} canvasLength キャンバスの幅
   * @param {number} margin 五度圏のキャンバスのマージン
   * @param {number} ringWidth 環の幅
   * @param {number} fontSize 音名のフォントサイズ
   * @param {string} mode 初期のモード
   * @param {Map<string, Function>} modeListeners モード別のクリックリスナーを保持するMap
   */

  constructor({
    canvasLength = 500,
    margin = 5,
    ringWidth = 70,
    fontSize = 20,
    color,
    mode,
    modeListeners
  }) {
    super();
    this._canvasLength = canvasLength;
    this._margin = margin;
    this._ringWidth = ringWidth;
    this._fontSize = fontSize;
    this._color = color;
    this._mode = mode;
    this._modeListeners = modeListeners;

    // PIXIオブジェクトを管理するためのオブジェクト
    this.objList = {
      'majorRing': [],
      'minorRing': [],
      'others': []
    }
  }

  // 五度圏で使用する音名
  static noteNameList = {
    'major': ['C', 'G', 'D', 'A', 'E', 'B', 'F♯ G♭', 'D♭','A♭', 'E♭', 'B♭', 'F'],
    'minor': ['A', 'E', 'B', 'F♯', 'C♯', 'G♯', 'D♯ E♭', 'B♭', 'F', 'C', 'G', 'D'],
    'enharmonic': [ // 異名同音
      ['C', 'B♯', 'D𝄫'],
      ['G', 'F𝄪', 'A𝄫'],
      ['D', 'C𝄪', 'E𝄫'],
      ['A', 'G𝄪', 'B𝄫'],
      ['E', 'D𝄪', 'F♭'],
      ['B', 'A𝄪', 'C♭'],
      ['F♯', 'E𝄪', 'G♭'],
      ['D♭', 'B𝄪', 'C♯'],
      ['A♭', 'G♯'],
      ['E♭', 'D♯', 'F𝄫'],
      ['B♭', 'A♯', 'C𝄫'],
      ['F', 'E♯', 'G𝄫']
    ],
  };
  
  // ルート音からの度数
  static intervalList = {
    'seventh': [1, 3, 5, 7]
  };

  // 五度圏上でコードの構成音を結ぶと現れる図形の頂点(noteArea)のインデックス(ルート音はCで固定)
  static vertexIndexList = {
    'dim7': [0, 9, 6, 3]
  };

  /**
   * 初期化
   */
  init() {
    // 五度圏の表示サイズを決定
    const container = document.getElementById('circle-of-fifths');
    if (container.clientWidth < this._canvasLength) {
      this._canvasLength = container.clientWidth;
      this._ringWidth = 50;
      this._fontSize = 15;
    }
    this.app = new PIXI.Application({
      width: this._canvasLength,
      height: this._canvasLength,
      backgroundColor: 0xFFFFFF,
      antialias: true,
      autoDensity: true
    });
    container.appendChild(this.app.view);

    const radius1 = this._canvasLength / 2 - this._margin;
    const radius2 = radius1 - this._ringWidth;
    const radius3 = radius2 - this._ringWidth;

    // メージャーとマイナーの環を描画
    const majorRing = this.drawRing(radius1, radius2, 'major');
    const minorRing = this.drawRing(radius2, radius3, 'minor');

    // 環の枠線を描画
    const outline1 = this.drawOutline(radius1);
    const outline2 = this.drawOutline(radius2);
    majorRing.addChild(outline1, outline2);
    const outline3 = this.drawOutline(radius3);
    minorRing.addChild(outline3);

    // モード変更時に呼び出されるリスナーを登録
    this.onModeChange(() => {
      this.aggreagatedListener({ index: 0, noteName: 'C', scale: 'major'}); // 引数は結果エリアに初期表示を設定するための情報
    });

    // 五度圏と結果エリアを表示
    this.app.stage.addChild(minorRing, majorRing);
    this.changeMode(this._mode);
  }

  /**
   * 五度圏の環を描画する
   * @param {number} outerRadius 外側の半径
   * @param {number} innerRadius 内側の半径
   * @param {string} scale 調
   */
  drawRing(outerRadius, innerRadius, scale) {
    const noteNameList = CircleOfFifths.noteNameList[scale];
    const container = new PIXI.Container();
    const noteAreaContainer = new PIXI.Container();
    container.addChild(noteAreaContainer);

    for (let i = 0; i < 12; i++) {
      const startRad = getRadian(-105 + (30 * i));
      const stopRad = getRadian(-105 + (30 * (i + 1)));
    
      // 各音の領域
      const noteArea = new PIXI.Graphics();
      noteArea
        .beginFill(this._color.light)
        .arc(this._canvasLength / 2, this._canvasLength / 2, outerRadius, startRad, stopRad)
        .arc(this._canvasLength / 2, this._canvasLength / 2, innerRadius, stopRad, startRad, true)
        .endFill();
    
      noteArea.data = { // クリック時の処理に必要なプロパティーを追加
        index: i,
        noteName: noteNameList[i],
        scale: scale
      }
      noteArea.interactive = true;
      noteArea.buttonMode = true;
      noteArea
        .on('pointerover', (event) => event.currentTarget.tint = this._color.main)
        .on('pointerout', (event) => event.currentTarget.tint = 0xFFFFFF)
        .on('pointerdown', () => this.aggreagatedListener(noteArea.data));
      
      noteAreaContainer.addChild(noteArea);
      if (scale === 'major') {
        this.objList['majorRing'].push(noteArea);
      } else {
        this.objList['minorRing'].push(noteArea);
      }
    
      // 各音の領域の境界線
      const borderline = new PIXI.Graphics();
      borderline
        .lineStyle(2, this._color.main)
        .moveTo(Math.cos(startRad) * outerRadius, Math.sin(startRad) * outerRadius)
        .lineTo(Math.cos(startRad) * innerRadius, Math.sin(startRad) * innerRadius);
      borderline.position.set(this._canvasLength / 2, this._canvasLength / 2);
      borderline.zIndex = 1; // 領域と重なって見えなくなるのを防ぐ
      container.sortableChildren = true;
      container.addChild(borderline);
    
      // 音名
      const noteName = new PIXI.Text(noteNameList[i], { fontSize: this._fontSize, fill: this._color.black });
      if (i == 6) {
        noteName.style.wordWrap = true;
        noteName.style.wordWrapWidth = this._fontSize * 2;
      }
      noteName.position.set(
        this._canvasLength / 2 + Math.cos(getRadian(-90 + (30 * i))) * (outerRadius + innerRadius) / 2,
        this._canvasLength / 2 + Math.sin(getRadian(-90 + (30 * i))) * (outerRadius + innerRadius) / 2
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
      .lineStyle(2, this._color.main)
      .drawCircle(this._canvasLength / 2, this._canvasLength / 2, radius);
    return outline;
  }

  /**
   * 五度圏上で各音の領域がクリックされたときに呼び出されるリスナーを登録する
   * @param {Function} listener 
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
   * @param {string} newMode
   */
  changeMode(newMode) {
    this._mode = newMode;
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
   * モードに応じた処理を行うリスナーと結果エリアに表示するためのリスナーを集約したリスナー
   * @param {Object} noteAreaData クリックされたnoteAreaの情報
   */
  aggreagatedListener(noteAreaData) {
    const modeListener = this._modeListeners.get(this._mode);
    const result = modeListener(noteAreaData, this); // 現在のモードに応じた処理を行う
    this.emit('noteAreaClick', result); // 結果エリアに表示
  }

  /**
   * objListから指定されたプロパティーのPIXIオブジェクトを削除する
   * 
   * @param {array} propNames プロパティー名の配列
   */
  destroy(propNames) {
    propNames.forEach(propName => {
      this.objList[propName].forEach(obj => obj.destroy());
      this.objList[propName] = [];
    });
  }

  /**
   * 対応しているモードを取得する
   * 
   * @returns {array} 対応しているモードの配列
   */
  getModes() {
    return Array.from(this._modeListeners.keys());
  }
}