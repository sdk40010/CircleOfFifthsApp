'use strict';

import React from 'react';

export default class ResultArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: '',
      nameList: [], // コードもしくはスケールの名前のリスト
      componentList: [] // 構成音のリスト
    }
    this.listener = (obj) => {
      this.setState(obj);
    }
    this.props.eventListenerContainer.get('noteAreaClicked').push(this.listener);
  }

  render() {
    const componentList = this.state.componentList.map((componentList, i)=> 
        <div className='component-list-item text-center mb-2 d-inline-block' key={i}>
          {componentList.map((c, i) =>
            <span className='component' key={i} data-note-area-index={c.noteAreaIndex}>{c.name}</span>
          )}
        </div> 
    );

    const name = this.state.nameList.join(' / ');

    return (
      <div>
        <h1 className='mode text-center text-muted'>{this.state.mode}</h1>
        <div className='name text-center mb-2'>{name}</div>
        <div className='component-list text-center mb-2'>{componentList}</div>
      </div>
    )
  }
}