'use strict';

/**
 * 
 * @param {Object} noteAreaData クリックされたnoteAreaの情報
 * @returns {Object} 結果エリアに表示される情報
 */
export default function handleScaleMode(noteAreaData) {
  const componentsList = [];
  const noteAreaIndex = noteAreaData.index;
  const withKeySignature = ['F' ,'C', 'G', 'D', 'A', 'E', 'B'];

  // スケールの主音から始まる構成音の配列を作成
  let components = createComponents(noteAreaData);

  // 調号を付ける
  if (noteAreaIndex == 0) {
    componentsList.push(components);
  }
  if (1 <= noteAreaIndex && noteAreaIndex <= 6) {
    const withSharp = withKeySignature.slice(0, noteAreaIndex);
    componentsList.push(components.map(c => {
      if (withSharp.includes(c.name)) {
        c.name = c.name + "♯";
      }
      return c;
    }));
  }
  // noteAreaIndexが6の場合はシャープとフラットの2種類の表記がある
  if (noteAreaIndex == 6) {
    noteAreaData.noteName = components[1].name;
    components = createComponents(noteAreaData);
  }
  if (6 <= noteAreaIndex && noteAreaIndex <= 11) {
    const withFlat = withKeySignature.slice().reverse().slice(0, 12 - noteAreaIndex);
    componentsList.push(components.map(c => {
      if (withFlat.includes(c.name)) {
        c.name = c.name + '♭';
      }
      return c;
    }));
  }

  // スケールの名前を付ける
  const scaleNameList = [];
  if (noteAreaData.scale === 'major') {
    componentsList.forEach(componentList => scaleNameList.push(componentList[0].name));
  } else if (noteAreaData.scale = 'minor') {
    componentsList.forEach(componentList => scaleNameList.push(componentList[0].name + 'm'));
  }

  return {
    mode: 'スケール',
    nameList: scaleNameList,
    componentsList: componentsList
  }
}

function createComponents(noteAreaData) {
  const alphabetical = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  // 五度圏上で各音のインデックスがスケールの中心音のインデックスからいくつ離れているかを表すリスト
  const indexDiffMajor = [0, 11, 1, 11, 1, 0, 2]; 
  const indexDiffMinor = [0, 2, 0, 11, 1, 11, 1];

  // スケールの主音から始まる並びに変更
  const i = alphabetical.indexOf(noteAreaData.noteName[0]);
  const sorted = alphabetical.slice(i, alphabetical.length).concat(alphabetical.slice(0, i));
  const components = sorted.map((noteName, i) => {
    let component;
    if (noteAreaData.scale === 'major') {
      component = { name: noteName, noteAreaIndex: (noteAreaData.index + indexDiffMajor[i]) % 12 };
      if (i === 0 || i === 3 || i === 4) { // メジャーコードのルートのとき
        component.scale = 'major';
      } else { // マイナーコードのルートのとき
        component.scale = 'minor';
      }
      return component;
    } else {
      component = { name: noteName, noteAreaIndex: (noteAreaData.index + indexDiffMinor[i]) % 12 };
      if (i === 2 || i === 5 || i === 6) { // メジャーコードのルートのとき
        component.scale = 'major';
      } else { // マイナーコードのルートのとき
        component.scale = 'minor';
      }
    }
    return component;
  });
  return components;
}