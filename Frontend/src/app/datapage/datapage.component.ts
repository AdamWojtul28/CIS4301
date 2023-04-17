import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidatorFn, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Chart } from 'chart.js/auto';

interface Data {
    product_title: string,
    x_value: number,
    y_value: number
}
interface GraphData {
    graph_type: number;
    graph_values: Data[];
}

@Component({
  selector: 'app-datapage',
  templateUrl: './datapage.component.html',
  styleUrls: ['./datapage.component.css']
})
export class DatapageComponent implements OnInit {
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
  dispositionGroup: FormGroup;
  locationGroup: FormGroup;
  filteredOptions: Observable<string[]>;
    options: string[] = ['Delhi', 'Mumbai', 'Banglore'];    
    
    public MyChart: Chart;
    public chart: any;
    public graphData: any;
    public graphType: number;
    graphY: any;

    public search = new FormControl('', { validators: [autocompleteStringValidator(this.options), Validators.required] });

    public validation_msgs = {
        'search': [
            { type: 'invalidAutocompleteString', message: 'Product not recognized.' },
            { type: 'required', message: 'Product is required.' }
        ]
    };

  constructor(private http: HttpClient, private _formBuilder: FormBuilder) {}
    ngOnInit() {
        this.createChart();

        this.filteredOptions = this.search.valueChanges.pipe(
            startWith(''),
            map(value => this._filterLabels(value || '')),
        );
        
        this.inputGroup = this._formBuilder.group({
            search: new FormControl('', { validators: [autocompleteStringValidator(this.options), Validators.required] }),
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
        this.addDataToSend(formData);
        this.http.post('http://localhost:5000/users/sendData', formData)
        .subscribe(data =>{
            this.postId=JSON.stringify(data);
            //console.log(this.postId);
            this.graphData = this.parseData(this.postId);
            if (this.graphType == 1)
                console.log('Yearly');
            else if (this.graphType == 2)
                console.log('Monthly');
            else if (this.graphType == 3)
                console.log('Seasonaly');
             else
                console.log('There was an error with the Graph Type number.');
            console.log('All the data in an array');
            console.log(this.graphData);
            console.log('Y values in an array');
                for (const productTitle in this.graphData) {
                    if (Object.prototype.hasOwnProperty.call(this.graphData, productTitle)) {
                        const data = this.graphData[productTitle];
                        //console.log(productTitle);
            //NEED TO FIX ADDING THE PRDUCT TITLE       //this.graphLabels[index] = productTitle;
                                //console.log(this.graphLabels[index]);
                        const xValues = data.x;
                        const yValues = data.y;
                        this.graphY = yValues;
                        console.log(this.graphY);
                    }
                }
        });

      // Logging all the values
        /*
      console.log('Search: ', this.search.value);
      console.log('Time unit: ', this.inputGroup.get('unit')?.value);
      console.log('Age Start: ', this.ageGroup.get('ageStart')?.value)
      console.log('Age End: ', this.ageGroup.get('ageEnd')?.value)
      console.log('Male: ',this.sexGroup.get('male')?.value)
      console.log('Female: ',this.sexGroup.get('female')?.value)
      console.log('Other Sex: ',this.sexGroup.get('otherSex')?.value)
      console.log('White: ',this.demoGroup.get('white')?.value)
      console.log('Black: ',this.demoGroup.get('black')?.value)
      console.log('Asian: ',this.demoGroup.get('asian')?.value)
      console.log('American Indian: ',this.demoGroup.get('AI')?.value)
      console.log('Pascific Islander: ',this.demoGroup.get('PI')?.value)
      console.log('Other Race: ',this.demoGroup.get('otherDemo')?.value)
      console.log('hospitalized: ',this.dispositionGroup.get('hospitalized')?.value)
      console.log('Fatality: ',this.dispositionGroup.get('fatality')?.value)
      console.log('Other Disposition: ',this.dispositionGroup.get('otherDisp')?.value)
      console.log('Home: ',this.locationGroup.get('home')?.value)
      console.log('Farm: ', this.locationGroup.get('farm')?.value)
      console.log('Street: ', this.locationGroup.get('street')?.value)
      console.log('Motor Home: ', this.locationGroup.get('MH')?.value)
      console.log('City: ', this.locationGroup.get('city')?.value)
      console.log('School: ', this.locationGroup.get('school')?.value)
      console.log('Factory: ', this.locationGroup.get('factory')?.value)
      console.log('Sport: ', this.locationGroup.get('sport')?.value)
      console.log('Other Location: ', this.locationGroup.get('otherLoc')?.value)
      */

    //pause window repathing so that I can test view the console.
    //window.location.pathname = './data';
    }

    parseData(dataString: string) {
        //const trimmedString = dataString.trim();
        const rawData: GraphData = JSON.parse(dataString);

        this.graphType = rawData.graph_type;

        const result: Record<string, { x: number[], y: number[] }> = {};

        rawData.graph_values.forEach((item: Data) => {
        const { product_title, x_value, y_value } = item;
        if (result[product_title]) {
            result[product_title].x.push(x_value);
            result[product_title].y.push(y_value);
        } else {
            result[product_title] = { x: [x_value], y: [y_value] };
        }
        });
        
        return result;
    }
  
    addDataToSend(formData: FormData) {
        formData.append('product', this.search.value!);
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
    
    private _filterLabels(label: string): string[] {
        if (label === '') {
          return this.options.slice()
        }
        const filterValue = label.toLowerCase()
        return this.options.filter(option => option.toLowerCase().includes(filterValue))
    }

    resetAll() {
        //this.search.setValue('');
        this.search.reset();
        this.inputGroup.reset();
        this.ageGroup.setValue({ageStart: 0, ageEnd: 120});
        this.sexGroup.reset();
        this.demoGroup.reset();
        this.dispositionGroup.reset();
        this.locationGroup.reset();
    }

    createChart(){
  
        this.chart = new Chart("MyChart", {
          type: 'line', //this denotes tha type of chart
    
          data: {// values on X-Axis
            labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
                            '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17' ], 
               datasets: [
                {
                    label: "Sales",
                    data: ['467','576', '572', '79', '92',
                               '574', '573', '576'],
                    backgroundColor:'limegreen',
                    borderColor: 'limegreen'
                },
                {
                    label: "Profit",
                    data: ['542', '542', '536', '327', '17',
                                '0.00', '538', '541'],
                    backgroundColor:'blue',
                    borderColor: 'blue'
                },
                {
                    label: "Loss",
                    data: ['300', '500', '400', '200', '600',
                                '800', '900', '1000'],
                    backgroundColor:'purple',
                    borderColor: 'purple'
                }  
            ]
          },
          options: {
            aspectRatio:2.5
          }
          
        });

        /*
        this.monthChart = new Chart("monthChart", {
            type: 'line', //this denotes tha type of chart
      
            data: {// values on X-Axis
              labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
                                       '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
                 datasets: [
                {
                  label: "Sales",
                  data: ['467','576', '572', '79', '92',
                                       '574', '573', '576'],
                  backgroundColor: 'blue'
                },
                {
                  label: "Profit",
                  data: ['542', '542', '536', '327', '17',
                                           '0.00', '538', '541'],
                  backgroundColor: 'limegreen'
                }  
              ]
            },
            options: {
              aspectRatio:2.5
            }
            
        });
        
        this.seasonChart = new Chart("seasonChart", {
            type: 'line', //this denotes tha type of chart
      
            data: {// values on X-Axis
              labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
                                       '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
                 datasets: [
                {
                  label: "Sales",
                  data: ['467','576', '572', '79', '92',
                                       '574', '573', '576'],
                  backgroundColor: 'blue'
                },
                {
                  label: "Profit",
                  data: ['542', '542', '536', '327', '17',
                                           '0.00', '538', '541'],
                  backgroundColor: 'limegreen'
                }  
              ]
            },
            options: {
              aspectRatio:2.5
            }
            
        });
        
        this.yearChart = new Chart("yearChart", {
            type: 'line', //this denotes tha type of chart
      
            data: {// values on X-Axis
              labels: ['2016', '2017', '2018', '2019', '2020', '2021'], 
                 datasets: [
                {
                  label: "Sales",
                  data: ['467','576', '572', '79', '92',
                                       '574', '573', '576'],
                  backgroundColor: 'blue'
                },
                {
                  label: "Profit",
                  data: ['542', '542', '536', '327', '17',
                                           '0.00', '538', '541'],
                  backgroundColor: 'limegreen'
                }  
              ]
            },
            options: {
              aspectRatio:2.5
            }
            
          });
        */
    }
}

function autocompleteStringValidator(validOptions: Array<string>): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (validOptions.indexOf(control.value) !== -1) {
        return null  /* valid option selected */
      }
      return { 'invalidAutocompleteString': { value: control.value } }
    }
}