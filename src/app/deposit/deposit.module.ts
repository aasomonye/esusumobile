import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DepositPage } from './deposit.page';
import { ComponentModule } from '../components/component.module';

const routes: Routes = [
  {
    path: '',
    component: DepositPage
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
  declarations: [DepositPage]
})
export class DepositPageModule {}
