import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVars {
	instructions: any;
	arduinoInfo: any;
	constructor(){
		this.instructions = "";
		this.arduinoInfo = [{row: 0, col: 0,type: "fly",servo: -45,linear: 45,psi: 200},{row: 0,col: 1,type: "ground",servo: -44,linear: -15,psi: 200}];
	}

	setInstructions(value){
		console.log("set instructions: " + value);
		this.instructions = value;
	}

	getInstructions(){
		return this.instructions;
	}
	getArduinoInfo(row: any, col: any, type: any){
		var result = {};
		for(var i = 0; i < this.arduinoInfo.length; i++){
			if(this.arduinoInfo[i].row === row && this.arduinoInfo[i].col === col && this.arduinoInfo[i].type === type){
				result = {row: row, col: col, type: type, servo: this.arduinoInfo[i].servo, linear: this.arduinoInfo[i].linear, psi: this.arduinoInfo[i].psi};
			}
		}
		return result;
	}
}
