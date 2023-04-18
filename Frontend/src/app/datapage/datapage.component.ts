import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidatorFn, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
// Follow these steps if you have a "Cannot find module 'chart.js/auto'" error
// 1. go to "Frontend" folder
// 2. In console type "npm install chart.js"
import { Chart } from 'chart.js/auto';

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
    inputGroup: FormGroup;
    sexGroup: FormGroup;
    ageGroup: FormGroup;
    demoGroup: FormGroup;
    dispositionGroup: FormGroup;
    locationGroup: FormGroup;
    filteredOptions: Observable<string[]>;
    chart: any;
    graphData: any;
    graphType: number;

    options: string[] = ["ACIDS",
    "ADHESIVES",
    "AIRCRAFT",
    "ANTIFREEZE",
    "ANTIHISTAMINES",
    "ASHTRAYS",
    "BATONS",
    "BATTERIES",
    "BENCHES",
    "BLEACHERS",
    "BOILERS",
    "CATHETERS",
    "CAUSTICS",
    "CHARCOAL",
    "CLOCKS",
    "CLOTHESBRUSHES",
    "CLOTHESPINS",
    "COINS",
    "CORKSCREWS",
    "COTS",
    "DEHUMIDIFIERS",
    "DIAPERS",
    "DISHWASHERS",
    "DOORSTOPS",
    "ESCALATORS",
    "EYEGLASSES",
    "EYELINERS",
    "FANS",
    "FILTERS",
    "FIREWORKS",
    "FLARES",
    "FOOTLOCKERS",
    "FOOTWEAR",
    "FUTONS",
    "GASOLINE",
    "HACKSAWS",
    "HAMMERS",
    "HAMMOCKS",
    "HOUSEPLANTS",
    "HUMIDIFIERS",
    "INCINERATORS",
    "JEWELRY",
    "JIGSAWS",
    "JUICERS",
    "KEROSENE",
    "LASERS",
    "LEVELS",
    "LOCKERS",
    "LUBRICANTS",
    "LUGGAGE",
    "LYE",
    "MARBLES",
    "MATCHBOOKS",
    "NIGHTWEAR",
    "OUTERWEAR",
    "PESTICIDES",
    "PILLOWS",
    "PLAYPENS",
    "POLES",
    "PROJECTORS",
    "REAMERS",
    "REFRIGERATORS",
    "ROTISSERIES",
    "SAFES",
    "SAUNAS",
    "SCAFFOLDING",
    "SCREWDRIVERS",
    "SEEDS",
    "SINKS",
    "SLEDS",
    "SLIPCOVERS",
    "SOAPS",
    "STANCHIONS",
    "STEPLADDERS",
    "STILTS",
    "TARPAULINS",
    "TELEVISIONS",
    "TOASTERS",
    "TOBOGGANS",
    "TOILETS",
    "TRAINS",
    "TRAMPOLINES",
    "TRICYCLES",
    "TURPENTINE",
    "UMBRELLAS",
    "UNICYCLES",
    "VAPORIZERS",
    "WALLPAPER",
    "WATCHES",
    "WHEELCHAIRS"];

    yearLabels: string[] = ['2016', '2017', '2018', '2019', '2020', '2021'];
    monthLabels: string[] = ['Jan 2016', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
                             'Jan 2017', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
                             'Jan 2018', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
                             'Jan 2019', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
                             'Jan 2020', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
                             'Jan 2021', 'Feb', 'Mar', 'Apr', 'May','June','July','Aug','Sept','Oct','Nov','Dec',];
    seasonLabels: string[] = ['Winter 2016', 'Spring', 'Summer', 'Fall',
                              'Winter 2017', 'Spring', 'Summer', 'Fall',
                              'Winter 2018', 'Spring', 'Summer', 'Fall',
                              'Winter 2019', 'Spring', 'Summer', 'Fall',
                              'Winter 2020', 'Spring', 'Summer', 'Fall',
                              'Winter 2021', 'Spring', 'Summer', 'Fall',];

    public search = new FormControl('', { validators: [autocompleteStringValidator(this.options), Validators.required] });

    public validation_msgs = {
        'search': [
            { type: 'invalidAutocompleteString', message: 'Product not recognized.' },
            { type: 'required', message: 'Product is required.' }
        ]
    };

    constructor(private http: HttpClient, private _formBuilder: FormBuilder) {}

    ngOnInit() {
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
            this.graphData = data;
            console.log(this.graphData);
            this.graphType = this.graphData.graph_type;
            
            if (this.graphType == 0) 
                console.log('Empty Query... no graph');
            else if (this.graphType == 1)
                console.log('Yearly');
            else if (this.graphType == 2)
                console.log('Monthly');
            else if (this.graphType == 3)
                console.log('Seasonaly');
            else
                console.log('There was an error with the Graph Type number.');
            
            if (this.graphType != 0) {
                for (let i = 0; i < this.graphData.product_structs.length; i++) {
                    const product = this.graphData.product_structs[i].product_title;
                    console.log('Product Title: ', product);
                    for (let j = 0; j < this.graphData.product_structs[i].y_values.length; j++) {
                        const point = this.graphData.product_structs[i].y_values[j];
                        console.log('Y value: ', point);
                    }
                }
                this.createChart(this.graphData);
            }
        });
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
        this.search.reset();
        this.inputGroup.setValue({search: '', unit: 'year'});
        this.ageGroup.setValue({ageStart: 0, ageEnd: 120});
        this.sexGroup.reset();
        this.demoGroup.reset();
        this.dispositionGroup.reset();
        this.locationGroup.reset();
    }

    createChart(graphData: any) {
        let chartStatus = this.chart;
        if (chartStatus != undefined) {
            chartStatus.destroy();
        }

        if (this.graphType == 0) {
            console.log('Empty query graph should be empty.');
        }
        else if (this.graphType == 1) {
            this.chart = new Chart("MyChart", {
            type: 'line', 
            data: {
                labels: this.yearLabels, 
                datasets: []
            },
            options: {
                  aspectRatio:2.5
            }  
            });
  
            for (let i = 0; i < this.graphData.product_structs.length; i++) {
                var tempArr:number[] = new Array(this.graphData.product_structs[i].y_values.length);
                
                for (let j = 0; j < this.graphData.product_structs[i].y_values.length; j++) {
                    tempArr[j] = this.graphData.product_structs[i].y_values[j].y_value;
                }

                console.log(tempArr);
                var temp = {
                    label: this.graphData.product_structs[i].product_title,
                    data: tempArr
                };
                this.chart.data.datasets.push(temp);
            }
                this.chart.update();
        }
          // MONTHLY GRAPH
        else if (this.graphType == 2) {
            this.chart = new Chart("MyChart", {
                type: 'line',
                data: {
                    labels: this.monthLabels, 
                    datasets: []
                },
                options: {
                      aspectRatio:2.5
                }  
                });
      
                for (let i = 0; i < this.graphData.product_structs.length; i++) {
                    var tempArr:number[] = new Array(this.graphData.product_structs[i].y_values.length);
                    
                    for (let j = 0; j < this.graphData.product_structs[i].y_values.length; j++) {
                        tempArr[j] = this.graphData.product_structs[i].y_values[j].y_value;
                    }
    
                    console.log(tempArr);
                    var temp = {
                        label: this.graphData.product_structs[i].product_title,
                        data: tempArr
                    };
                    this.chart.data.datasets.push(temp);
                }
                    this.chart.update();
        }
            // SEASONAL GRAPH
        else if (this.graphType == 3) {
            this.chart = new Chart("MyChart", {
                type: 'line',
                data: {
                    labels: this.seasonLabels, 
                    datasets: []
                },
                options: {
                      aspectRatio:2.5
                }  
                });
      
                for (let i = 0; i < this.graphData.product_structs.length; i++) {
                    var tempArr:number[] = new Array(this.graphData.product_structs[i].y_values.length);
                    
                    for (let j = 0; j < this.graphData.product_structs[i].y_values.length; j++) {
                        tempArr[j] = this.graphData.product_structs[i].y_values[j].y_value;
                    }
    
                    console.log(tempArr);
                    var temp = {
                        label: this.graphData.product_structs[i].product_title,
                        data: tempArr
                    };
                    this.chart.data.datasets.push(temp);
                }
                    this.chart.update();
        }
        else {
            console.log('There was an error detecting the graph type number.');
        }
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