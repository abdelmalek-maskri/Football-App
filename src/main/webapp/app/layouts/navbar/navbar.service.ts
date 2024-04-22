import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FontResizeService {
  private fontSizeMultiplierSource = new BehaviorSubject<number>(1);
  fontSizeMultiplier$ = this.fontSizeMultiplierSource.asObservable();

  constructor() {}

  setFontSizeMultiplier(value: number): void {
    this.fontSizeMultiplierSource.next(value);
  }

  getFontSizeMultiplier(): number {
    return this.fontSizeMultiplierSource.value;
  }
}
