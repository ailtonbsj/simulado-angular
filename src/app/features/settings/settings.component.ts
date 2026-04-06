import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="settings-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Configurações</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="setting-item">
            <span>Modo Escuro</span>
            <button mat-icon-button (click)="themeService.toggleDarkMode()">
              <mat-icon>{{ themeService.darkMode() ? 'toggle_on' : 'toggle_off' }}</mat-icon>
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .settings-container {
      display: flex;
      justify-content: center;
      padding-top: 2rem;
    }
    mat-card {
      width: 100%;
      max-width: 400px;
    }
    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
    }
    mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
    }
  `
})
export class SettingsComponent {
  themeService = inject(ThemeService);
}
