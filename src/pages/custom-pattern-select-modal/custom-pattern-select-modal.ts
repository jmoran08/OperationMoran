import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from 'ionic-angular';
import { ViewController, ModalController } from 'ionic-angular';


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
	pattern: any = [];
	instructions: any = [];
	patternData = { patternName: "Test Pattern", patternRow: 7, patternCol: 6, patternType: "ground"};
	data = { date:"testDate", type:"testType", description:"testDesc", amount:10 };

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, private platform: Platform, public modalCtrl : ModalController, public viewCtrl: ViewController) {
  	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomPatternSelectModalPage');
    console.log("patterns: " + this.navParams.get('pattern').length);
    this.patterns = this.navParams.get('pattern');
    this.instructions = this.patterns.instructions;
    console.log("instructions: " + this.instructions.length);
  }

  getData() {
  		console.log("in get data");
	  this.sqlite.create({
	    name: 'ionicdb.db',
	    location: 'default'
	  }).then((db: SQLiteObject) => {
	  	db.executeSql('CREATE TABLE IF NOT EXISTS pattern(patternId INTEGER PRIMARY KEY, patternName TEXT, custom INTEGER)', []).then((resPattern) => {
	  		db.executeSql('CREATE TABLE IF NOT EXISTS instruction(instructionId INTEGER PRIMARY KEY, pattern_id INTEGER, patternType TEXT, patternRow INT, patternCol INT, FOREIGN KEY(pattern_id) REFERENCES pattern (patternId))', [])
	    .then((res) => {
	    	console.log('Executed SQL create');
		    db.executeSql('SELECT * FROM instruction ORDER BY instructionId', [])
		    .then((res) => {
		    	console.log("in select");
		    	console.log("created pattern name: " + resPattern.patternName);
		      this.patterns = [];
		      for(var i=0; i<res.rows.length; i++) {
		        this.patterns.push({instructionId:res.rows.item(i).instructionId,patternName: res.rows.item(i).pattern_id, patternType:res.rows.item(i).patternType,patternRow:res.rows.item(i).patternRow,patternCol:res.rows.item(i).patternCol})
		      }
		    }, (error) => { console.log("error selecting"); });
	    }, (error) => { console.log("error creating instruction table"); console.log(error.message);});
	  	}, (error) => {console.log("error creating pattern table")});
	    
	  }, (error) => { console.log("error sql create")});
	}

	saveCustomPattern(pattern){
		this.sqlite.create({
	      name: 'ionicdb.db',
	      location: 'default'
	    }).then((db: SQLiteObject) => {
	      let p = "INSERT INTO pattern VALUES (?, ?, ?)";
	      db.executeSql(p, [null, "Custom Pattern", 1])
	        .then((res) => {
	          let q = "INSERT INTO instruction VALUES (?, ?, ?, ?, ?)";
		      for(var i = 0; i < pattern.length; i++){
			      db.executeSql(q, [null, res.insertId,pattern[i].type,pattern[i].row,pattern[i].col])
			        .then((res) => {
			          
			        }, (error) =>  {
			          console.log("error inserting to instructions");
			        });
		        }
	        }, (error) =>  {
	          console.log("error inserting to pattern");
	          console.log(error.message);
	        });
	      
	    }, (error) => {
	      console.log("error creating/opening add");
	    });
	    this.getData();
	}

	/*editData(rowid) {
	  this.navCtrl.push(EditDataPage, {
	    rowid:rowid
	  });
	}*/

	deleteAllData() {
	  this.sqlite.create({
	    name: 'ionicdb.db',
	    location: 'default'
	  }).then((db: SQLiteObject) => {
	    db.executeSql('DELETE FROM instruction', [])
	    .then(res => {
	      console.log(res);
	      this.getData();
	    }, (error) => { console.log("error deleting")});
	  }, (error) => {console.log("error creating/opening db")});
	}

	deleteOneItem(id) {
	  this.sqlite.create({
	    name: 'ionicdb.db',
	    location: 'default'
	  }).then((db: SQLiteObject) => {
	  	console.log("id to delete: " + id);
	    db.executeSql('DELETE FROM instruction WHERE instructionId = ' + id, [])
	    .then(res => {
	      console.log(res);
	      this.getData();
	    }, (error) => { console.log("error deleting")});
	  }, (error) => {console.log("error creating/opening db")});
	}

	openCustomPatternModal(){
  	let chooseModal = this.modalCtrl.create('CustomPatternModalPage');
	  chooseModal.onDidDismiss(data => {
	  	//this.customPattern = data;
	     if(data != ""){
	     	/*this.prebuiltSelectionMade = true;
	     	this.prebuiltChosen = "";
		  	this.prebuiltSelectionMade = false;*/
		  	this.saveCustomPattern(data);
	     }
		});
	chooseModal.present();
  }

  closeChooseCustomPatternModal(){
  	this.viewCtrl.dismiss("");
  }

  //REMOVE WHEN YOU DON'T NEED ANYMORE
  dropTables(){
  	this.sqlite.create({
	    name: 'ionicdb.db',
	    location: 'default'
	  }).then((db: SQLiteObject) => {
	  	db.executeSql('DROP TABLE pattern').then((res) => {

	  	}, (error) => {
	  		console.log("error dropping pattern");
	  		console.log(error.message);
	  	});
	  	db.executeSql('DROP TABLE instruction').then((res) => {

	  	}, (error) => {
	  		console.log("error dropping instruction");
	  		console.log(error.message);
	  	});
  	}, (error) => {

  	});

  }

}
