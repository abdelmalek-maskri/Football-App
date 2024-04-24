import { Component } from '@angular/core';
import { FontResizeService } from '../navbar/navbar.service';
import { Observable } from 'rxjs';
import { VERSION } from 'app/app.constants';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  version = '';
  account: Account | null = null;
  fontSizeMultiplier: number = 1; // Font size multiplier property

  constructor(private fontResizeService: FontResizeService) {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  ngOnInit(): void {
    this.fontResizeService.fontSizeMultiplier$.subscribe(multiplier => {
      this.fontSizeMultiplier = multiplier;
    });
  }

  // Font size adjustment methods
  getFontSizeKey(): string {
    return `fontSizeMultiplier_${this.account?.login || 'default'}`;
  }

  updateFontSize(): void {
    localStorage.setItem(this.getFontSizeKey(), this.fontSizeMultiplier.toString());
    this.fontResizeService.setFontSizeMultiplier(this.fontSizeMultiplier);
  }
}
