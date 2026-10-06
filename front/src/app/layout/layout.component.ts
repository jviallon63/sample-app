import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { environment } from '../../environments/environment';

const darkClassName = 'dark-mode';
const themeStorageKey = 'theme';

@Component({
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule
  ]
})
export class LayoutComponent {
  private readonly document = inject(DOCUMENT);

  title = 'MyApplication';
  year = new Date().getFullYear();
  version = environment.version;
  darkMode = localStorage.getItem(themeStorageKey) === 'dark';

  constructor() {
    this.applyTheme();
  }

  /**
   * Toggle theme
   * Light or dark
   */
  setTheme(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem(themeStorageKey, this.darkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    this.document.documentElement.classList.toggle(darkClassName, this.darkMode);
  }
}
