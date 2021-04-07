'use strict';

import React from 'react';
import { MDCSelect } from '@material/select';

// 五度圏の結果表示エリア
export default class ResultArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameList: [], // コードもしくはスケールの名前リスト
      componentsList: [] // 構成音リスト
    }
  }

  componentDidMount() {
    const {circleOfFifths, color } = this.props;

    // 五度圏でクリックイベントが発生したときのリスナーを登録
    circleOfFifths.onNoteAreaClick((result) => {
      this.setState(result);
    });

    // 結果エリアの構成音にマウスオーバー・マウスアウトしたときの処理
  $('#result-container .components-list').on('mouseover', '.component', (e) => {
    const noteAreaIndex = e.currentTarget.dataset.noteAreaIndex;
    const scale = e.currentTarget.dataset.scale;
    circleOfFifths.setNoteAreaColor(noteAreaIndex, scale, color.main);
  });
  $('#result-container .components-list').on('mouseout', '.component', (e) => {
    const noteAreaIndex = e.currentTarget.dataset.noteAreaIndex;
    const scale = e.currentTarget.dataset.scale;
    circleOfFifths.setNoteAreaColor(noteAreaIndex, scale, color.white);
  });

  // モードセレクターの設定
  const select = new MDCSelect(document.querySelector('.mdc-select'));
  select.listen('MDCSelect:change', () => {
    // alert(`Selected option at index ${select.selectedIndex} with value "${select.value}"`);
    circleOfFifths.changeMode(select.value);
  });
  }

  render() {
    const nameList = this.state.nameList.map((name, i) => 
      <span className="name" key={i}>{name}</span>
    );

    const componentsList = this.state.componentsList.map((components, i)=> 
        <div className='component-wrapper' key={i}>
          {components.map((c, i) =>
            <span
              className='component'
              key={i}
              data-note-area-index={c.noteAreaIndex}
              data-scale={c.scale}
            >
              {c.name}
            </span>
          )}
        </div> 
    );

    return (
      <div>
        <div className="mode-selector">
          <ModeSelect circleOfFifths={this.props.circleOfFifths}/>
        </div> 
        <div className='name-list'>{nameList}</div>
        <div className='components-list'>{componentsList}</div>
      </div>
    );
  }
}

// モードセレクター
function ModeSelect({circleOfFifths}) {
  return (
    <div className="mdc-select mdc-select--outlined custom-select">
      <div className="mdc-select__anchor" aria-labelledby="outlined-select-label">
        <span className="mdc-select__selected-text"></span>
        <span className="mdc-select__dropdown-icon">
          <svg
              className="mdc-select__dropdown-icon-graphic"
              viewBox="7 10 10 5">
            <polygon
                className="mdc-select__dropdown-icon-inactive"
                stroke="none"
                fillRule="evenodd"
                points="7 10 12 15 17 10">
            </polygon>
            <polygon
                className="mdc-select__dropdown-icon-active"
                stroke="none"
                fillRule="evenodd"
                points="7 15 12 10 17 15">
            </polygon>
          </svg>
        </span>
        <span className="mdc-notched-outline">
          <span className="mdc-notched-outline__leading"></span>
          <span className="mdc-notched-outline__notch">
            <span className="mdc-floating-label">モード選択</span>
          </span>
          <span className="mdc-notched-outline__trailing"></span>
        </span>
      </div>

      <MenuItemList items={circleOfFifths.getModes()} />
    </div>
  );
}

// メニューアイテムリスト
function MenuItemList({items}) {
  const listItemElements = items.map((item, i) => {
    if (i === 0) {
      return(
        <li className="mdc-list-item mdc-list-item--selected custom-list-item" data-value={item} key={i} aria-selected="true">
          <span className="mdc-list-item__ripple"></span>
          <span className="mdc-list-item__text">{item}</span>
        </li>);
    } else {
        return (
          <li className="mdc-list-item custom-list-item" data-value={item} key={i}>
            <span className="mdc-list-item__ripple"></span>
            <span className="mdc-list-item__text">{item}</span>
          </li>
        );
    }
  });

  return (
    <div className="mdc-select__menu mdc-menu mdc-menu-surface">
      <ul className="mdc-list">
        {listItemElements}
      </ul>
    </div>
  );
}