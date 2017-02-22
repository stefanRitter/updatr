import { Component, Input, OnInit } from '@angular/core';

import { UpdatrLinkService } from '../updatr-link/updatr-link.service';
import { UpdatrLink }        from '../updatr-link/updatr-link';

@Component({
    selector: 'link-renderer',
    providers: [UpdatrLinkService],
    templateUrl: './link-renderer.component.html',
    styleUrls: ['./link-renderer.component.css']
})
export class LinkRendererComponent implements OnInit {
    updatrLinkService: UpdatrLinkService;

    @Input()  link: UpdatrLink;

    constructor(updatrLinkService: UpdatrLinkService) {
        this.updatrLinkService = updatrLinkService;
    }

    ngOnInit() { }

    onDelete() {
        if(confirm(`Are you sure you want to delete ${this.link.url} ?`)) {
            this.updatrLinkService.removeUrl(this.link.url);
        }
    }

    onToggleRead() {
        this.updatrLinkService.toggleReadUrl(this.link.url);
    }

    onToggleStar() {
        this.updatrLinkService.toggleStarUrl(this.link.url);
    }
}
