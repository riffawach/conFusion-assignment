import { Component, OnInit, ViewChild} from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
})

export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  comment: Comment;
  @ViewChild('fform') commentFormDirective;


  formErrors = {
    'comment': '',
    'author': '',
  };

  validationMessages = {
    'author': {
      'required': 'Name is required',
      'minlength': 'Name must be at least 2 characters long',
      'maxlength': 'Name cannot be over 50 characters long'
    },

    'comment': {
      'required': 'Comment is required',
      'minlength': 'Comment must be at least 4 characters long',
      'maxlength': 'Comment cannot be over 500 characters long'
    }
  }





  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder) {
      this.createForm();
     }

     createForm() {
      this.commentForm = this.fb.group({
        author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        comment: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(500)]],
      });

      this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages
    }

    onValueChanged(data?: any) {
      if (!this.commentForm) {
        return;
      }
      const form = this.commentForm;
  
      // clear previous error messages (if any)
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          this.formErrors[field] = '';
          const control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key];
              }
            }
          }
        }
      }
    }

    onSubmit() {
      this.comment = this.commentForm.value;
      console.log(this.comment);
      this.commentForm.reset({
        author: '',
        comment: '',
        rating: '',
        date: ''
      });
      this.commentFormDirective.resetForm();
    }

    ngOnInit() {
      this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
    }

    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }
    
  goBack(): void {
    this.location.back();
  }

}