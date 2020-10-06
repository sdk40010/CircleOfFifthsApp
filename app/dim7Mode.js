'use strict';

import * as PIXI from 'pixi.js'; 

function onDim7Mode(noteAreaData, appObj) {
  const componentList = [];
  const noteAreaIndex = noteAreaData.index;
  const alphabetical = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const rootIndex = alphabetical.indexOf(noteAreaData.noteName[0]);
  const vertexIndexList = appObj.vertexIndexList['dim7'].map(vi => (vi + noteAreaIndex) % 12);
  
  function addToComponentList(rootIndex) {
    // 調号を付ける前のコード構成音リストを作成
    // component( value: {name: 構成音の音名,　noteAreaIndex: 構成音に対応するnoteAreaのインデックス} )
    const component = appObj.intervalList['seventh'].map(interval => {
      const index = (rootIndex + (interval - 1)) % 7;
      return { name: alphabetical[index] }; // ここではnoteAreaIndexプロパティは追加しない
    });

    // 調号を付ける
    vertexIndexList.forEach((vi, i) => {
      const withKeySignature =　appObj.noteList['enharmonic'][vi].find(note => note.includes(component[i].name));
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
  appObj.objList['others'].forEach(o => o.destroy()); // 前に描画した図形を削除
  appObj.objList['others'] = [];

  const path = [];
  const chordPolygon = new PIXI.Graphics();
  const innerRadius = appObj.app.view.width / 2 - appObj.margin - appObj.ringWidth;
  vertexIndexList.forEach(vi => {
    const x = appObj.app.view.width / 2 + Math.cos(getRadian(-90 + (30 * vi))) * innerRadius;
    const y = appObj.app.view.height / 2 + Math.sin(getRadian(-90 + (30 * vi))) * innerRadius;
    path.push(x, y);
    chordPolygon.lineStyle(0);
    chordPolygon.beginFill(appObj.color.main);
    chordPolygon.drawCircle(x, y, 5);
    chordPolygon.endFill();
  });
  chordPolygon.lineStyle(3, appObj.color.main);
  chordPolygon.beginFill(appObj.color.light, 0.25);
  chordPolygon.drawPolygon(path);
  appObj.objList['others'].push(chordPolygon);
  appObj.app.stage.addChild(chordPolygon);

  // コード名を付ける
  const chordNameList = componentList.map(components => components[0].name + 'dim7');

  // 結果エリアに表示
  appObj.eventListenerContainer.get('noteAreaClicked').forEach(listener => {
    listener({
      mode: appObj.mode,
      nameList: chordNameList,
      componentList: componentList
    });
  });
  
}

export default onDim7Mode;