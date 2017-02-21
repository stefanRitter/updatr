import { Component, OnInit } from '@angular/core';

import { UpdatrLinkService } from '../updatr-link/updatr-link.service';

@Component({
    selector: 'app-header',
    providers: [UpdatrLinkService],
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.css']
})

export class AppHeaderComponent implements OnInit {

    updatrLinkService: UpdatrLinkService;

    constructor(updatrLinkService: UpdatrLinkService) {
        this.updatrLinkService = updatrLinkService;
    }

    ngOnInit() { }

    onUpdate() {
        this.updatrLinkService.updateAllLinks();
    }
}
