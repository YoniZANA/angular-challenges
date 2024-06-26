import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { concatMap, tap } from 'rxjs';
import {
  FakeHttpService,
  randStudent,
} from '../../data-access/fake-http.service';
import { StudentStore } from '../../data-access/student.store';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';

@Component({
  selector: 'app-student-card',
  template: `
    <app-card
      [list]="students$ | async"
      customClass="bg-light-green"
      (addItem)="addNewItem()">
      <img src="assets/img/student.webp" width="200px" />
      <ng-template #rowRef let-student>
        <app-list-item
          [id]="student.id"
          [name]="student.firstname"
          (deleteItem)="deleteItem($event)"></app-list-item>
      </ng-template>
    </app-card>
  `,
  standalone: true,
  imports: [CardComponent, ListItemComponent, AsyncPipe],
})
export class StudentCardComponent {
  private store = inject(StudentStore);
  private http = inject(FakeHttpService);
  students$ = this.http.fetchStudents$.pipe(
    tap((students) => this.store.addAll(students)),
    concatMap(() => this.store.students$),
  );

  addNewItem() {
    this.store.addOne(randStudent());
  }

  deleteItem(id: number) {
    this.store.deleteOne(id);
  }
}
