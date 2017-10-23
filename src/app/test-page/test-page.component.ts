import { Component, OnInit } from '@angular/core';
import 'rxjs/Rx';
import { Http, HttpModule, Request, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
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
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.css']
})

export class TestPageComponent implements OnInit {
  private status: number;
  private body: string;
  private error;
  private jsonFilesUrl = '/assets/json/';
  private evaluations: Evaluation[];
  private jsonFiles: string[];
  private selectedJson: string;
  EvaluationsForm: FormGroup;

  forms: {
    selectJson ? : string,
    design ? : number,
    color ? : number,
    operability ? : number,
    preference ? : number
  } = {};

  constructor(
    private http: Http,
    private fb: FormBuilder,
  ) {
    // var reader = new FileReader();
  };

  ngOnInit() {
    this.readdir();
  };

  // ファイル出力
  exportFile() {
    // ダウンロードしたいコンテンツ、MIMEType、ファイル名
    var content = localStorage.getItem("data");
    var mimeType = 'text/plain';
    var name = 'test.txt';

    // BOMは文字化け対策
    var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    var blob = new Blob([bom, content], {
      type: mimeType
    });

    var a = document.createElement('a');
    a.download = name;
    a.target = '_blank';

    if (window.navigator.msSaveBlob) {
      // for IE
      window.navigator.msSaveBlob(blob, name)
      console.log("for IE");
    } else if (window.URL && window.URL.createObjectURL) {
      // for Firefox
      a.href = window.URL.createObjectURL(blob);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  // フォームをリセット
  resetForm() {
    this.forms = {};
  }

  // localStorageにデータを保存
  saveStorage() {
    const formData = {
      forms: null
    };
    formData.forms = this.forms;
    console.log("formData.forms = ", formData.forms);
    localStorage.setItem("data", JSON.stringify(formData.forms));
  }

  // localStorageからデータを取り出す
  getStorage() {
    const jsonItems = localStorage.getItem("data");
    const items = JSON.parse(jsonItems);
    this.forms = items;
    console.log("items = ", items);
  }

  // localStorageのデータを消す
  deleteStorage(){
    localStorage.clear();
  }

  // IndexedDBを作成
  indexedDbInit() {
    if (!window.indexedDB) {
      window.alert("このブラウザは安定板の IndexedDB をサポートしていません。IndexedDB の機能は利用できません。");
    } else {
      try {
        var datatable = document.getElementById("datatable");
 
        var dbName = "Evaluations";
        var version = 1.0;
        var openRequest = indexedDB.open(dbName, version);
 
        openRequest.onupgradeneeded = function (event: IDBVersionChangeEvent) {
            // データベースのバージョンに変更があった場合(初めての場合もここを通ります。)
            var old = event.oldVersion; //前のバージョン
            var db = openRequest.result;
            var store = db.createObjectStore("evaluation", { keyPath: "imageId", autoIncrement: true });
          
            // 削除も可能
            // db.deleteObjectStore("name")
 
            // あとからインデックス作成も可能 index 作成 引数：index名(識別用) 
            //store.createIndex("indexName", "imageId" );
        };
 
        //成功時コールバック
        openRequest.onsuccess = function (event) {
            var db = openRequest.result;
            console.log(openRequest.result);
        };
 
        //失敗時コールバック
        openRequest.onerror = function (err: Event) {
        };
    }
    catch (e) {
        console.log(e);
    }
    }
  }

  // IndexedDBにデータを保存
  indexedDbSave(){
    const formData = {
      forms: null
    };
    formData.forms = this.forms;
    formData.forms.imageId = 1;

    var dbName = "Evaluations";
    var version = 1.0;
    var openRequest = indexedDB.open(dbName, version);
    openRequest.onsuccess = function (event: IDBVersionChangeEvent) {
        var db: IDBDatabase = openRequest.result;
        // トランザクション作成
        var transaction = db.transaction("evaluation", "readwrite");
        var objectStore = transaction.objectStore("evaluation");
        var req = objectStore.put(formData.forms);
        req.onsuccess = function (e) {
            console.log("追加に成功しました", openRequest.result);
        };
        req.onerror = function (e) {
            console.log("追加に失敗しました", openRequest.error);
        };
    }
  }

  // IndexedDBからデータを取り出す
  getIndexedDb() {
    var dbName = "Evaluations";
    var version = 1.0;
    var openRequest = indexedDB.open(dbName, version);
    openRequest.onsuccess = function (event: IDBVersionChangeEvent) {
        var db: IDBDatabase = openRequest.result;
        // トランザクション作成
        var transaction = db.transaction("evaluation", "readwrite");
        var objectStore = transaction.objectStore("evaluation");
        // カーソル作成
        var req = objectStore.openCursor(null, "next");
 
        req.onsuccess = function (e) {
            //最初カーソルができたときもadvanceでカーソルが進んだときも呼ばれるイベントハンドラ
            if (req.result == null) {
                //IDBRequestのresultがnullのときは、もうデータがない
                console.log("終了しました。");
            } else {
                //IDBRequestのresultはIDBCursorWithValueである
                var cursor = req.result;
                console.log(cursor.value); //そのレコードを表示
                //次のレコードに進む
                cursor.advance(1);
            }
        }
        req.onerror = function (e) {
            console.log("取得に失敗しました", openRequest.error);
        };
    }
  }

  // IndexedDBのデータを消す
  deleteIndexedDb(){
    var dbName = "Evaluations";
    var version = 1.0;
    var openRequest = indexedDB.open(dbName, version);
    openRequest.onsuccess = function (event: IDBVersionChangeEvent) {
      var db: IDBDatabase = openRequest.result;
      // トランザクション作成
      var transaction = db.transaction("evaluation", "readwrite");
      var objectStore = transaction.objectStore("evaluation");
      // カーソル作成
      var req = objectStore.clear();
    }

    // indexedDBをまるっと消す方法がわからなかった
    // var datatable = document.getElementById("datatable");
    //        var dbName = "Evaluations";
    //        var version = 1.0;
    //        var openRequest = indexedDB.open(dbName, version);
    //        openRequest.onupgradeneeded = function (event: IDBVersionChangeEvent) {
    //            // データベースのバージョンに変更があった場合(初めての場合もここを通ります。)
    //            var old = event.oldVersion; //前のバージョン
    //            var db = openRequest.result;
    //            db.deleteObjectStore(dbName)
    //        };
  }

  // JSONデータを選択させる
  readdir(){
    for (let i = 1; i < 4; i++) {
      let filename = "group" + i + ".json";
      const jsons = this.jsonFilesUrl + filename;
      this.jsonFiles = [];
      this.http.get(jsons).subscribe(
        res => {
          this.status = res.status;
          this.error = "";
          this.jsonFiles.push(filename);
        },
        error => {
          this.error = error.text().substr(287, 100);
          this.status = error.status;
          },
      );
    }
  }

  // JSONデータを画面に表示させる
  displayData() {
    this.selectedJson = this.forms.selectJson;
    const jsons = this.jsonFilesUrl + this.selectedJson;
    this.http.get(jsons).subscribe(
      res => {
        this.evaluations = res.json();
        this.status = res.status;
        this.error = "";
        localStorage.setItem("hyoka", JSON.stringify(res.json()));
      },
      error => {
        this.error = error.text().substr(287, 100);
        this.status = error.status;
        this.evaluations = [];
      },
    );
  }

  // JSONデータを画面に表示させる（ランダム）
  async displayDataShuffle() {
    // await this.displayData();
    let n = this.evaluations.length - 1;
    for (n; n > 0; n--) {
      var i = Math.floor(Math.random() * (n + 1));
      var tmp = this.evaluations[n];
      // console.log("n = ", n);
      // console.log("tmp = ", tmp);
      this.evaluations[n] = this.evaluations[i];
      this.evaluations[i] = tmp;
    }
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

