import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private itemsSubject = new BehaviorSubject<any[]>([]);
  items$ = this.itemsSubject.asObservable();

  add(product: any) {
    this.itemsSubject.next([...this.itemsSubject.value, product]);
  }

  remove(index: number) {
    const items = [...this.itemsSubject.value];
    items.splice(index, 1);
    this.itemsSubject.next(items);
  }
}
