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

	pattern: any = [];
	instructions: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, private platform: Platform, public modalCtrl : ModalController, public viewCtrl: ViewController) {
  	
  }

  ionViewDidLoad() {
  	this.pattern = [];
  	this.pattern = this.navParams.get('pattern');
    this.getInstructions();
  }

  getInstructions() {
  		console.log("in get data");
	  this.sqlite.create({
	    name: 'ionicdb.db',
	    location: 'default'
	  }).then((db: SQLiteObject) => {
	  	db.executeSql('CREATE TABLE IF NOT EXISTS pattern(patternId INTEGER PRIMARY KEY, patternName TEXT, custom INTEGER)', []).then((resPattern) => {
	  		db.executeSql('CREATE TABLE IF NOT EXISTS instruction(instructionId INTEGER PRIMARY KEY, pattern_id INTEGER, patternType TEXT, patternRow INT, patternCol INT, FOREIGN KEY(pattern_id) REFERENCES pattern (patternId))', [])
	    .then((res) => {
		    db.executeSql('SELECT * FROM instruction WHERE pattern_id = ' + this.pattern.patternId + ' ORDER BY instructionId', [])
		    .then((res) => {
		      
		      this.instructions = [];
		      for(var i=0; i<res.rows.length; i++) {
		        this.instructions.push({instructionId:res.rows.item(i).instructionId,patternName: res.rows.item(i).pattern_id, patternType:res.rows.item(i).patternType,patternRow:res.rows.item(i).patternRow,patternCol:res.rows.item(i).patternCol})
		      }
		    }, (error) => { console.log("error selecting"); console.log(error.message) });
	    }, (error) => { console.log("error creating instruction table"); console.log(error.message);});
	  	}, (error) => {console.log("error creating pattern table"); console.log(error.message);});
	    
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
	    this.getInstructions();
	}

	/*editPattern(patternId) {
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
	    this.getInstructions();
	}*/

	deleteAllInstructionsForPattern() {
	  this.sqlite.create({
	    name: 'ionicdb.db',
	    location: 'default'
	  }).then((db: SQLiteObject) => {
	    db.executeSql('DELETE FROM instruction WHERE pattern_id = ' + this.pattern.patternId, [])
	    .then(res => {
	      console.log(res);
	      this.getInstructions();
	    }, (error) => { console.log("error deleting"); console.log(error.message)});
	  }, (error) => {console.log("error creating/opening db")});
	}

	deleteOneItem(instruction) {
	  this.sqlite.create({
	    name: 'ionicdb.db',
	    location: 'default'
	  }).then((db: SQLiteObject) => {
	    db.executeSql('DELETE FROM instruction WHERE instructionId = ' + instruction, [])
	    .then(res => {
	      console.log(res);
	      this.getInstructions();
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
