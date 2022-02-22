import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'folder/Inbox',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'folder',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule)
  },
  {
    path: 'trips',
    loadChildren: () => import('./trips/trips.module').then( m => m.TripsPageModule)
  },
  {
    path: 'payroll',
    loadChildren: () => import('./payroll/payroll.module').then( m => m.PayrollPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./support/support.module').then( m => m.SupportPageModule)
  },
  {
    path: 'trip-detail',
    loadChildren: () => import('./trip-detail/trip-detail.module').then( m => m.TripDetailPageModule)
  },
  {
    path: 'confirm-delivery',
    loadChildren: () => import('./confirm-delivery/confirm-delivery.module').then( m => m.ConfirmDeliveryPageModule)
  },
  {
    path: 'picked-up',
    loadChildren: () => import('./picked-up/picked-up.module').then( m => m.PickedUpPageModule)
  },
  {
    path: 'trip-status',
    loadChildren: () => import('./trip-status/trip-status.module').then( m => m.TripStatusPageModule)
  },
  {
    path: 'payroll-details',
    loadChildren: () => import('./payroll-details/payroll-details.module').then( m => m.PayrollDetailsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'document-details',
    loadChildren: () => import('./document-details/document-details.module').then( m => m.DocumentDetailsPageModule)
  },
  {
    path: 'logout',
    loadChildren: () => import('./_model/logout/logout.module').then( m => m.LogoutPageModule)
  },
  {
    path: 'notification-message',
    loadChildren: () => import('./_model/notification-message/notification-message.module').then( m => m.NotificationMessagePageModule)
  },
  {
    path: 'dashboard-inner',
    loadChildren: () => import('./dashboard-inner/dashboard-inner.module').then( m => m.DashboardInnerPageModule)
  },
  {
    path: 'picked-up-inner',
    loadChildren: () => import('./picked-up-inner/picked-up-inner.module').then( m => m.PickedUpInnerPageModule)
  },
  {
    path: 'payroll-popover',
    loadChildren: () => import('./_popover/payroll-sort/payroll-popover.module').then( m => m.PayrollPopoverPageModule)
  },
  {
    path: 'days-sort',
    loadChildren: () => import('./_popover/days-sort/days-sort.module').then( m => m.DaysSortPageModule)
  },
  {
    path: 'language',
    loadChildren: () => import('./_popover/language/language.module').then( m => m.LanguagePageModule)
  },
  {
    path: 'side-menu',
    loadChildren: () => import('./side-menu/side-menu.module').then( m => m.SideMenuPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
