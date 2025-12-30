import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private itemsSubject = new BehaviorSubject<any[]>([]);
  items$ = this.itemsSubject.asObservable();

  get items() {
    return this.itemsSubject.value;
  }

  add(product: any) {
    this.itemsSubject.next([...this.items, product]);
  }

  remove(index: number) {
    const copy = [...this.items];
    copy.splice(index, 1);
    this.itemsSubject.next(copy);
  }

  clear() {
    this.itemsSubject.next([]);
  }
}
