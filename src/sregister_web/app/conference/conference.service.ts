﻿import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as Moment from 'moment/moment';

import { Conference } from './conference';
import { Constants } from '../config/constants';

import { HttpHelperService } from '../services/httphelper/httphelper.service';

@Injectable()

export class ConferenceService {

    private conferences: Conference[];
    errorMessage: string;
    
    constructor(private http: Http, private constants: Constants, private httpHelperService: HttpHelperService) {
        
    }

    getConferences(): Observable<Conference[]> {
        return this.loadConferences();
    }

    getConferenceById(id: number): Observable<Conference> {
        return this.http.get(this.constants.conferenceApi + '/' + id, this.httpHelperService.getAuthRequestOptionsArg())
            .map(this.extractConferenceData)
            .catch(this.handleConferenceError);
    }

    saveConference(currentConference: Conference): Observable<Conference> {

        currentConference.startDate = new Date(currentConference.startDateStr);
        currentConference.endDate = new Date(currentConference.endDateStr);

        return this.onSaveConference(currentConference);
    }

    private loadConferences(): Observable<Conference[]> {
        return this.http.get(this.constants.conferenceApi, this.httpHelperService.getAuthRequestOptionsArg())
            .map(this.extractData)
            .catch(this.handleError);
    }

    private onSaveConference(currentConference: Conference): Observable<Conference> {
        return this.http.post(this.constants.conferenceApi, JSON.stringify(currentConference), this.httpHelperService.getAuthRequestOptionsArg('json'))
            .map(this.extractData)
            .catch(this.handleConferenceError);
    }

    private extractData(res: Response): any[] {
        let body: any = res.json();
        return body || {};
    }

    private extractConferenceData(res: Response): Conference {
        let conference = new Conference();
        let body: Conference = res.json();

        if (body) {
            conference.id = body.id;
            conference.name = body.name;
            conference.location = body.location;
            conference.startDate = new Date(body.startDate);
            conference.startDateStr = Moment.utc(conference.startDate).format('YYYY-MM-DD');
            conference.endDate = new Date(body.endDate);
            conference.endDateStr = Moment.utc(conference.endDate).format('YYYY-MM-DD');
            conference.city = body.city;
            conference.state = body.state;

            return conference;
        } else {
            return new Conference();
        }
    }

    private handleError(error: any): Observable<Conference[]> {
        // in a real world app, we might use a remote logging infrastructure
        // we'd also dig deeper into the error to get a better message
        let errMsg: any = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    private handleConferenceError(error: any): Observable<Conference> {
        // in a real world app, we might use a remote logging infrastructure
        // we'd also dig deeper into the error to get a better message
        let errMsg: any = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

}