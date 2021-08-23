import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions'
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  getPromotions(): Promise<Promotion[]> {
    return of(PROMOTIONS).pipe(delay(2000)).toPromise();
}

  getPromotion(id: string): Promise<Promotion> {
    return of(PROMOTIONS.filter((Promotion) => (Promotion.id === id))[0]).pipe(delay(2000)).toPromise();
}

  getFeaturedPromotion(): Promise<Promotion> {
    return of(PROMOTIONS.filter((Promotion) => Promotion.featured)[0]).pipe(delay(2000)).toPromise();
}

  constructor() { }
}
