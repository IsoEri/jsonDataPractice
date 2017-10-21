import { Component, OnInit } from '@angular/core';
import 'rxjs/Rx';
import { Http, HttpModule, Request, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  constructor() {};
  ngOnInit() {};
}
