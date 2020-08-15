import { Injectable } from '@angular/core';
import { Board } from 'src/app/models/board.model';
import { Column } from 'src/app/models/column.model';

@Injectable({
  providedIn: 'root'
})
export class TodoServiceService {

  constructor() {
    this.init();
  }

  // tslint:disable-next-line:typedef
  update(data) {
    const items = {...this.fetch()};
    items.columns[0].tasks =  [ ...[data], ...items.columns[0].tasks]
    localStorage.setItem('todo', JSON.stringify(items));
  }

  // tslint:disable-next-line:typedef
  fetch() {

    return JSON.parse(localStorage.getItem('todo'));

  }

  // tslint:disable-next-line:typedef
  refresh(data: Board) {
    localStorage.setItem('todo', JSON.stringify(data));
  }

  // tslint:disable-next-line:typedef
  init() {
    if (localStorage.getItem('todo')) {
      return;
    }
    localStorage.setItem('todo', JSON.stringify(
      new Board('Test Board', [
        new Column('Pending', [
        ]),
        new Column('In Process', [
        ]),
        new Column('Completed', [
        ]),
      ])
    ));
  }
}
