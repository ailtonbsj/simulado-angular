import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ThemeService } from '../../core/services/theme.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatCardModule, MatSlideToggleModule,],
  template: `
    <div class="settings-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Configurações</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="setting-item">
            <span>Modo Escuro</span>
            <mat-slide-toggle [(ngModel)]="themeService.darkMode"></mat-slide-toggle>
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
