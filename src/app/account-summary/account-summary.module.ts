import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import {ComponentModule} from '../components/component.module';

import { AccountSummaryPage } from './account-summary.page';

const routes: Routes = [
  {
    path: '',
    component: AccountSummaryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AccountSummaryPage]
})
export class AccountSummaryPageModule {}
