import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from 'ionic-angular';
import { ViewController, ModalController } from 'ionic-angular';
import { GlobalVars } from '../global';

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
	allInstructions: any = [];
	addMode: any;
	editMode: any;
	updateMade: any;
	title: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, private platform: Platform, public modalCtrl : ModalController, public viewCtrl: ViewController, public global: GlobalVars) {

  }

  ionViewDidLoad() {
  	this.pattern = [];
  	this.pattern = this.navParams.get('pattern');
  	//no pattern passed means we are adding new pattern
  	if(this.pattern != null){
  		this.addMode = 0;
  		this.editMode = 0;
  		this.title = this.pattern.patternName;
  		this.getInstructions();
  	}
  	else{
  		this.addMode = 1;
  		this.title = "New Pattern";
  		this.editMode = 0;
  	}

  }


  editModeToggle(){
  	this.editMode = 1;
  }
  //READ
  getInstructions() {
  		console.log("in get data");
  		console.log("pattern id to get: " + this.pattern.patternId);
	  this.sqlite.create({
	    name: 'ionicdb.db',
	    location: 'default'
	  }).then((db: SQLiteObject) => {
	  	db.executeSql('CREATE TABLE IF NOT EXISTS pattern(patternId INTEGER PRIMARY KEY, patternName TEXT, custom INTEGER)', []).then((resPattern) => {
	  		db.executeSql('CREATE TABLE IF NOT EXISTS instruction(instructionId INTEGER PRIMARY KEY, pattern_id INTEGER, patternType TEXT, patternRow INT, patternCol INT, FOREIGN KEY(pattern_id) REFERENCES pattern (patternId))', [])
	    .then((res) => {
		    db.executeSql('SELECT * FROM instruction WHERE pattern_id = ' + this.pattern.patternId + ' ORDER BY instructionId', [])
		    .then((res) => {

		      this.allInstructions = [];
		      for(var i=0; i<res.rows.length; i++) {
            //find matching angles and PSI
            var mapInfo = [];
            mapInfo = this.global.getArduinoInfo(res.rows.item(i).patternRow,res.rows.item(i).patternCol, res.rows.item(i).patternType);
		        this.allInstructions.push({instructionId:res.rows.item(i).instructionId,patternName: res.rows.item(i).pattern_id, patternType:res.rows.item(i).patternType,patternRow:res.rows.item(i).patternRow,patternCol:res.rows.item(i).patternCol,servo: mapInfo.servo,linear:mapInfo.linear,psi:mapInfo.psi});
            console.log("after assign servo: " + this.allInstructions[i].servo);
          }
		      	this.editMode = 0;
				this.addMode = 0;
				this.updateMade = 0;
		    }, (error) => { console.log("error selecting"); console.log(error.message) });
	    }, (error) => { console.log("error creating instruction table"); console.log(error.message);});
	  	}, (error) => {console.log("error creating pattern table"); console.log(error.message);});

	  }, (error) => { console.log("error sql create")});
	}

	saveCustomPattern(){
		if(this.addMode === 1){
			this.createCustomPattern();
		}
		else{
			this.updateCustomPattern();
		}
	}

	cancelEdit(){
		if(this.editMode === 1){
			this.editMode = 0;
			this.getInstructions();
		}
		else if(this.addMode === 1){
			this.addMode = 0;
			this.closeChooseCustomPatternModal();
		}
	}

	//CREATE
	createCustomPattern(){
		console.log("in create pattern");
		//INSERT NEW PATTERN
		this.sqlite.create({
	      name: 'ionicdb.db',
	      location: 'default'
	    }).then((db: SQLiteObject) => {
	    	db.executeSql('CREATE TABLE IF NOT EXISTS pattern(patternId INTEGER PRIMARY KEY, patternName TEXT, custom INTEGER)', []).then((resPattern) => {
	  			db.executeSql('CREATE TABLE IF NOT EXISTS instruction(instructionId INTEGER PRIMARY KEY, pattern_id INTEGER, patternType TEXT, patternRow INT, patternCol INT, FOREIGN KEY(pattern_id) REFERENCES pattern (patternId))', [])
			    .then((res) => {
			    	let p = "INSERT INTO pattern VALUES (?, ?, ?)";
			      	db.executeSql(p, [null, "Custom Pattern", 1])
			        .then((resPattern) => {
                    //There are also instructions to be added while creating new pattern
  				        	if(this.allInstructions.length > 0){
                      this.getPattern(resPattern.insertId)
  				        		//INSERT NEW INSTRUCTIONS
  					          let q = "INSERT INTO instruction VALUES (?, ?, ?, ?, ?)";
  						      for(var i = 0; i < this.allInstructions.length; i++){
  							      db.executeSql(q, [null, resPattern.insertId,this.allInstructions[i].patternType,this.allInstructions[i].patternRow,this.allInstructions[i].patternCol])
  							        .then((res) => {


  							        }, (error) =>  {
  							          console.log("error inserting to instructions");
  							          console.log(error.message);
  							        });
  						        }
  						    }
  						    else{
                    this.getPattern(resPattern.insertId)
  						    }
				        }, (error) =>  {
				          console.log("error inserting to pattern");
				          console.log(error.message);
				        });
			    }, (error) => { console.log("error creating instruction table"); console.log(error.message);});
		  	}, (error) => {console.log("error creating pattern table"); console.log(error.message);});

	    }, (error) => {
	      console.log("error creating/opening add");
	    });

	}

	//UPDATE
	updateCustomPattern() {
		console.log("in update pattern");
	  //UPDATE EXISTING PATTERN
		this.sqlite.create({
	      name: 'ionicdb.db',
	      location: 'default'
	    }).then((db: SQLiteObject) => {
	      let p = 'UPDATE pattern SET patternName = "Name" WHERE patternId = ' + this.pattern.patternId;
	      db.executeSql(p, [])
	        .then((res) => {
	        	//DELETE ALL INSTRUCTIONS BEFORE SAVING ALL - TO DO: only do if update made
	        	console.log("update made: " + this.updateMade);
	        	if(this.updateMade === 1){
		        	db.executeSql('DELETE FROM instruction WHERE pattern_id = ' + this.pattern.patternId, [])
				    .then(res => {
				      let q = "INSERT INTO instruction VALUES (?, ?, ?, ?, ?)";
				      for(var i = 0; i < this.allInstructions.length; i++){
				      		//SAVE ALL INSTRUCTIONS (TODO - IN ORDER SHOWN ON UI)
					      db.executeSql(q, [null, this.pattern.patternId,this.allInstructions[i].patternType,this.allInstructions[i].patternRow,this.allInstructions[i].patternCol])
					        .then((res) => {

					        }, (error) =>  {
					          console.log("error inserting to instructions");
					          console.log(error.message);
					        });
				        }
				        this.getInstructions();
				    }, (error) => { console.log("error deleting"); console.log(error.message)});
				}
				else{
					this.getInstructions();
				}

	        }, (error) =>  {
	          console.log("error updating pattern");
	          console.log(error.message);
	        });

	    }, (error) => {
	      console.log("error creating/opening add");
	    });

	}

	deleteAllInstructions(){
		this.allInstructions = [];
		this.updateMade = 1;
	}

	deleteOneInstruction(instructionId){
		for(var i = 0; i < this.allInstructions.length; i++){
			if(this.allInstructions[i].instructionId === instructionId){
				this.allInstructions.splice(i, 1);
				this.updateMade = 1;
			}
		}
	}

	//DELETE ALL
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

	//DELETE ONE
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
	  	let chooseModal = this.modalCtrl.create('CustomPatternModalPage', {savedInstructions: this.allInstructions});
		  chooseModal.onDidDismiss(data => {
		     if(data != ""){
           this.allInstructions = [];
		     	for(var i=0; i < data.length; i++){
		     		this.allInstructions.push({patternType:data[i].type,patternRow:data[i].row,patternCol:data[i].col,mapId:data[i].mapId});
		     		this.updateMade = 1;
		     	}
		     }
			});
		chooseModal.present();
	  }

