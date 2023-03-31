import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
})
export class AppointmentComponent implements OnInit {
  data: any;
  datanotfound: Boolean = true;
  post: any;
  nameline: String;
  urlimg: String;
  hn: String;
  //dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  allUsers: any = [];
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}
 
  ngOnInit() {
    this.route.queryParams.subscribe((param) => {
      this.hn = param.HN;
    });

    var today = new Date();
    var startday = today.getDate();
    var startmonth = today.getMonth() + 1; //January is 0!
    var startyear = today.getFullYear();
    var stringday;
    var stringmonth;
    var stringstartdate;

    if (startday < 10) {
      stringday = '0' + startday;
    } else {
      stringday = startday;
    }

    if (startmonth < 10) {
      stringmonth = '0' + startmonth;
    } else {
      stringmonth = startmonth;
    }

    stringstartdate =
      startyear + '-' + stringmonth + '-' + stringday + 'T00:00:00';

    //add 90 days
    var newdate = new Date();
    newdate.setDate(newdate.getDate() + 90);

    var endday = newdate.getDate();
    var endmonth = newdate.getMonth() + 1; //January is 0!
    var endyear = newdate.getFullYear();

    var stringendday;
    var stringendmonth;
    var stringenddate;

    if (endday < 10) {
      stringendday = '0' + endday;
    } else {
      stringendday = endday;
    }

    if (endmonth < 10) {
      stringendmonth = '0' + endmonth;
    } else {
      stringendmonth = endmonth;
    }

    stringenddate =
      endyear + '-' + stringendmonth + '-' + stringendday + 'T00:00:00';

    //console.log(newdate); //2023-06-15T00:00:00

    let url =
      'https://app1.pranangklao.go.th/DevLineAPI/ProductRESTService.svc/EnquirePatientAppointment';
    this.http
      .post(url, {
        param: {
          EnglishView: false,
          HN: this.hn,
          AppointDateTimeFrom: stringstartdate,
          AppointDateTimeTo: stringenddate,
          ContextKey: 'ReU',
        },
      })
      .subscribe((data) => {
        //this.data;
        console.log(data);
        //this.data = response.data;
        this.datanotfound = data['DataNotFound'];
        //console.log(this.datanotfound);
        this.data = data['ListResultDetail'];
        //console.log(this.data);
      });
  }

}
