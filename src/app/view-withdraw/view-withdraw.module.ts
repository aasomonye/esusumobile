import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewWithdrawPage } from './view-withdraw.page';

import { ComponentModule } from '../components/component.module';

const routes: Routes = [
  {
    path: '',
    component: ViewWithdrawPage
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
  declarations: [ViewWithdrawPage]
})
export class ViewWithdrawPageModule {}
