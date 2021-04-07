'use strict';

import * as PIXI from 'pixi.js';
import { CircleOfFifths } from './CircleOfFifths.js';
import { getRadian } from './util.js';

export default function handleDim7Mode(noteAreaData, circleOfFifths) {
  const cf = circleOfFifths;
  cf.destroy(['minorRing']);

  const componentList = [];
  const noteAreaIndex = noteAreaData.index;
  const alphabetical = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const rootIndex = alphabetical.indexOf(noteAreaData.noteName[0]);
  const vertexIndexList = CircleOfFifths.vertexIndexList['dim7'].map(vi => (vi + noteAreaIndex) % 12);
  
  function addToComponentList(rootIndex) {
    // 調号を付ける前のコード構成音リストを作成
    const component = CircleOfFifths.intervalList['seventh'].map(interval => {
      const index = (rootIndex + (interval - 1)) % 7;
      return { name: alphabetical[index] };
    });

    // 調号を付ける
    vertexIndexList.forEach((vi, i) => {
      const withKeySignature =　CircleOfFifths.noteNameList['enharmonic'][vi].find(note => note.includes(component[i].name));
      component.splice(i, 1, { name: withKeySignature, noteAreaIndex: vi });
    });
    componentList.push(component);
  }

  addToComponentList(rootIndex);
  // 調号付きの音がルートになる場合は２種類の表記があるので、もう１つ構成音リストを作る
  if (noteAreaIndex == 6) {
    addToComponentList(rootIndex + 1);
  } else if (7 <= noteAreaIndex && noteAreaIndex <= 10) {
    addToComponentList((rootIndex + 7) % 7);
  }

  // コード構成音を結ぶと現れる図形を描画
  cf.objList['others'].forEach(o => o.destroy()); // 前に描画した図形を削除
  cf.objList['others'] = [];

  const path = [];
  const chordPolygon = new PIXI.Graphics();
  const innerRadius = cf.app.view.width / 2 - cf.margin - cf.ringWidth;
  vertexIndexList.forEach(vi => {
    const x = cf.app.view.width / 2 + Math.cos(getRadian(-90 + (30 * vi))) * innerRadius;
    const y = cf.app.view.height / 2 + Math.sin(getRadian(-90 + (30 * vi))) * innerRadius;
    path.push(x, y);
    chordPolygon.lineStyle(0);
    chordPolygon.beginFill(cf.color.main);
    chordPolygon.drawCircle(x, y, 5);
    chordPolygon.endFill();
  });
  chordPolygon.lineStyle(3, cf.color.main);
  chordPolygon.beginFill(cf.color.light, 0.25);
  chordPolygon.drawPolygon(path);
  cf.objList['others'].push(chordPolygon);
  cf.app.stage.addChild(chordPolygon);

  // コード名を付ける
  const chordNameList = componentList.map(components => components[0].name + 'dim7');

  // 結果エリアに表示
  // appObj.eventListenerContainer.get('noteAreaClicked').forEach(listener => {
  //   listener({
  //     mode: appObj.mode,
  //     nameList: chordNameList,
  //     componentList: componentList
  //   });
  // });

  return {
    mode: "dim7",
    nameList: chordNameList,
    componentList: componentList
  };
}