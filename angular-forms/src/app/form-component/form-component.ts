import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  // ← IMPORTAR HttpClient
@Component({
  selector: 'app-form-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-component.html',
  styleUrl: './form-component.css',
})
export class FormComponent {
  
  form: FormGroup

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.buildForm();
    /*this.form.valueChanges.pipe(
      debounceTime(10000)
    ).subscribe(value => {
      console.log(value);
  });*/
    
  }


    private buildForm() {
      this.form = this.formBuilder.group({
      name : new FormControl('', [Validators.required, Validators.maxLength(100)]),
      number: new FormControl('',[Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      date: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required, Validators.email, Validators.minLength(10)]),
      category: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      text: new FormControl('', [Validators.required, Validators.maxLength(1000), Validators.minLength(100)]),
      terms: new FormControl(false, [Validators.requiredTrue])

      });
    }
    save(event: Event) {
      event.preventDefault();
      const value = this.form.value;
      
      // ENVIAR DATOS AL BACKEND (puerto 7500)
      this.http.post('http://localhost:7500/api/formulario', value)
        .subscribe(
          (response: any) => {
            //  SI FUNCIONA: ver respuesta en consola
            console.log(' Datos guardados exitosamente:', response);
            alert('Formulario guardado correctamente');
            this.form.reset(); // Limpiar formulario
          },
          (error: any) => {
            // SI HAY ERROR: ver error en consola
            console.error(' Error al guardar:', error);
            alert('Error al guardar el formulario');
          }
        );
    }


}
