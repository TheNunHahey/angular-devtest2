import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import liff from '@line/liff';
import { HttpClient } from '@angular/common/http';

type UnPromise<T> = T extends Promise<infer X> ? X : T;

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css'],
})
export class NotfoundComponent implements OnInit {
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
            //console.log(this.profile.userId);
          })
          .catch(console.error);
      } else {
        liff.login();
      }
    });
  }

  onTest2(event?: MouseEvent) {
    this.router.navigate(['home']);
  }

  onlogout(event?: MouseEvent) {
    liff.logout();
    this.router.navigate(['home']);
  }
}
