import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Board } from 'src/app/models/board.model';
// import { Column } from 'src/app/models/column.model';

import { TodoServiceService } from "src/app/todo-service.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  form: any = {
    title: '',
    description: '',
    priority: 'high',
    date: new Date()
  };

  constructor(
    private todoService: TodoServiceService
  ) { }

  board: Board;
  updating: any = {
    i: '',
    j: ''
  };

  // tslint:disable-next-line:typedef
  get completedTask() {
    const totatlTask =  this.board.columns.reduce((total, data) => {
      total = total + data.tasks.length || 0;
      return total;
    }, 0);
    return 100 - Math.floor(((totatlTask - this.board.columns[2].tasks.length) / totatlTask) * 100);
  }

  // tslint:disable-next-line:typedef
  get boardData() {
    return this.board.columns.filter(a => {
      return a.tasks.sort((b, c) => {
        return new Date(c.date).getTime() - new Date(b.date).getTime();
      });
    });
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.board = this.todoService.fetch();
  }

  // tslint:disable-next-line:typedef
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.todoService.refresh(this.board);
  }

  // tslint:disable-next-line:typedef
  createTask() {
    if (this.updating.i !== '') {
      this.board.columns[this.updating.i].tasks[this.updating.j] = {
        ...this.form
      };
      this.updating = {
        i: '',
        j: ''
      };
      this.todoService.refresh(this.board);
    } else {
      this.form = {
        ...this.form,
        // tslint:disable-next-line:new-parens
        date: new Date
      };
      this.todoService.update(this.form);
    }

    this.form = {
      title: '',
      description: '',
      priority: 'high',
      date: new Date()
    };
    this.board = this.todoService.fetch();
  }

  // tslint:disable-next-line:typedef
  delete(i, j) {
    delete this.board.columns[i].tasks[j];
    this.board.columns[i].tasks = this.board.columns[i].tasks.filter(a => !!a);
    this.todoService.refresh(this.board);
  }

  // tslint:disable-next-line:typedef
  edit(i, j) {
    this.updating = {
      i,
      j
    };
    this.form = this.board.columns[i].tasks[j];
    document.getElementById('modal-add').click();
  }

}

