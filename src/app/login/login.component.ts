import { Component, OnInit } from '@angular/core';
import 'rxjs/Rx';
import { Http, HttpModule, Request, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { LoginService } from './login.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Evaluation {
  id: number,
  path: string,
  design: number,
  color: number,
  operability: number,
  preference: number
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  private status: number;
  private body: string;  
  private error;
  private _filesUrl = '/assets/json/sample-json.json';
  private evaluations: Evaluation[];
  EvaluationsForm: FormGroup;

  forms: {
    design?: number,
    color?: number,
    operability?: number,
    preference?: number
  } = {};

  constructor(
    private http: Http,
    private fb: FormBuilder,
    private loginService: LoginService
  ) {
    // var reader = new FileReader();
  };

  ngOnInit() {
  };

  // localStorageにデータを保存
  saveStorage(){
    const formData = {
      forms: null
    };
    formData.forms = this.forms;
    console.log("formData.forms = ", formData.forms);
    localStorage.setItem("data", JSON.stringify(formData.forms));
  }

  // フォームをリセット
  resetForm(){
    this.forms = {};
  }

  // localStorageからデータを取り出す
  getStorage(){
    const jsonItems = localStorage.getItem("data");
    const items = JSON.parse(jsonItems);
    this.forms = items;
    console.log("items = ", items);
  }

  // JSONデータを画面に表示させる
  displayDataUseService(){
    this.loginService.get().map(
      res => {
        this.evaluations = res.json();
        localStorage.setItem("hyoka2", JSON.stringify(res.json()));
        console.log("res.json() = ", res.json());
        console.log("this.evaluations = ", this.evaluations);
      }
    ).toPromise();
  }

  displayData(){
    this.http.get(this._filesUrl).subscribe(
      res => {
        this.evaluations = res.json();
        this.status = res.status;
        this.error = "";
        localStorage.setItem("hyoka1", JSON.stringify(res.json()));
        console.log("res.json() = ", res.json());
      },
      error => {
        this.error = error.text().substr(287, 100);
        this.status = error.status;
        this.evaluations = [];
      },
    );
  }

  // test1() {
  //   var jsontext = '{"firstname":"Jesper","surname":"Aaberg","phone":["555-0100","555-0120"]}';
  //   var contact = JSON.parse(jsontext);
  //   document.write(contact.surname + ", " + contact.firstname);
  //   document.write(contact.phone[1]);
  // };

  // fileApiTest1() {
  //   var inputFile = document.getElementById('file');

  //   function fileChange(ev) {
  //     var target = ev.target;
  //     var files = target.files;

  //     console.log(files);
  //   }

  //   inputFile.addEventListener('change', fileChange, false);
  // };

  // fileApiTest2() {
  //   var inputFile = document.getElementById('file');

  //   function fileChange(ev) {
  //     var target = ev.target;
  //     var file = target.files[0];
  //     var type = file.type; // MIMEタイプ
  //     var size = file.size; // ファイル容量（byte）
  //     var limit = 1000000; // byte, 10KB

  //     // MIMEタイプの判定
  //     if (type !== 'image/jpeg') {
  //       alert('選択できるファイルは10KB以下のJPEG画像だけです。');
  //       // inputFile.value = '';
  //       return;
  //     }

  //     // サイズの判定
  //     if (limit < size) {
  //       alert('10KBを超えています。10KB以下のファイルを選択してください。');
  //       // inputFile.value = '';
  //     }
  //   }

  //   inputFile.addEventListener('change', fileChange, false);
  // }

  // fileApiTest3() {
  //   var inputFile = document.getElementById('file');
  //   var reader = new FileReader();

  //   function fileChange(ev) {
  //     var target = ev.target;
  //     var file = target.files[0];
  //     var type = file.type;
  //     var size = file.size;

  //     // if ( type !== 'image/jpeg' ) {
  //     //   alert('選択できるファイルはJPEG画像だけです。');
  //     //   // inputFile.value = '';
  //     //   return;
  //     // }

  //     reader.readAsDataURL(file);
  //   }

  //   function fileLoad() {
  //     console.log(reader.result);
  //   }

  //   inputFile.addEventListener('change', fileChange, false);
  //   reader.addEventListener('load', fileLoad, false);
  // }

}
