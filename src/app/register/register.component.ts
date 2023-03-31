import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Validators } from '@angular/forms';
import liff from '@line/liff';

type UnPromise<T> = T extends Promise<infer X> ? X : T;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  nameline: String;
  urlimg: String;

  //Chcek numberOnly
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  constructor(private http: HttpClient, private router: Router) {}
  os: ReturnType<typeof liff.getOS>;
  profile: UnPromise<ReturnType<typeof liff.getProfile>>;
  ngOnInit() {
    liff.init({ liffId: '1660756547-zRWjKKmP' }).then(() => {
      this.os = liff.getOS();
      if (liff.isLoggedIn()) {
        liff
          .getProfile()
          .then((profile) => {
            this.profile = profile;
            this.nameline = this.profile.displayName;
            this.urlimg = this.profile.pictureUrl;
            console.log(this.profile.userId);
          })
          .catch(console.error);
      } else {
        liff.login();
      }
    });
  }

  hn: String;
  userprofileForm = new FormGroup({
    pid: new FormControl('', Validators.required),
    tel: new FormControl('', Validators.required),
  });

  onTest(event?: MouseEvent) {
    this.router.navigate(['home']);
  }
  onSubmit(event?: MouseEvent) {
    console.log(this.userprofileForm.value);
    let url =
      'https://app1.pranangklao.go.th/DevLineAPI/ProductRESTService.svc/MobileUpdateLineRegister';
    this.http
      .post(url, {
        param: {
          ContextKey: 'ReU',
          LineUserID: this.profile.userId,
          IDCard: this.userprofileForm.controls['pid'].value,
          TelephoneNo: this.userprofileForm.controls['tel'].value,
        },
      })
      .toPromise()
      .then((data: any) => {
        // console.log(data);
        this.hn = data.HN;
        if (this.hn != '') {
          this.router.navigate(['appointment'], {
            queryParams: {
              HN: this.hn,
            },
          });
          //alert('TEST');
        } else {
          this.router.navigate(['notfound']);
        }
      });
  }
  onlogout(event?: MouseEvent) {
    liff.logout();
    this.router.navigate(['home']);
  }
}
