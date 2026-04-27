import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { QuillModule } from 'ngx-quill';
import { Question } from '../../core/models/question.model';
import { AnyArrayPipe } from '../../shared/pipes/any-array.pipe';
import Quill from 'quill';

// @ts-ignore
import ImageResize from '@mgreminger/quill-image-resize-module';
import { ThemeService } from '../../core/services/theme.service';

Quill.register('modules/imageResize', ImageResize);

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatExpansionModule,
    QuillModule,
    AnyArrayPipe
  ],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {
  themeService = inject(ThemeService);

  questions = signal<Question[]>([]);

  quillConfig = {
    imageResize: {},
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ]
  };

  addQuestion() {
    this.questions.update(prev => [
      ...prev,
      {
        type: 'multiple',
        question: '',
        correct_answer: '',
        incorrect_answers: ['', '']
      }
    ]);
  }

  removeQuestion(index: number) {
    this.questions.update(prev => prev.filter((_, i) => i !== index));
  }

  addIncorrectAnswer(qIndex: number) {
    const qs = [...this.questions()];
    qs[qIndex].incorrect_answers.push('');
    this.questions.set(qs);
  }

  removeIncorrectAnswer(qIndex: number, aIndex: number) {
    const qs = [...this.questions()];
    qs[qIndex].incorrect_answers.splice(aIndex, 1);
    this.questions.set(qs);
  }

  addCorrectAnswer(qIndex: number) {
    const qs = [...this.questions()];
    const q = qs[qIndex];
    if (Array.isArray(q.correct_answer)) {
      q.correct_answer.push('');
    } else {
      q.correct_answer = [q.correct_answer, ''];
    }
    this.questions.set(qs);
  }

  removeCorrectAnswer(qIndex: number, caIndex: number) {
    const qs = [...this.questions()];
    const q = qs[qIndex];
    if (Array.isArray(q.correct_answer)) {
      q.correct_answer.splice(caIndex, 1);
    }
    this.questions.set(qs);
  }

  updateCorrectAnswer(qIndex: number, caIndex: number, value: string) {
    const qs = [...this.questions()];
    const q = qs[qIndex];
    if (Array.isArray(q.correct_answer)) {
      q.correct_answer[caIndex] = value;
    }
    this.questions.set(qs);
  }

  onTypeChange(qIndex: number) {
    const qs = [...this.questions()];
    const q = qs[qIndex];
    if (q.type === 'multiple-correct' && !Array.isArray(q.correct_answer)) {
      q.correct_answer = [q.correct_answer as string];
    } else if (q.type !== 'multiple-correct' && Array.isArray(q.correct_answer)) {
      q.correct_answer = q.correct_answer[0] || '';
    }
    this.questions.set(qs);
  }

  importJSON(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = JSON.parse(e.target.result);
        this.questions.set(data);
      } catch (err) {
        alert('Erro ao processar JSON');
      }
    };
    reader.readAsText(file);
  }

  trimOneP(val: string) {
    const trimed = val.trim().match(/<p\b[^>]*>.*?<\/p>/gi)?.length === 1 ?
      val.trim().replace(/^<p>/g, '').replace(/<\/p>$/g, '') :
      val.trim();
    return trimed.replace(/(?<!&nbsp;)&nbsp;(?!&nbsp;)/g, ' ');
  }

  exportJSON() {
    const questions = this.questions().map(question => {
      question.question = this.trimOneP(question.question);
      if(typeof question.correct_answer === 'string') question.correct_answer = this.trimOneP(question.correct_answer);
      else if(Array.isArray(question.correct_answer)) question.correct_answer = question.correct_answer.map(ans => this.trimOneP(ans));
      question.incorrect_answers = question.incorrect_answers.map(ans => this.trimOneP(ans));
      return question;
    });
    const dataStr = JSON.stringify(questions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'questoes.json';
    link.click();
  }

  // Helper for ngFor with strings
  trackByFn(index: any, item: any) {
    return index;
  }
}
