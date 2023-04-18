import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-result-page',
  templateUrl: './result-page.component.html',
  styleUrls: ['./result-page.component.css']
})
export class ResultPageComponent {
    public chart: any;
    public monthChart: any;
    public seasonChart: any;
    public yearChart: any;
    ngOnInit() {
        


        this.createChart();
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

        console.log(this.chart.data.datasets);
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