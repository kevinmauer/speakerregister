﻿import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Speaker } from './speaker';
import { SpeakerService } from './speaker.service';

@Component({
    templateUrl: '../../app/speaker/speakerlist.component.html'
})

export class SpeakerListComponent implements OnInit {

    errorMessage: string;
    speakers: Speaker[];

    constructor(private speakerService: SpeakerService,
                private router: Router) {
    }
    
    ngOnInit() {
        this.onGetSpeakers();
    }

    onSelect(speaker: Speaker) {
        this.router.navigate(['/speakerdetail', speaker.id]);
    }

    onGetSpeakers() {
        this.speakerService.getSpeakers()
            .subscribe(speakers => {
                    this.speakers = speakers;
                },
                (error) => {
                    this.errorMessage = error;
                }
            );
    };

    onAddSpeaker() {
        this.router.navigate(['/speakerdetail', 0]);
    }
}