import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Photo, ResultTo } from './models';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  photos: Array<Photo> = [];
  pageIndex: number;
  pageSize: number;
  length: number;

  filterForm = new FormGroup({
    title: new FormControl(''),
    albumTitle: new FormControl(''),
    albumUserEmail: new FormControl(''),
  });

  private readonly externalApiUrl: string = 'http://localhost:3000/externalapi/photos';

  constructor(private http: HttpClient) {
    this.getServerData();
  }

  public handlePage(pageEvent: any) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.getServerData();
  }

  public getServerData() {

    this.pageIndex = this.pageIndex || 0;
    this.pageSize = this.pageSize || 25;

    this.http.get<ResultTo<Array<Photo>>>(this.externalApiUrl, {
      params: new HttpParams({
        fromObject: {
          'title': this.filterForm.controls.title.value || '',
          'album.title': this.filterForm.controls.albumTitle.value || '',
          'album.user.email': this.filterForm.controls.albumUserEmail.value || '',
          'offset': String(this.pageIndex + 1),
          'limit': String(this.pageSize)
        }
      })
    }).subscribe(data => {
      this.photos = data.data;
      this.length = data.total;
    }, error => console.error(error));
  }

  public onSubmit() {
    this.pageIndex = null;
    this.pageSize = null;
    this.getServerData();
  }
}
