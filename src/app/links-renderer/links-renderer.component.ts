import { Component, OnInit, DoCheck } from '@angular/core';

import { UpdatrLinkService } from '../updatr-link/updatr-link.service';
import { UpdatrLinkGroup }   from '../updatr-link/updatr-link-group';

import STORE from '../updatr-store/updatr-store';


@Component({
    selector: 'links-renderer',
    providers: [UpdatrLinkService],
    templateUrl: './links-renderer.component.html',
    styleUrls: ['./links-renderer.component.css']
})
export class LinksRendererComponent implements OnInit, DoCheck {
    updatrLinkService: UpdatrLinkService;
    linkGroups: UpdatrLinkGroup[];
    showEmpty:boolean = false;
    updating:boolean = false;
    progressCount:number = 0;
    linksToCheck:number = 0;

    constructor(updatrLinkService: UpdatrLinkService) {
        this.updatrLinkService = updatrLinkService;
    }

    ngOnInit() { }

    ngDoCheck() {
        this.linkGroups = this.updatrLinkService.getUnreadReadGroups();
        this.showEmpty  = (this.linkGroups[0].links.length === 0) && (this.linkGroups[1].links.length === 0);
        this.updating   = STORE.getUpdating();
        this.linksToCheck   = STORE.getLinksToCheck();
        this.progressCount = STORE.getProgressCount();
    }
}
