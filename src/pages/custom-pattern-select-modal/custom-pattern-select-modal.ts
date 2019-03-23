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
	newInstructions: any = [];
	allInstructions: any = [];
	addMode: any;
	editMode: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, private platform: Platform, public modalCtrl : ModalController, public viewCtrl: ViewController) {
  	
  }

  ionViewDidLoad() {
  	this.pattern = [];
  	this.pattern = this.navParams.get('pattern');
  	//no pattern passed means we are adding new pattern
  	if(this.pattern != null){
  		this.addMode = 0;
  		this.editMode = 0;
  		this.getInstructions();
  	}
  	else{
  		this.addMode = 1;
  		this.editMode = 0;
  	}
    
  }


  editModeToggle(){
  	this.editMode = 1;
  }
  //READ
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
		      this.allInstructions = [];
		      for(var i=0; i<res.rows.length; i++) {
		        this.instructions.push({instructionId:res.rows.item(i).instructionId,patternName: res.rows.item(i).pattern_id, patternType:res.rows.item(i).patternType,patternRow:res.rows.item(i).patternRow,patternCol:res.rows.item(i).patternCol});
		        this.allInstructions.push({instructionId:res.rows.item(i).instructionId,patternName: res.rows.item(i).pattern_id, patternType:res.rows.item(i).patternType,patternRow:res.rows.item(i).patternRow,patternCol:res.rows.item(i).patternCol});
		      }
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
		this.editMode = 0;
	}

	cancelEdit(){
		this.editMode = 0;
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
			        .then((res) => {
			        		this.pattern = res;
				        	//There are also instructions to be added while creating new pattern
				        	if(this.newInstructions.length > 0){
				        		//INSERT NEW INSTRUCTIONS
					          let q = "INSERT INTO instruction VALUES (?, ?, ?, ?, ?)";
						      for(var i = 0; i < this.newInstructions.length; i++){
							      db.executeSql(q, [null, res.insertId,this.newInstructions[i].patternType,this.newInstructions[i].patternRow,this.newInstructions[i].patternCol])
							        .then((res) => {
							          this.getInstructions();
							        }, (error) =>  {
							          console.log("error inserting to instructions");
							          console.log(error.message);
							        });
						        }
						    }
						    else{
						    	this.getInstructions();
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
	        	//DELETE ALL INSTRUCTIONS BEFORE SAVING ALL
	        	db.executeSql('DELETE FROM instruction WHERE pattern_id = ' + this.pattern.patternId, [])
			    .then(res => {
			      let q = "INSERT INTO instruction VALUES (?, ?, ?, ?, ?)";
			      for(var i = 0; i < this.allInstructions.length; i++){
			      		//SAVE ALL INSTRUCTIONS (TODO - IN ORDER SHOWN ON UI)
				      db.executeSql(q, [null, this.pattern.patternId,this.allInstructions[i].patternType,this.allInstructions[i].patternRow,this.allInstructions[i].patternCol])
				        .then((res) => {
				          this.getInstructions();
				        }, (error) =>  {
				          console.log("error inserting to instructions");
				          console.log(error.message);
				        });
			        }
			    }, (error) => { console.log("error deleting"); console.log(error.message)});
		        	
	        }, (error) =>  {
	          console.log("error updating pattern");
	          console.log(error.message);
	        });
	      
	    }, (error) => {
	      console.log("error creating/opening add");
	    });
	    
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
	  	let chooseModal = this.modalCtrl.create('CustomPatternModalPage');
		  chooseModal.onDidDismiss(data => {
		     if(data != ""){
		     	for(var i=0; i < data.length; i++){
		     		this.newInstructions.push({patternType:data[i].type,patternRow:data[i].row,patternCol:data[i].col});
		     		this.allInstructions.push({patternType:data[i].type,patternRow:data[i].row,patternCol:data[i].col});
		     	}
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
