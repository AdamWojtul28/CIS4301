import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-datapage',
  templateUrl: './datapage.component.html',
  styleUrls: ['./datapage.component.css']
})
export class DatapageComponent {
  max = 100;
  min = 0;
  step = 10;
  thumbLabel = true;
  value1 = 0;
  value2 = 100;
  postId: string;
  ageGroup: FormGroup;
  demoGroup: FormGroup;
  bodyGroup: FormGroup;
  locationGroup: FormGroup;


  constructor(private http: HttpClient, private _formBuilder: FormBuilder) {}
  ngOnInit() {
    this.ageGroup = this._formBuilder.group({
        ageStart: new FormControl(this.value1),
        ageEnd: new FormControl(this.value2),
        pepperoni: false,
        extracheese: false,
        mushroom: false,
    });
    this.demoGroup = this._formBuilder.group({
        white: false,
        black: false,
        hispanic: false,
        PI: false
    });
    this.bodyGroup = this._formBuilder.group({
        upper: false,
        middle: false,
        lower: false,
        A: false,
        B: false,
        C: false,
        D: false
    });
    this.locationGroup = this._formBuilder.group({
        farm: false,
        city: false,
        school: false,
        factory: false,
        dayCare: false
    });
  }

  send() {
  
    var formData: any=new FormData();
    this.addData(formData);
    this.http.post('http://localhost:1337/users/sendData', formData)
    .subscribe(data =>{
      this.postId=JSON.stringify(data);
      console.log(this.postId);
    });

      console.log('Age start:', this.ageGroup.get('ageStart')?.value);
      console.log('Age end: ', this.ageGroup.get('ageEnd')?.value);
      console.log('White?: ', this.demoGroup.get('white')?.value);
      console.log('Black?: ', this.demoGroup.get('black')?.value);
      console.log('25%:', this.bodyGroup.get('A')?.value);
      console.log('50%: ', this.bodyGroup.get('B')?.value);
      console.log('75%: ', this.bodyGroup.get('C')?.value);
      console.log('100%: ', this.bodyGroup.get('D')?.value);
      console.log('city?: ', this.locationGroup.get('city')?.value);
      console.log('school?: ', this.locationGroup.get('school')?.value);

    window.location.pathname = './data';
  }
  
addData(formData: FormData) {
    //formData.append('firstName', this.dataGroup.get('firstName')?.value);
    //formData.append('username', this.dataGroup.get('username')?.value);
    //formData.append('password', this.dataGroup.get('pasword')?.value);
}
}
