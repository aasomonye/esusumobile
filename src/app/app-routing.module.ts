import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'signin', loadChildren: './signin/signin.module#SigninPageModule' },
  { path: 'resetpassword', loadChildren: './resetpassword/resetpassword.module#ResetpasswordPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'completeregistration', loadChildren: './completeregistration/completeregistration.module#CompleteregistrationPageModule' },
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardPageModule' },
  { path: 'savings', loadChildren: './savings/savings.module#SavingsPageModule' },
  { path: 'addsavings', loadChildren: './addsavings/addsavings.module#AddsavingsPageModule' },
  { path: 'savingsinfo', loadChildren: './savingsinfo/savingsinfo.module#SavingsinfoPageModule' },
  { path: 'savingsform', loadChildren: './savingsform/savingsform.module#SavingsformPageModule' },
  { path: 'aboutplan', loadChildren: './aboutplan/aboutplan.module#AboutplanPageModule' },
  { path: 'helpdesk', loadChildren: './helpdesk/helpdesk.module#HelpdeskPageModule' },
  { path: 'aboutus', loadChildren: './aboutus/aboutus.module#AboutusPageModule' },
  { path: 'activatedevice', loadChildren: './activatedevice/activatedevice.module#ActivatedevicePageModule' },
  { path: 'contactus', loadChildren: './contactus/contactus.module#ContactusPageModule' },
  { path: 'feedback', loadChildren: './feedback/feedback.module#FeedbackPageModule' },
  { path: 'pinreset', loadChildren: './pinreset/pinreset.module#PinresetPageModule' },
  { path: 'activatenow', loadChildren: './activatenow/activatenow.module#ActivatenowPageModule' },
  { path: 'withdraw', loadChildren: './withdraw/withdraw.module#WithdrawPageModule' },
  { path: 'verification', loadChildren: './verification/verification.module#VerificationPageModule' },
  { path: 'deposit', loadChildren: './deposit/deposit.module#DepositPageModule' },
  { path: 'deposit-voucher', loadChildren: './deposit-voucher/deposit-voucher.module#DepositVoucherPageModule' },
  { path: 'deposit-card', loadChildren: './deposit-card/deposit-card.module#DepositCardPageModule' },
  { path: 'agent', loadChildren: './agent/agent.module#AgentPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'report', loadChildren: './report/report.module#ReportPageModule' },
  { path: 'kycform', loadChildren: './kycform/kycform.module#KycformPageModule' },
  { path: 'bankform', loadChildren: './bankform/bankform.module#BankformPageModule' },
  { path: 'agent-liquidate', loadChildren: './agent-liquidate/agent-liquidate.module#AgentLiquidatePageModule' },
  { path: 'generate-vouchers', loadChildren: './generate-vouchers/generate-vouchers.module#GenerateVouchersPageModule' },
  { path: 'vouchers', loadChildren: './vouchers/vouchers.module#VouchersPageModule' },
  { path: 'agent-report', loadChildren: './agent-report/agent-report.module#AgentReportPageModule' },
  { path: 'view-vouchers', loadChildren: './view-vouchers/view-vouchers.module#ViewVouchersPageModule' },
  { path: 'view-all-plans', loadChildren: './view-all-plans/view-all-plans.module#ViewAllPlansPageModule' },
  { path: 'my-bank-account', loadChildren: './my-bank-account/my-bank-account.module#MyBankAccountPageModule' },
  { path: 'profile-image', loadChildren: './profile-image/profile-image.module#ProfileImagePageModule' },
  { path: 'account-summary', loadChildren: './account-summary/account-summary.module#AccountSummaryPageModule' },
  { path: 'fund-savings', loadChildren: './fund-savings/fund-savings.module#FundSavingsPageModule' },
  { path: 'phoneform', loadChildren: './phoneform/phoneform.module#PhoneformPageModule' },
  { path: 'withdraw-voucher', loadChildren: './withdraw-voucher/withdraw-voucher.module#WithdrawVoucherPageModule' },
  { path: 'withdraw-bank', loadChildren: './withdraw-bank/withdraw-bank.module#WithdrawBankPageModule' },
  { path: 'view-report', loadChildren: './view-report/view-report.module#ViewReportPageModule' },
  { path: 'view-withdraw', loadChildren: './view-withdraw/view-withdraw.module#ViewWithdrawPageModule' },
  { path: 'view-saving-report', loadChildren: './view-saving-report/view-saving-report.module#ViewSavingReportPageModule' },
  { path: 'quicksave', loadChildren: './quicksave/quicksave.module#QuicksavePageModule' },
  { path: 'changepassword', loadChildren: './changepassword/changepassword.module#ChangepasswordPageModule' },
  { path: 'agent-transfer', loadChildren: './agent-transfer/agent-transfer.module#AgentTransferPageModule' },
  { path: 'account', loadChildren: './account/account.module#AccountPageModule' },
  { path: 'inbox', loadChildren: './inbox/inbox.module#InboxPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
