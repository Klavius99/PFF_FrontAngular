import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  searchResults: any[] = [];
  showResults: boolean = false;
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.searchService.searchUsers(query)),
      takeUntil(this.destroy$)
    ).subscribe(results => {
      this.searchResults = results;
      this.showResults = true;
    });
  }

  onSearch(event: any) {
    const query = event.target.value;
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  onSearchSubmit(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.searchQuery.trim()) {
      this.router.navigate(['/SearchPage'], {
        queryParams: { q: this.searchQuery }
      });
      this.showResults = false;
    }
  }

  selectUser(userId: string) {
    this.router.navigate(['/profil', userId]);
    this.showResults = false;
    this.searchQuery = '';
  }

  hideResults() {
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
