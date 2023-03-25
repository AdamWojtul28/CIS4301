import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    isLinear = true;
    hide = true;
    regGroup: FormGroup;
    postId: string;

    constructor(private http: HttpClient, private _formBuilder: FormBuilder) {}

    ngOnInit() {
  
        this.regGroup = this._formBuilder.group({
    
            firstName: new FormControl('', Validators.required),
  
            // will need to add in a unique username checking function
            username: new FormControl('', Validators.required),
        
            password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{6,}$')]),
      
            confirmPassword: new FormControl('', Validators.required)
        });
    }
    submit(){
  
        var formData: any=new FormData();
        this.addData(formData);
        this.http.post('http://localhost:1337/users/register', formData)
        .subscribe(data =>{
          this.postId=JSON.stringify(data);
          console.log(this.postId);
        });
  
        window.location.pathname = './login';
      }
      
    addData(formData: FormData){
        formData.append('firstName', this.regGroup.get('firstName')?.value);
        formData.append('username', this.regGroup.get('username')?.value);
        formData.append('password', this.regGroup.get('pasword')?.value);
    }
}
