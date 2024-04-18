import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { CookieService } from '../../cookie.service';

import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  acceptCookie = false;
  constructor(
    private accountService: AccountService,
    private titleService: Title,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().subscribe();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateTitle();
      }
    });
    let cookiePopup = document.getElementById('cookiePopup')!;
    cookiePopup.style.display = 'block';
    let acceptButton = document.getElementById('acceptButton')!;
    acceptButton.addEventListener('click', () => {
      sessionStorage.setItem('acceptedCookie', 'true');
      cookiePopup.style.display = 'none';
    });
    const accepted = sessionStorage.getItem('acceptedCookie');
    if (accepted === 'true') {
      cookiePopup.style.display = 'none';
      this.changeDetectorRef.detectChanges();
    } else {
      cookiePopup.style.display = 'block';
    }
  }

  private getPageTitle(routeSnapshot: ActivatedRouteSnapshot): string {
    const title: string = routeSnapshot.data['pageTitle'] ?? '';
    if (routeSnapshot.firstChild) {
      return this.getPageTitle(routeSnapshot.firstChild) || title;
    }
    return title;
  }

  private updateTitle(): void {
    let pageTitle = this.getPageTitle(this.router.routerState.snapshot.root);
    if (!pageTitle) {
      pageTitle = 'Teamproject';
    }
    this.titleService.setTitle(pageTitle);
  }
}
