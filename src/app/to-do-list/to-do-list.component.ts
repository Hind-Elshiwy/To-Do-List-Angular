import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router} from "@angular/router";
@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})
export class ToDoListComponent implements OnInit {
  items:string[]
  //private baseurl='http://localhost:8080/api/list/';
  private baseurl='https://mysterious-coast-48236.herokuapp.com/api/list/';
  hasList = false;
  check_auth = false;
  msg:string
  token:string
  userName:string
  constructor(private http: HttpClient, public router: Router) { }

  checkToken(){
    if(localStorage.getItem('token') != ""){
      this.token = localStorage.getItem('token')
      this.userName = localStorage.getItem('name')
      this.check_auth = true
    }  
    else{
      console.log("Not Authorized")
      this.router.navigate(['toDoList']);
    } 
  }
  getUserList() {
    return this.http.get(this.baseurl + 'items', {headers: {
      'Content-Type': 'application/json','Authorization': 'bearer '+this.token
    }}).subscribe(res=>{
      console.log(res['list']['items'])
      this.items = res['list']['items']
      this.hasList = true
    },
    err=>{
      let errMsg = err['message'].split(": ")[1].substr(0,3)
      if (errMsg == "401"){
        console.log("Unauthor")
        this.router.navigate(['user']);
        this.msg = "You are not authorized"
      }
      if(errMsg == "404"){
        console.log("Not Found")
      }  
    });
  }

  createList() {
    this.msg=null;
    return this.http.post(this.baseurl + 'createList', {}, {headers: {
      'Content-Type': 'application/json','Authorization': 'bearer '+this.token
    }}).subscribe(res=>{
      this.hasList = true
    },
    err=>{
      let errMsg = err['message'].split(": ")[1].substr(0,3)
      if (errMsg == "409"){
        console.log("List Found")
        this.msg = "You already have a List "
      }
    });
  }

  addItem(item) {
    this.msg=null;
    if(item == "" || item == null){
      this.msg = "Please Enter Valid Inputs"
      return
    }
    return this.http.put(this.baseurl + 'addItem', {item:item}, {headers: {
      'Content-Type': 'application/json','Authorization': 'bearer '+this.token
    }}).subscribe(res=>{
      this.items = res['list']['items']
    },
    err=>{
      this.msg = "Unexpeted error We wll try to fix that errro soon"
    });
  }

  deleteItem(itemId) {
    this.msg=null;
    return this.http.put(this.baseurl + 'deleteItem', {_id:itemId}, {headers: {
      'Content-Type': 'application/json','Authorization': 'bearer '+this.token
    }}).subscribe(res=>{
      console.log(res)
      console.log("success")
      this.items = res['list']['items']
    },
    err=>{
      this.msg = "SomeThing Went Wrong"
    });
  }

  logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    this.router.navigate(['user']);
  }

  ngOnInit() {
    this.checkToken()
    this.getUserList()
  }

}
