'use strict';

function onScaleMode(noteAreaData, appObj) {
  const componentList = [];
  const noteAreaIndex = noteAreaData.index;
  const alphabetical = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const withKeySignature = ['F' ,'C', 'G', 'D', 'A', 'E', 'B'];

  // スケールの主音から始まる並びに変更
  const i = alphabetical.indexOf(noteAreaData.noteName[0]);
  const sorted = alphabetical.slice(i, alphabetical.length).concat(alphabetical.slice(0, i));
  const component = sorted.map((v, i) => ({ name: v, noteAreaIndex: (i + noteAreaIndex) % 12 })); 

  // 調号を付ける
  if (noteAreaIndex == 0) {
    componentList.push(component);
  }
  // noteAreaIndexが6の場合はシャープとフラットの2種類の表記がある
  if (1 <= noteAreaIndex && noteAreaIndex <= 6) {
    const withSharp = withKeySignature.slice(0, noteAreaIndex);
    componentList.push(component.map(c => {
      if (withSharp.includes(c.name)) {
        c.name = c.name + "♯";
      }
      return c;
    }));
  } 
  if (noteAreaIndex == 6) {
    component.push(component.shift());
  }
  if (6 <= noteAreaIndex && noteAreaIndex <= 11) {
    const withFlat = withKeySignature.slice().reverse().slice(0, 12 - noteAreaIndex);
    componentList.push(component.map(c => {
      if (withFlat.includes(c.name)) {
        c.name = c.name + '♭';
      }
      return c;
    }));
  }

  // スケールの名前を付ける
  const scaleNameList = [];
  if (noteAreaData.scale === 'major') {
    componentList.forEach(componentList => scaleNameList.push(componentList[0].name));
  } else if (noteAreaData.scale = 'minor') {
    componentList.forEach(componentList => scaleNameList.push(componentList[0].name + 'm'));
  }

  // 結果エリアに表示
  appObj.eventListenerContainer.get('noteAreaClicked').forEach(listener => {
    listener({
      mode: appObj.mode,
      nameList: scaleNameList,
      componentList: componentList
    });
  });
}

export default onScaleMode;