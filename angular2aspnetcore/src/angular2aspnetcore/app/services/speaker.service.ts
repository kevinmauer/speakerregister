﻿import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Speaker }        from '../models/speaker';
import { Observable }     from 'rxjs/Observable';

@Injectable()

export class SpeakerService {

    private speakersUrl = 'app/testdata/speakers.json';  // URL to web API
    private speakers: Speaker[];

    errorMessage: string;

    constructor(private http: Http) {
        this.loadSpeakers()
            .subscribe(
            speakers => this.speakers = speakers,
            error => this.errorMessage = <any>error);
    }

    getSpeakers(): Speaker[] {
        return this.speakers;
    }

    getSpeakerById(id): Speaker {

        let foundSpeaker: Speaker = this.speakers.find((speaker) => speaker.id === id);

        return foundSpeaker ? foundSpeaker : new Speaker();
    }

    private loadSpeakers(): Observable<Speaker[]> {
        return this.http.get(this.speakersUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body.data || {};
    }

    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
