import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Film } from 'src/entities/film';
import { FilmsServerService } from 'src/services/films-server.service';
import { Clovek } from 'src/entities/clovek';
import { OmdbPosterService } from 'src/services/omdb-poster.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-film-detail',
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.css']
})
export class FilmDetailComponent implements OnInit, AfterViewInit {
  @Input('id') filmId: string;
  film: Film;
  text: string;
  reziseri: string[];
  herci: UpravenyHerec[];
  imageToShow: any;
  columnsToDisplay = [
    "postava",
    "herec",
    "dolezitost"
  ];
  dataSource = new MatTableDataSource<UpravenyHerec>();

  constructor(
    private filmsServerService: FilmsServerService,
    private omdbPosterService: OmdbPosterService) { }

    ngOnInit(): void {
     this.getFilmDetails();
  }

  getFilmDetails(): Promise<any> {
    const upraveneMeno = (clovek: Clovek) => {
      return clovek.krstneMeno + (clovek.stredneMeno ? " " + clovek.stredneMeno + " " : " ") + clovek.priezvisko
    }
    return new Promise<any>((resolve, reject) => {
      this.filmsServerService.getFilm(this.filmId).subscribe((film: Film) => {
        this.film = film;

        this.reziseri = film.reziser.map(reziser =>
          upraveneMeno(reziser)
        );

        this.herci = film.postava.map(herec =>
          ({
            postava: herec.postava, dolezitost: herec.dolezitost, herec: upraveneMeno(herec.herec)
          })
        )
        this.dataSource.data = this.herci;
        this.omdbPosterService.getPoster(film.nazov).then(data => {//treba tu este dat nazov filmu
          this.createImageFromBlob(data);
          resolve();
        }, error => {
          this.imageToShow = 'OMDB nemá tento obrázok';
          resolve();
        });
      })
    })

  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  ngAfterViewInit(): void {

  }
}

interface UpravenyHerec {
  postava: string,
  dolezitost: "hlavná postava" | "vedľajšia postava",
  herec: string
}