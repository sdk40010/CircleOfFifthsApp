'use strict';

import 'bootstrap';
import * as PIXI from 'pixi.js'
import React from 'react';
import ReactDOM from 'react-dom';
import ResultArea from './ResultArea';
import handleScaleMode from './scaleMode';
import handleDim7Mode from './dim7Mode';
import { CircleOfFifths } from './CircleOfFifths.js';

function mount() {
  const circleOfFifths = new CircleOfFifths('スケール',
    new Map([
      ['スケール', handleScaleMode],
      ['dim7', handleDim7Mode]
    ])
  );
  ReactDOM.render(
    <ResultArea circleOfFifths = {circleOfFifths} />,
    document.getElementById('result-container')
  );
  circleOfFifths.init();

  const color = {
    main: 0xE0E0E0,
    light: 0xF5F5F5,
    black: 0x333333,
    white: 0xFFFFFF
  };

  // 結果エリアの構成音にマウスオーバー/マウスアウトしたときの処理
  $('#result-container .component-wrapper').on('mouseover', '.component', (e) => {
    const noteAreaIndex = e.currentTarget.dataset.noteAreaIndex;
    const scale = e.currentTarget.dataset.scale;
    circleOfFifths.setNoteAreaColor(noteAreaIndex, scale, color.main);
  });
  $('#result-container .component-wrapper').on('mouseout', '.component', (e) => {
    const noteAreaIndex = e.currentTarget.dataset.noteAreaIndex;
    const scale = e.currentTarget.dataset.scale;
    circleOfFifths.setNoteAreaColor(noteAreaIndex, scale, color.white);
  });
}
mount();


// const appObj = {
//   canvasWidth: 500,
//   canvasHeihgt: 500,
//   margin: 5,
//   ringWidth: 70,
//   color: {
//     main: 0xE0E0E0,
//     light: 0xF5F5F5,
//     black: 0x333333
//   },
//   fontSize: 20,
//   noteList: {
//     'major': ['C', 'G', 'D', 'A', 'E', 'B', 'F♯ G♭', 'D♭','A♭', 'E♭', 'B♭', 'F'],
//     'minor': ['A', 'E', 'B', 'F♯', 'C♯', 'G♯', 'D♯ E♭', 'B♭', 'F', 'C', 'G', 'D'],
//     'enharmonic': // 異名同音
//       [['C', 'B♯', 'D𝄫'], ['G', 'F𝄪', 'A𝄫'], ['D', 'C𝄪', 'E𝄫'], ['A', 'G𝄪', 'B𝄫'], ['E', 'D𝄪', 'F♭'], ['B', 'A𝄪', 'C♭'],
//        ['F♯', 'E𝄪', 'G♭'], ['D♭', 'B𝄪', 'C♯'], ['A♭', 'G♯'], ['E♭', 'D♯', 'F𝄫'], ['B♭', 'A♯', 'C𝄫'], ['F', 'E♯', 'G𝄫']]
//   },
//   intervalList: { // ルート音からの度数
//     'seventh': [1, 3, 5, 7]
//   },
//   vertexIndexList: {
//     // 五度圏上でコードの構成音を結ぶと現れる図形の頂点(noteArea)のインデックス(ルート音はCで固定)
//     'dim7': [0, 9, 6, 3]
//   },
//   objList: {
//     'majorRingNoteArea': [],
//     'others': []
//   },
//   mode: 'スケール',
//   eventListenerContainer: new Map([
//     ['noteAreaClicked', []]
//   ]) 
// }

// function init() {
//   // 五度圏の表示サイズを決定
//   const circleOfFifths = document.getElementById('circle-of-fifths');
//   if (circleOfFifths.clientWidth < 500) {
//     appObj.canvasWidth = appObj.canvasHeihgt = circleOfFifths.clientWidth;
//     appObj.fontSize = 15;
//   }
//   appObj.app = new PIXI.Application({
//     width: appObj.canvasWidth,
//     height: appObj.canvasHeihgt,
//     backgroundColor: 0xFFFFFF,
//     antialias: true,
//     autoDensity: true
//   });
//   circleOfFifths.appendChild(appObj.app.view);

//   const appWidth = appObj.app.view.width;
//   const appHeight = appObj.app.view.height;
//   const radius1 = appWidth / 2 - appObj.margin;
//   const radius2 = radius1 - appObj.ringWidth;
//   const radius3 = radius2 - appObj.ringWidth;

//   // メージャーとマイナーの環
//   const majorRing = drawRing(radius1, radius2, 'major', appObj);
//   const minorRing = drawRing(radius2, radius3, 'minor', appObj);
//   majorRing.children[0].children.forEach(c => {
//     appObj.objList['majorRingNoteArea'].push(c);
//   });
//   appObj.objList['others'].push(minorRing);

//   // 環の枠線
//   const outline1 = new PIXI.Graphics();
//   outline1.lineStyle(2, appObj.color.main)
//           .drawCircle(appWidth / 2, appHeight / 2, radius1)
//           .drawCircle(appWidth / 2, appHeight / 2, radius2);
//   majorRing.addChild(outline1);
//   const outline2 = new PIXI.Graphics();
//   outline2.lineStyle(2, appObj.color.main)
//           .drawCircle(appWidth / 2, appHeight / 2, radius3);
//   minorRing.addChild(outline2);

//   // 五度圏と結果エリアを表示
//   appObj.app.stage.addChild(minorRing, majorRing);
//   ReactDOM.render(
//     <ResultArea
//       eventListenerContainer = {appObj.eventListenerContainer}
//     />,
//     document.getElementById('result-area')
//   );
  
//   // 結果エリアの初期表示を設定
//   onScaleMode({ index: 0, noteName: 'C', scale: 'major'}, appObj);

// }
// init();


// モードの切替
// $('#scale-mode').on('click', function () {
//   $('#navbarCollapse li.nav-item').each((i, e) => $(e).removeClass('active'));
//   $(this).addClass('active');
//   appObj.mode = 'スケール';
//   appObj.objList['majorRingNoteArea'].forEach(obj => obj.destroy());
//   appObj.objList['majorRingNoteArea'] = [];
//   appObj.objList['others'].forEach(obj => obj.destroy());
//   appObj.objList['others'] = [];
//   init();
// });

// $('#dim7-mode').on('click', function () {
//   $('#navbarCollapse li.nav-item').each((i, e) => $(e).removeClass('active'));
//   $(this).addClass('active');
//   appObj.mode = 'dim7';
//   appObj.objList['others'].forEach(obj => obj.destroy());
//   appObj.objList['others'] = [];
//   onDim7Mode({ index: 0, noteName: 'C', scale: 'major'}, appObj);
// });

// $('#substitute-dominant-mode').on('click', function () {
//   $('#navbarCollapse li.nav-item').each((i, e) => $(e).removeClass('active'));
//   $(this).addClass('active');
//   appObj.mode = '裏コード';
// });


