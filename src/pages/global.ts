import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVars {
	instructions: any;
	constructor(){
		this.instructions = "";
	}

	setInstructions(value){
		this.instructions = value;
	}

	getInstructions(){
		return this.instructions;
	}
}