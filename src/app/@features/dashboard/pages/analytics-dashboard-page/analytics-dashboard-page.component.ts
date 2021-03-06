import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AppointmentDetailsComponent } from '../../components/appointment-details/appointment-details.component';
import { CreateAppointmentComponent } from './../../components/create-appointment/create-appointment.component';
import { DashboardService } from '../../services/dashboard.service';
import { IAppointment } from '../../models/appointments.interfaces';
import { ICHEvent } from './../../models/calender.interfaces';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Utils } from 'src/app/@shared/utils';
import moment from 'moment';

@Component({
  selector: 'app-analytics-dashboard-page',
  templateUrl: './analytics-dashboard-page.component.html',
  styleUrls: ['./analytics-dashboard-page.component.scss'],
})
export class AnalyticsDashboardPageComponent implements OnInit {
  monthStartDate: string = '';
  leftMonths: any[] = [];
  events = [];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dashboardService: DashboardService,
    private modalService: NzModalService
  ) {
    this.setLeftMonths();
  }
  ngOnInit(): void {
    this.updateCalenderFromRoute();
    this.fetchEvents();
  }
  private fetchEvents() {
    this.dashboardService.appointmentStore.get().subscribe((res: any) => {
      this.events = res?.data?.map((x: any) => {
        return {
          title: `${x.firstName} ${x.lastName}`,
          date: moment(`${x?.date} ${x?.time}`).format('YYYY-MM-DD HH:mm:ss'),
          data: x,
        };
      });
    });
  }
  private updateCalenderFromRoute() {
    this.activatedRoute.paramMap.subscribe((res) => {
      const monthSerial: number = Number(res.get('month'));
      this.monthStartDate = moment(monthSerial, 'M').format('YYYY-MM-01');
    });
  }
  private setLeftMonths() {
    this.leftMonths = Utils.genMonthsBetweenStartEndDate(
      moment().format('YYYY-MM-01'),
      moment().endOf('year').format('YYYY-MM-DD')
    );
  }
  onChangeMonth(month: any) {
    this.router.navigate(['/', month?.serial]);
  }
  onReset() {
    this.router.navigate(['/', moment().format('M')]);
  }
  onCreateAppointment() {
    this.modalService.create({
      nzTitle: 'Create Appointment',
      nzContent: CreateAppointmentComponent,
      nzFooter: null,
    });
  }
  onClickEvent(appointment: ICHEvent<IAppointment>) {
    this.modalService.create({
      nzTitle: 'Appointment Details',
      nzContent: AppointmentDetailsComponent,
      nzComponentParams: {
        appointment: appointment?.data,
      },
    });
  }
}
