import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


import {BehaviorSubject, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { SwapiService } from './swapi.service';


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
  inputGroup: FormGroup;
  sexGroup: FormGroup;
  ageGroup: FormGroup;
  demoGroup: FormGroup;
  bodyGroup: FormGroup;
  dispositionGroup: FormGroup;
  locationGroup: FormGroup;
    
  filteredOptions: Observable<string[]>;
  myControl = new FormControl('');
  private filteredOptionsSubject = new BehaviorSubject<string[]>([]);
  options: string[] = ['Delhi', 'Mumbai', 'Banglore'];    

  constructor(private http: HttpClient, private _formBuilder: FormBuilder, private swapiService: SwapiService) {}
    ngOnInit() {
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
        this.inputGroup = this._formBuilder.group({
            search: new FormControl('', Validators.required),
            unit: new FormControl('year')
        });
        this.ageGroup = this._formBuilder.group({
            ageStart: new FormControl(this.slideStart),
            ageEnd: new FormControl(this.slideEnd)
        });
        this.sexGroup = this._formBuilder.group({
            male: false,
            female: false,
            otherSex: false
        }); 
        this.demoGroup = this._formBuilder.group({
            white: false,
            black: false,
            asian: false,
            AI: false,
            PI: false,
            otherDemo: false
        });
        this.dispositionGroup = this._formBuilder.group({
            TR: false,
            hospitalized: false,
            fatality: false,
            otherDisp: false
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
            otherLoc: false
        });
    }

  send() {
  
    var formData: any=new FormData();
    this.addData(formData);
    this.http.post('http://localhost:5000/users/sendData', formData)
    .subscribe(data =>{
      this.postId=JSON.stringify(data);
      console.log(this.postId);
    });
      console.log('Age start: ', this.ageGroup.get('ageStart')?.value);
      console.log('Age end: ', this.ageGroup.get('ageEnd')?.value);
      console.log('White?: ', this.demoGroup.get('white')?.value);
      console.log('Black?: ', this.demoGroup.get('black')?.value);
      console.log('city?: ', this.locationGroup.get('city')?.value);
      console.log('school?: ', this.locationGroup.get('school')?.value);
      console.log('Time unit: ', this.inputGroup.get('unit')?.value);
      console.log('Search: ', this.myControl.value)

    window.location.pathname = './data';
  }
  
    addData(formData: FormData) {
        formData.append('product', this.myControl.value!)
        formData.append('unit', this.inputGroup.get('unit')?.value);
        formData.append('ageStart', this.ageGroup.get('ageStart')?.value);
        formData.append('ageEnd', this.ageGroup.get('ageEnd')?.value);
        formData.append('male', this.sexGroup.get('male')?.value);
        formData.append('female', this.sexGroup.get('female')?.value);
        formData.append('otherSex', this.sexGroup.get('otherSex')?.value);
        formData.append('white', this.demoGroup.get('white')?.value);
        formData.append('black', this.demoGroup.get('black')?.value);
        formData.append('asian', this.demoGroup.get('asian')?.value);
        formData.append('AI', this.demoGroup.get('AI')?.value);
        formData.append('PI', this.demoGroup.get('PI')?.value);
        formData.append('otherDemo', this.demoGroup.get('otherDemo')?.value);
        formData.append('TR', this.dispositionGroup.get('TR')?.value);
        formData.append('hospitalized', this.dispositionGroup.get('hospitalized')?.value);
        formData.append('fatality', this.dispositionGroup.get('fatality')?.value);
        formData.append('otherDisp', this.dispositionGroup.get('otherDisp')?.value);
        formData.append('home', this.locationGroup.get('home')?.value);
        formData.append('farm', this.locationGroup.get('farm')?.value);
        formData.append('street', this.locationGroup.get('street')?.value);
        formData.append('MH', this.locationGroup.get('MH')?.value);
        formData.append('city', this.locationGroup.get('city')?.value);
        formData.append('school', this.locationGroup.get('school')?.value);
        formData.append('factory', this.locationGroup.get('factory')?.value);
        formData.append('sport', this.locationGroup.get('sport')?.value);
        formData.append('otherLoc', this.locationGroup.get('otherLoc')?.value);
    }
    
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
    
        return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }
}
