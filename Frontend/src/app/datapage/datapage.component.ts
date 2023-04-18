import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidatorFn, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
// Follow these steps if you have a "Cannot find module 'chart.js/auto'" error
// 1. go to "Frontend" folder
// 2. In console type "npm install chart.js"
import { Chart } from 'chart.js/auto';

interface ProductStruct {
    product_title: string;
    y_values: number[];
}

interface graphData {
    graph_type: number;
    product_structs: ProductStruct[];
}

interface datasets_interface {
    label: string;
    data: number[];
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
        //this.createChart();

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
            //console.log(data);
            //this.postId=JSON.stringify(data);
            //console.log(this.postId);
            //this.graphData = this.parseData(this.postId);
            //console.log(this.graphData);
            
            this.graphData = data;
            console.log(this.graphData);
            this.graphType = this.graphData.graph_type;
            localStorage.setItem("Array", JSON.stringify(this.graphData));
            
            
            
            if (this.graphType == 1)
                console.log('Yearly');
            else if (this.graphType == 2)
                console.log('Monthly');
            else if (this.graphType == 3)
                console.log('Seasonaly');
            else
                console.log('There was an error with the Graph Type number.');
            
            for (let i = 0; i < this.graphData.product_structs.length; i++) {
              const product = this.graphData.product_structs[i].product_title;
              //'Product Title: ', this.graphData.product_structs[i].product_title
              console.log('Product Title: ', product);
              for (let j = 0; j < this.graphData.product_structs[i].y_values.length; j++) {
                const point = this.graphData.product_structs[i].y_values[j];
                //'Y value: ', this.graphData.product_structs[i].graph_point[j].y_value
                console.log('Y value: ', point);
              }
            }

            this.createChart(this.graphData);
        });
    }
    
    parseData(dataString: string) {
      const graphData: graphData = JSON.parse(dataString);
    
      //console.log(graphData);

      this.graphType = graphData.graph_type;
      const productStructs = graphData.product_structs.map((product: any) => {
        const productTitle = product.product_title;
        const graphPoints = product.graph_point.map((point: any) => {
          const xValue = point.x_value;
          const yValue = point.y_value;
          return { x: xValue, y: yValue };
        });
        return { product_title: productTitle, graph_point: graphPoints };
      });
    
      return { graph_type: this.graphType, product_structs: productStructs };
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
        this.inputGroup.setValue({search: '', unit: 'year'});
        this.ageGroup.setValue({ageStart: 0, ageEnd: 120});
        this.sexGroup.reset();
        this.demoGroup.reset();
        this.dispositionGroup.reset();
        this.locationGroup.reset();
    }

    createChart(graphData: any){
      let chartStatus = this.chart; // <canvas> id
      if (chartStatus != undefined) {
        chartStatus.destroy();
      }

      if (this.graphType == 1) {
        this.chart = new Chart("MyChart", {
            type: 'line', //this denotes tha type of chart
            data: {// values on X-Axis
                labels: this.yearLabels, 
                datasets: []
            },
            options: {
                aspectRatio:2.5
            }
            
        });
          //const testing: datasets_interface = 
          //    {
          //        label: "One",
          //        data: [1, 2, 3, 4, 5, 6]
          //    };
          //this.chart.data.datasets.push(testing);

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
            
            //console.log(temp);
            //console.log('HERE');
            //temp.data = tempArr;
            this.chart.data.datasets.push(temp);
          }





        // for (let i = 0; i < this.graphData.product_structs.length; i++) {
        //     this.chart.data.datasets.forEach((dataset: any) => {
        //         dataset.label = this.graphData.product_structs[i].product_title;
        //   });
          
        //   for (let j = 0; j < this.graphData.product_structs[i].graph_point.length; j++) {
        //       //this.chart.data.datasets.forEach((dataset: any) => {
        //         //dataset.data = this.graphData.product_structs[i].graph_point;
        //       this.chart.data.datasets.push(this.graphData.product_structs[i].product_title, )
        //   });
          
        //   }
          
          this.chart.update();
    } 
        // MONTHLY GRAPH
    else if (this.graphType == 2) {
        this.chart = new Chart("MyChart", {
            type: 'line', //this denotes tha type of chart
      
            data: {// values on X-Axis
                labels: this.monthLabels, 
                 datasets: [
                  {
                      label: "",
                      data: [],
                      backgroundColor:'limegreen',
                      borderColor: 'limegreen'
                  }
              ]
            },
            options: {
              aspectRatio:2.5
            }
            
        });
    }
        // SEASONAL GRAPH
    else if (this.graphType == 3) {
        this.chart = new Chart("MyChart", {
            type: 'line', //this denotes tha type of chart
      
            data: {// values on X-Axis
                labels: this.seasonLabels, 
                 datasets: [
                  {
                      label: "",
                      data: [],
                      backgroundColor:'limegreen',
                      borderColor: 'limegreen'
                  }
              ]
            },
            options: {
              aspectRatio:2.5
            }
            
        });
    }
    else {
        console.log('There was an error detecting the graph type number.');
    }

/*
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
        */
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