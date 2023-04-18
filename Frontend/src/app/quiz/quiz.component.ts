import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { MatDialog } from '@angular/material/dialog';

interface Question {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

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
  }






  questions: Question[] = [
    {
      question: 'Which year had the most product related injury cases between the years 2016 and 2019?',
      answers: ['2016', '2017', '2018', '2019'],
      correctAnswerIndex: 1
    },
    {
      question: 'Which year had the least product related injury cases between the years 2018 and 2021?',
      answers: ['2018', '2019', '2020', '2021'],
      correctAnswerIndex: 2
    },
    {
      question: 'Which of the following sports related products is NOT with the top 25 products that accounted for the most injuries to people between 2016 and 2021?',
      answers: ['FOOTBALL (ACTIVITY, APPAREL OR EQUIPMENT)', 'BASKETBALL (ACTIVITY, APPAREL OR EQUIPMENT)', 'BASEBALL (ACTIVITY, APPAREL OR EQUIPMENT)', 'HOCKEY (ACTIVITY, APPAREL OR EQUIPMENT)'],
      correctAnswerIndex: 3
    },
    {
      question: 'Which of the following furniture related products is NOT in the top 25 products that accounted for the most injuries to people between 2016 and 2021?',
      answers: ['CHAIRS, OTHER OR NOT SPECIFIED', 'CABINETS, RACKS, ROOM DIVIDERS AND SHELVES, NEC', 'BEDS OR BEDFRAMES, OTHER OR NOT SPECIFIED', 'DESKS, OTHER OR NOT SPECIFIED'],
      correctAnswerIndex: 3
    },
    {
      question: 'Which of these is NOT among the products that appear in the top 5 most dangerous products in every month between January 2016 and December 2021?',
      answers: ['BATHTUBS OR SHOWERS', 'BEDS OR BEDFRAMES, OTHER OR NOT SPECIFIED', 'FLOORS OR FLOORING MATERIALS', 'STAIRS OR STEPS'],
      correctAnswerIndex: 1
    },
    {
      question: 'Which products did NOT have 25% or more of all of their cases resulting in hospitalization/morality?',
      answers: ['FIRE ESCAPE DEVICES', 'SCUBA DIVING (ACTIVITY, APPAREL OR EQUIPMENT)', 'ALL TERRAIN VEHICLES ATV (# OF WHEELS UNSPECIFIED/OFF ROAD)', 'BICYCLES AND ACCESSORIES, (EXCL.MOUNTAIN OR ALL-TERRAIN)'],
      correctAnswerIndex: 3
    },
    {
      question: 'Which product’s yearly percentage of hospitalizations/mortalities for fatal products increased every year from 2016 to 2021?',
      answers: ['< 5 POISONINGS - NO OTHER CODE', 'TOILETS', 'TREE STANDS (HUNTING)', 'FIRE ESCAPE DEVICES'],
      correctAnswerIndex: 2
    },
    {
      question: 'Of the products with 50% of their total cases occurring in the Summer between 2016 and 2021, which had the least number of cases when combining all of their summers?',
      answers: ['SWIMMING (ACTIVITY, APPAREL OR EQUIPMENT)', 'FIREWORKS', 'OUTDOOR AWNINGS OR SHUTTERS', 'DARTS, LAWN (ACTIVITY OR EQUIPMENT)'],
      correctAnswerIndex: 3
    },
    {
      question: 'Which products (where 50% of their total cases occur in one season between Winter 2016 and Winter 2021) have multiple seasons with over 1000 injuries?',
      answers: ['SWIMMING (ACTIVITY, APPAREL OR EQUIPMENT)', 'SNOW SKIING (ACTIVITY, APPAREL OR EQUIPMENT)', 'SNOWBOARDING (ACTIVITY, APPAREL OR EQUIPMENT)', 'FIREWORKS'],
      correctAnswerIndex: 0
    },
    {
      question: 'Which house product resulted in the most hospitalizations/deaths between January 2016 and December 2021?',
      answers: ['BATHTUBS OR SHOWERS', 'BEDS OR BEDFRAMES, OTHER OR NOT SPECIFIED', 'FLOORS OR FLOORING MATERIALS', 'STAIRS OR STEPS'],
      correctAnswerIndex: 2
    }
  ];

  currentQuestionNumber = 0;
  selectedAnswerIndex: number | null = null;
  showInfo = false;
  result = '';

  getCurrentQuestion(): Question {
    return this.questions[this.currentQuestionNumber];
  }

  checkAnswer(answerIndex: number): void {
    this.selectedAnswerIndex = answerIndex;
    if (answerIndex === this.getCurrentQuestion().correctAnswerIndex) {
      this.result = 'Correct!';
    } else {
      this.result = 'Incorrect';
    }
  }

  goToNextQuestion(): void {
    this.currentQuestionNumber++;
    this.selectedAnswerIndex = null;
    this.result = '';
  }

  goToPreviousQuestion(): void {
    this.currentQuestionNumber--;
    this.selectedAnswerIndex = null;
    this.result = '';
  }
}