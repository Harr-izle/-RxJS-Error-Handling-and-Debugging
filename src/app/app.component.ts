import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { timer, tap, switchMap, throwError, of, delay, retry, catchError } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'RxJS-Error-Handling-and-Debugging';

  loading = false;
  response: string | null = null;
  error: string | null = null;

  makeRequest() {
    this.loading = true;
    this.response = null;
    this.error = null;

    const randomError = Math.random() > 0.5;

    timer(1000)
      .pipe(
        tap(() => console.log('Request initiated')),
        switchMap(() => randomError ? throwError(() => new Error('Request failed')) : of('Request successful')),
        delay(500), 
        retry({count: 3, delay: (retryAttempt) => timer(retryAttempt * 1000)}),
        catchError((err) => {
          console.error('Error:', err);
          this.error = 'Server Down. Try again later.';
          return of();
        }),
        tap({
          next: (res) => console.log('Request succeeded:', res),
          error: (err) => console.log('Error during retry:', err),
          complete: () => console.log('Request completed')
        })
      )
      .subscribe({
        next: (res) => {
          this.response = res;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message;
          this.loading = false;
        }
      });
  }

}
