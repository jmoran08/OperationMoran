import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from 'ionic-angular';

/**
 * Generated class for the CustomPatternSelectModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-custom-pattern-select-modal',
  templateUrl: 'custom-pattern-select-modal.html',
})
export class CustomPatternSelectModalPage {
	
	expenses: any = [];
	totalIncome = 0;
	totalExpense = 0;
	balance = 0;
	patterns: any = [];
	patternData = { patternName: "Test Pattern", patternRow: 7, patternCol: 6, patternType: "ground"};
	data = { date:"testDate", type:"testType", description:"testDesc", amount:10 };

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, private platform: Platform) {
  	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomPatternSelectModalPage');
    this.getData();
  }

  getData() {
  		console.log("in get data");
	  this.sqlite.create({
	    name: 'ionicdb.db',
	    location: 'default'
	  }).then((db: SQLiteObject) => {
	  	console.log("before create");
	    db.executeSql('CREATE TABLE IF NOT EXISTS pattern(rowid INTEGER PRIMARY KEY, patternName TEXT, patternType TEXT, patternRow INT, patternCol INT)', [])
	    .then((res) => {
	    	console.log('Executed SQL create');
		    db.executeSql('SELECT * FROM pattern ORDER BY rowid', [])
		    .then((res) => {
		    	console.log("in select");
		      this.patterns = [];
		      for(var i=0; i<res.rows.length; i++) {
		        this.patterns.push({rowid:res.rows.item(i).rowid,patternName:res.rows.item(i).patternName,patternType:res.rows.item(i).patternType,patternRow:res.rows.item(i).patternRow,patternCol:res.rows.item(i).patternCol})
		      }
		      for(var k=0; k<this.patterns.length; k++){
		      	console.log("Pattern " + k + "id: " + this.patterns[k].rowid);
		      	console.log("Pattern " + k + " name: " + this.patterns[k].patternName);
		      	console.log("Pattern " + k + " type: " + this.patterns[k].patternType);
		      	console.log("Pattern " + k + " row: " + this.patterns[k].patternRow);
		      	console.log("Pattern " + k + " col: " + this.patterns[k].patternCol);
		      }
		    }, (error) => { console.log("error selecting")});
	    }, (error) => { console.log("error creating table")});
	  }, (error) => { console.log("error sql create")});
	}

	addData() {
	  this.sqlite.create({
	      name: 'ionicdb.db',
	      location: 'default'
	    }).then((db: SQLiteObject) => {
	      let q = "INSERT INTO pattern VALUES (?, ?, ?, ?, ?)";
	      db.executeSql(q, [null, "testname","testtype",7,6])
	        .then((res) => {
	        	console.log("inserting");
	          console.log(res);
	          this.getData();
	        }, (error) =>  {
	          console.log("error inserting");
	        });
	    }, (error) => {
	      console.log("error creating/opening add");
	    });
	}

	/*editData(rowid) {
	  this.navCtrl.push(EditDataPage, {
	    rowid:rowid
	  });
	}*/

	deleteData() {
	  this.sqlite.create({
	    name: 'ionicdb.db',
	    location: 'default'
	  }).then((db: SQLiteObject) => {
	    db.executeSql('DELETE FROM pattern', [])
	    .then(res => {
	      console.log(res);
	      this.getData();
	    }, (error) => { console.log("error deleting")});
	  }, (error) => {console.log("error creating/opening db")});
	}

}
