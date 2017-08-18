import { Component, OnInit } from '@angular/core';

import { UpdatrLinkService } from '../updatr-link/updatr-link.service';

import { STORE } from '../updatr-store/updatr-store';


@Component({
    selector: 'app-header',
    providers: [UpdatrLinkService],
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.css']
})

export class AppHeaderComponent implements OnInit {
    showAdder:boolean = false;
    updating:boolean = false;
    updatrLinkService: UpdatrLinkService;
    STORE: STORE;

    constructor(updatrLinkService: UpdatrLinkService, store:STORE) {
        this.updatrLinkService = updatrLinkService;
        this.STORE = store;
    }

    ngOnInit() { }

    ngDoCheck() {
        this.updating = this.STORE.getUpdating();
    }

    onUpdate() {
        if (this.STORE.getUpdating()) return;
        this.updatrLinkService.updateAllLinks();
    }

    onAdd() {
        this.showAdder = !this.showAdder;
    }
}
