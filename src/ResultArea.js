'use strict';

import React from 'react';

export default class ResultArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: '',
      nameList: [], // コードもしくはスケールの名前リスト
      componentsList: [] // 構成音リスト
    }
    // 五度圏でクリックイベントが発生したときのリスナーを登録
    this.props.circleOfFifths.onNoteAreaClick((resultData) => {
      this.setState(resultData);
    });
  }

  render() {
    const nameList = this.state.nameList.map((name, i) => 
      <span className="name d-inline-block" key={i}>{name}</span>
    );

    const componentsList = this.state.componentsList.map((components, i)=> 
        <div className='component-wrapper text-center mb-2 d-inline-block' key={i}>
          {components.map((c, i) =>
            <span
              className='component'
              key={i}
              data-note-area-index={c.noteAreaIndex}
              data-scale={c.scale}
              >{c.name}</span>
          )}
        </div> 
    );

    const name = this.state.nameList.join(' / ');

    return (
      <div>
        <h1 className='mode text-center text-muted'>{this.state.mode}</h1>
        <div className='name-list text-center mb-2'>{nameList}</div>
        <div className='components-list text-center mb-2'>{componentsList}</div>
      </div>
    )
  }
}