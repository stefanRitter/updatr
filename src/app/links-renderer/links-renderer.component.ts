import { Component, OnInit } from '@angular/core';

import { UpdatrLinkService } from '../updatr-link/updatr-link.service';
import { UpdatrLinkGroup }   from '../updatr-link/updatr-link-group';

@Component({
    selector: 'links-renderer',
    providers: [UpdatrLinkService],
    templateUrl: './links-renderer.component.html',
    styleUrls: ['./links-renderer.component.css']
})
export class LinksRendererComponent implements OnInit {
    updatrLinkService: UpdatrLinkService;
    linkGroups: UpdatrLinkGroup[];
    sortOrder: string;

    constructor(updatrLinkService: UpdatrLinkService) {
        this.updatrLinkService = updatrLinkService;
        this.sortOrder = 'unread';
    }

    ngOnInit() { }

    onSortChange() {
        if (this.sortOrder === 'date') {
            this.linkGroups = this.updatrLinkService.getDateUpdatedGroups();
        } else {
            this.linkGroups = this.updatrLinkService.getUnreadReadGroups();
        }
    }
}
