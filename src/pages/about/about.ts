import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ModalController } from 'ionic-angular';
import { GlobalVars } from '../global';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Prebuilts } from '../prebuilts';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
	prebuiltChosen: any;
	prebuiltSelectionMade: Boolean;
	customPattern: any;
	patterns: any = [];
	instructions: any = [];
	patternObject: any = [];

  constructor(public navCtrl: NavController, public modalCtrl : ModalController, public global: GlobalVars, private sqlite: SQLite, public prebuilts: Prebuilts) {
  	this.prebuiltChosen = "";
  	this.customPattern = "";
  	this.prebuiltSelectionMade = false;
  	this.getPatterns();
  }

  random(){
  	this.prebuiltChosen = "";
  	this.prebuiltSelectionMade = false;
  	//will eventually replace this with a random instruction generator call
  	this.global.setInstructions("");
  }

  openPrebuiltModal(){
	let chooseModal = this.modalCtrl.create('PatternSelectModalPage');
	  chooseModal.onDidDismiss(data => {
	  	this.prebuiltChosen = data;
	     if(data != ""){
	     	this.prebuiltSelectionMade = true;
	     }
		});
	chooseModal.present();
  	/*var modalPage = this.modalCtrl.create('PatternSelectModalPage');
    modalPage.present();*/
  }

  openCustomModal(){
  	let chooseModal = this.modalCtrl.create('CustomPatternModalPage');
	  chooseModal.onDidDismiss(data => {
	  	this.customPattern = data;
	     if(data != ""){
	     	this.prebuiltSelectionMade = true;
	     	this.prebuiltChosen = "";
		  	this.prebuiltSelectionMade = false;
	     }
		});
	chooseModal.present();
  }

  openCustomSelectModal(patternSent: any = []){
  	let chooseModal = this.modalCtrl.create('CustomPatternSelectModalPage', {pattern: patternSent});
	  chooseModal.onDidDismiss(data => {
	  	this.customPattern = data;
	     if(data != ""){
	     	this.prebuiltSelectionMade = true;
	     	this.prebuiltChosen = "";
		  	this.prebuiltSelectionMade = false;
	     }
	     this.getPatterns();
		});
	chooseModal.present();
  }

  removePrebuiltSelection(){
    this.global.setInstructions("");
  	this.prebuiltChosen = "";
  	this.prebuiltSelectionMade = false;
  }

  addNewPattern(){
  	let chooseModal = this.modalCtrl.create('CustomPatternSelectModalPage');
	 	chooseModal.onDidDismiss(data => {
	 		this.getPatterns();
	     
		});
	chooseModal.present();
  }

  //BEGINNING OF SQLITE

	getPatterns(){
  		this.sqlite.create({
	    name: 'ionicdb.db',
	    location: 'default'
	  }).then((db: SQLiteObject) => {
	  	db.executeSql('CREATE TABLE IF NOT EXISTS pattern(patternId INTEGER PRIMARY KEY, patternName TEXT, custom INTEGER)', []).then((resPattern) => {
	    	console.log('Executed SQL create');
	    	this.patterns = [];
		    db.executeSql('SELECT * FROM pattern ORDER BY patternId DESC', [])
		    .then((resPatterns) => {
		    	for(var i=0; i < resPatterns.rows.length; i++){
		    		this.patterns.push({patternId: resPatterns.rows.item(i).patternId, patternName: resPatterns.rows.item(i).patternName, custom: resPatterns.rows.item(i).custom});
		    	}
		    }, (error) => { console.log("error selecting patterns"); });
		    
	    }, (error) => {console.log("error creating pattern table")});
	    
	  }, (error) => { console.log("error sql create")});
  	}

	getPatternsAndInstructions() {
  		console.log("in get data");
	  this.sqlite.create({
	    name: 'ionicdb.db',
	    location: 'default'
	  }).then((db: SQLiteObject) => {
	  	db.executeSql('CREATE TABLE IF NOT EXISTS pattern(patternId INTEGER PRIMARY KEY, patternName TEXT, custom INTEGER)', []).then((resPattern) => {
	  		db.executeSql('CREATE TABLE IF NOT EXISTS instruction(instructionId INTEGER PRIMARY KEY, pattern_id INTEGER, patternType TEXT, patternRow INT, patternCol INT, FOREIGN KEY(pattern_id) REFERENCES pattern (patternId))', [])
	    .then((res) => {
	    	console.log('Executed SQL create');
	    	this.patternObject = [];
		    db.executeSql('SELECT * FROM pattern ORDER BY patternId DESC', [])
		    .then((resPatterns) => {
		    	console.log("in select");
		    	console.log("patterns: " + resPatterns.rows.length);
		      
		      db.executeSql('SELECT * FROM instruction', [])
			    .then((resInstructions) => {
			    	console.log("in select");
			    	console.log("instructions: " + resInstructions.rows.length);
			      
			      for(var k=0; k < resPatterns.rows.length; k++){
			      	var pattern = [];
			      	var instructions = [];

			      	pattern.push({patternId: resPatterns.rows.item(k).patternId, patternName: resPatterns.rows.item(k).patternName, custom: resPatterns.rows.item(k).custom});
				      for(var j=0; j<resInstructions.rows.length; j++) {

				      	if(resInstructions.rows.item(j).pattern_id === resPatterns.rows.item(k).patternId){
				      		instructions.push({instructionId:resInstructions.rows.item(j).instructionId, patternType:resInstructions.rows.item(j).patternType,patternRow:resInstructions.rows.item(j).patternRow,patternCol:resInstructions.rows.item(j).patternCol});
				      	}
				      }
				      this.patternObject.push({patternId: pattern[0].patternId, patternName: pattern[0].patternName, custom: pattern[0].custom, instructions: instructions});
			      }

			      console.log("Number of objects: " + this.patternObject.length);

			    }, (error) => { console.log("error selecting instructions"); });
		    }, (error) => { console.log("error selecting patterns"); });
		    
	    }, (error) => { console.log("error creating instruction table"); console.log(error.message);});
	  	}, (error) => {console.log("error creating pattern table")});
	    
	  }, (error) => { console.log("error sql create")});
	}

	setPrebuiltPatterns(){
		this.sqlite.create({
	      name: 'ionicdb.db',
	      location: 'default'
	    }).then((db: SQLiteObject) => {
	      let p = "INSERT INTO pattern VALUES (?, ?, ?)";
	      //EVENTUALLY HAS TO LOOP THROUGH ALL PREBUILTS
		      db.executeSql(p, [null, "Basic Fielding", 0])
		        .then((res) => {
		          let q = "INSERT INTO instruction VALUES (?, ?, ?, ?, ?)";
			      for(var i = 0; i < this.prebuilts.basicFielding.length; i++){
				      db.executeSql(q, [null, res.insertId,this.prebuilts.basicFielding[i].type,this.prebuilts.basicFielding[i].row,this.prebuilts.basicFielding[i].col])
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
	    this.getPatterns();
	}

	deleteAllCustomData() {
	  this.sqlite.create({
	    name: 'ionicdb.db',
	    location: 'default'
	  }).then((db: SQLiteObject) => {
	    db.executeSql('DELETE FROM pattern WHERE custom = 1', [])
	    .then(res => {
		    db.executeSql('DELETE FROM instruction WHERE patternId = res.patternId', []).then(res => {

		    }, (error) => {console.log("error deleting all instructions for pattern");
		    });
	      console.log(res);
	      this.getPatterns();
	    }, (error) => { console.log("error deleting")});
	  }, (error) => {console.log("error creating/opening db")});
	}

}
