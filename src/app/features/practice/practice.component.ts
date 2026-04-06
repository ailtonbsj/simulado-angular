import { Component, ElementRef, ViewChild, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Question, PracticeResult } from '../../core/models/question.model';
import { Chart, registerables } from 'chart.js';
import html2canvas from 'html2canvas';

import { questions } from './questions-list';

Chart.register(...registerables);

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css']
})
export class PracticeComponent {
  @ViewChild('resultsSection') resultsSection!: ElementRef;
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  private chart: Chart | null = null;

  studentName = '';
  importUrl = '';
  importType: 'file' | 'url' | 'example' = 'example';
  selectedExample = '';

  questions = signal<Question[]>([]);
  currentQuestionIndex = signal(0);
  randomizedOptions = signal<string[]>([]);
  selectedAnswers = signal<Record<number, string | string[]>>({});
  showAnswer = signal(false);
  isFinished = signal(false);

  examples = questions as { name: string, url: string }[];

  currentQuestion = computed(() => this.questions()[this.currentQuestionIndex()]);
  progress = computed(() => {
    if (this.questions().length === 0) return 0;
    return (this.currentQuestionIndex() / this.questions().length) * 100;
  });

  results = computed<PracticeResult | null>(() => {
    if (!this.isFinished()) return null;
    
    const questions = this.questions();
    const selectedAnswers = this.selectedAnswers();
    const studentName = this.studentName;

    const answers = questions.map((q, idx) => {
      const selected = selectedAnswers[idx];
      const correct = Array.isArray(q.correct_answer) ? q.correct_answer : [q.correct_answer];

      let isCorrect = false;
      if (Array.isArray(selected)) {
        isCorrect = selected.length === correct.length && selected.every(s => correct.includes(s));
      } else {
        isCorrect = correct.includes(selected as string);
      }

      return {
        question: q.question,
        selected: selected,
        isCorrect: isCorrect
      };
    });

    const correctCount = answers.filter(a => a.isCorrect).length;
    const totalCount = questions.length;

    return {
      studentName: studentName,
      totalQuestions: totalCount,
      correctAnswers: correctCount,
      incorrectAnswers: totalCount - correctCount,
      percentage: totalCount > 0 ? (correctCount / totalCount) * 100 : 0,
      answers: answers
    };
  });

  loadJSON(type: 'file' | 'url' | 'example', event?: any) {
    if (type === 'example') {
      const example = this.examples.find(e => e.name === this.selectedExample);
      if(example) {
        fetch(example.url)
          .then(res => res.json())
          .then(data => this.startPractice(data))
          .catch(err => alert('Erro ao carregar URL'));
      }
    } else if (type === 'file') {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = JSON.parse(e.target.result);
        this.startPractice(data);
      };
      reader.readAsText(file);
    } else if (type === 'url') {
      fetch(this.importUrl)
        .then(res => res.json())
        .then(data => this.startPractice(data))
        .catch(err => alert('Erro ao carregar URL'));
    }
  }

  startPractice(data: Question[]) {
    this.questions.set(data);
    this.currentQuestionIndex.set(0);
    this.selectedAnswers.set({});
    this.showAnswer.set(false);
    this.isFinished.set(false);
    this.setupQuestion();
  }

  setupQuestion() {
    const q = this.currentQuestion();
    if (!q) return;

    const options = [
      ...(Array.isArray(q.correct_answer) ? q.correct_answer : [q.correct_answer]),
      ...q.incorrect_answers
    ];
    this.randomizedOptions.set(this.shuffle(options));
    this.showAnswer.set(false);
  }

  shuffle(array: any[]) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  onAnswerChange(value: string | string[]) {
    const currentIdx = this.currentQuestionIndex();
    this.selectedAnswers.update(prev => ({ ...prev, [currentIdx]: value }));
  }

  toggleCheckbox(option: string) {
    const currentIdx = this.currentQuestionIndex();
    const currentSelection = (this.selectedAnswers()[currentIdx] as string[]) || [];
    let newSelection: string[];

    if (currentSelection.includes(option)) {
      newSelection = currentSelection.filter(o => o !== option);
    } else {
      newSelection = [...currentSelection, option];
    }

    this.onAnswerChange(newSelection);
  }

  isOptionSelected(option: string): boolean {
    const selection = this.selectedAnswers()[this.currentQuestionIndex()];
    if (Array.isArray(selection)) {
      return selection.includes(option);
    }
    return selection === option;
  }

  viewAnswer() {
    this.showAnswer.set(true);
  }

  nextQuestion() {
    if (this.currentQuestionIndex() < this.questions().length - 1) {
      this.currentQuestionIndex.update(v => v + 1);
      this.setupQuestion();
    } else {
      this.finishPractice();
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update(v => v - 1);
      this.setupQuestion();
    }
  }

  finishPractice() {
    this.isFinished.set(true);
    // Use requestAnimationFrame or enough timeout to ensure DOM is updated
    setTimeout(() => this.renderChart(), 200);
  }

  renderChart() {
    const res = this.results();
    if (!res || !this.chartCanvas) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Corretas', 'Incorretas'],
        datasets: [{
          data: [res.correctAnswers, res.incorrectAnswers],
          backgroundColor: ['#4caf50', '#f44336']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  isArray(val: any): val is any[] {
    return Array.isArray(val);
  }

  async downloadResults() {
    if (!this.resultsSection) return;
    
    try {
      const element = this.resultsSection.nativeElement;
      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = `resultado-${this.studentName || 'estudante'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error downloading results:', err);
      alert('Erro ao gerar o download do resultado.');
    }
  }
}
