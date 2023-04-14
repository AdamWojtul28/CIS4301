import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


export interface User {
    name: string;
}

@Component({
  selector: 'app-datapage',
  templateUrl: './datapage.component.html',
  styleUrls: ['./datapage.component.css']
})
export class DatapageComponent {
  max = 120;
  min = 0;
  step = 10;
  thumbLabel = true;
  slideStart = 0;
  slideEnd = 120;
  postId: string;
  searchGroup: FormGroup;
  sexGroup: FormGroup;
  ageGroup: FormGroup;
  demoGroup: FormGroup;
  bodyGroup: FormGroup;
  dispositionGroup: FormGroup;
  locationGroup: FormGroup;

    myControl = new FormControl<string | User>('');
    options: User[] = [{ name: 'Mary' }, { name: 'Shelley' }, { name: 'Igor' }];
    filteredOptions: Observable<User[]>;

  constructor(private http: HttpClient, private _formBuilder: FormBuilder) {}
    ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(name as string) : this.options.slice();
        }),
        );   
    this.ageGroup = this._formBuilder.group({
        ageStart: new FormControl(this.slideStart),
        ageEnd: new FormControl(this.slideEnd)
    });
    this.sexGroup = this._formBuilder.group({
        male: false,
        female: false,
        other: false,
    }); 
    this.demoGroup = this._formBuilder.group({
        white: false,
        black: false,
        asian: false,
        AI: false,
        PI: false,
        other: false
    });
    this.dispositionGroup = this._formBuilder.group({
        TR: false,
        hospitalized: false,
        fatality: false,
        other: false
    });
    this.locationGroup = this._formBuilder.group({
        home: false,
        farm: false,
        street: false,
        MH: false,
        city: false,
        school: false,
        factory: false,
        sport: false,
        other: false
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
    
    
    /*
        ageStart: new FormControl(this.slideStart),
        ageEnd: new FormControl(this.slideEnd)
        male: false,
        female: false,
        other: false,
        white: false,
        black: false,
        asian: false,
        AI: false,
        PI: false,
        other: false
        TR: false,
        hospitalized: false,
        fatality: false,
        other: false
        home: false,
        farm: false,
        street: false,
        MH: false,
        city: false,
        school: false,
        factory: false,
        sport: false,
        other: false
    */
    }
    
    private _filter(name: string): User[] {
        const filterValue = name.toLowerCase();
    
        return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
    }
    displayFn(user: User): string {
        return user && user.name ? user.name : '';
    }
    
}
