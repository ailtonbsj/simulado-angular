import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'practice', pathMatch: 'full' },
      {
        path: 'practice',
        loadComponent: () => import('./features/practice/practice.component').then(m => m.PracticeComponent)
      },
      {
        path: 'editor',
        loadComponent: () => import('./features/editor/editor.component').then(m => m.EditorComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  }
];
