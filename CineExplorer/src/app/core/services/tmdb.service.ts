import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MovieResponse, MovieDetail, GenreResponse, Credits, Genre } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.tmdbBaseUrl;

  private getCommonParams(): HttpParams {
    return new HttpParams().set('language', 'es-ES');
  }

  getPopularMovies(page: number = 1): Observable<MovieResponse> {
    const params = this.getCommonParams().set('page', page.toString());
    return this.http.get<MovieResponse>(`${this.baseUrl}/movie/popular`, { params });
  }

  getTopRatedMovies(page: number = 1): Observable<MovieResponse> {
    const params = this.getCommonParams().set('page', page.toString());
    return this.http.get<MovieResponse>(`${this.baseUrl}/movie/top_rated`, { params });
  }

  getUpcomingMovies(page: number = 1): Observable<MovieResponse> {
    const params = this.getCommonParams().set('page', page.toString());
    return this.http.get<MovieResponse>(`${this.baseUrl}/movie/upcoming`, { params });
  }

  searchMovies(query: string, page: number = 1): Observable<MovieResponse> {
    const params = this.getCommonParams()
      .set('query', query)
      .set('page', page.toString());
    return this.http.get<MovieResponse>(`${this.baseUrl}/search/movie`, { params });
  }

  getMovieDetail(id: number): Observable<MovieDetail> {
    const params = this.getCommonParams();
    return this.http.get<MovieDetail>(`${this.baseUrl}/movie/${id}`, { params });
  }

  getMovieCredits(id: number): Observable<Credits> {
    const params = this.getCommonParams();
    return this.http.get<Credits>(`${this.baseUrl}/movie/${id}/credits`, { params });
  }

  getSimilarMovies(id: number, page: number = 1): Observable<MovieResponse> {
    const params = this.getCommonParams().set('page', page.toString());
    return this.http.get<MovieResponse>(`${this.baseUrl}/movie/${id}/similar`, { params });
  }

  getGenres(): Observable<GenreResponse> {
    const params = this.getCommonParams();
    return this.http.get<GenreResponse>(`${this.baseUrl}/genre/movie/list`, { params });
  }

  getMoviesByGenre(genreId: number, page: number = 1): Observable<MovieResponse> {
    const params = this.getCommonParams()
      .set('with_genres', genreId.toString())
      .set('page', page.toString());
    return this.http.get<MovieResponse>(`${this.baseUrl}/discover/movie`, { params });
  }

  getFeaturedMovie(): Observable<MovieResponse> {
    const params = this.getCommonParams();
    return this.http.get<MovieResponse>(`${this.baseUrl}/movie/now_playing`, { params });
  }
}