getPattern(patternId){
	return this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
  	db.executeSql('CREATE TABLE IF NOT EXISTS pattern(patternId INTEGER PRIMARY KEY, patternName TEXT, custom INTEGER)', []).then((resPattern) => {
	    db.executeSql('SELECT * FROM pattern WHERE patternId = ' + patternId, [])
	    .then((resPattern) => {
	    		this.pattern = { patternId: resPattern.rows.item(0).patternId, patternName: resPattern.rows.item(0).patternName, custom: resPattern.rows.item(0).custom };
	    		this.getInstructions();
	    }, (error) => { console.log("error selecting patterns"); });

    }, (error) => {console.log("error creating pattern table")});

  }, (error) => { console.log("error sql create")});
}

deletePattern(patternId){
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
    db.executeSql('DELETE FROM pattern WHERE patternId = ' + patternId, [])
    .then(res => {
      db.executeSql('DELETE FROM instruction WHERE pattern_id = ' + patternId, []).then(res => {
        console.log(res);
        this.closeChooseCustomPatternModal();
      }, (error) => {console.log("error deleting all instructions for pattern");
      });
    }, (error) => { console.log("error deleting")});
  }, (error) => {console.log("error creating/opening db")});
}

setPattern(){
	this.global.setInstructions(this.allInstructions);
	this.viewCtrl.dismiss("");
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
	  	db.executeSql('DROP TABLE instruction').then((res) => {

	  	}, (error) => {
	  		console.log("error dropping instruction");
	  		console.log(error.message);
	  	});
	  	db.executeSql('DROP TABLE pattern').then((res) => {

	  	}, (error) => {
	  		console.log("error dropping pattern");
	  		console.log(error.message);
	  	});

  	}, (error) => {

  	});

  }

}
