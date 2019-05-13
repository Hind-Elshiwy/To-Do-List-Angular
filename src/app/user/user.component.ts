import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
@Injectable()
export class UserComponent implements OnInit {
  //private baseurl='http://localhost:8080/api/user/';
  private baseurl='https://mysterious-coast-48236.herokuapp.com/api/user/';
  nUser:User =new User(null,null,null);
  register = false;
  msg:string
  constructor(private http: HttpClient,public router: Router) { }

  signUp(){
    if(this.nUser.email==null || this.nUser.password=="" || this.nUser.name==""){
      this.msg="Please Enter a A valid Data"
      return
    }  
    return this.http.post((this.baseurl + 'signup'),this.nUser).subscribe(
      a=>{
        this.register = false
        this.msg="Account Created Successfully You can Login Now to your account"
      },
      err=>{
        let errMsg = err['message'].split(": ")[1].substr(0,3)
        if (errMsg == "409"){
          console.log("Unauthor")
          this.router.navigate(['user']);
          this.msg = "This mail is already Existed"
        } 
      }
    );
  }

  signIn(){
    return this.http.post((this.baseurl + 'signin'),this.nUser).subscribe(
      a=>{
        if(a.hasOwnProperty('token')){
          console.log("Success")
          localStorage.setItem('token', a['token'])
          localStorage.setItem('name', a['name'])
          this.msg = ""
          this.router.navigate(['toDoList']);
        }
      },
      err => {
        console.log("Failed")
        this.msg = "Wrong Email/ Password"
      }
    )
  }
  ngOnInit() {
  }

}
