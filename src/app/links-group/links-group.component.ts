import { Component, Input, OnInit } from '@angular/core';

import { UpdatrLink }        from '../updatr-link/updatr-link';
import { UpdatrLinkService } from '../updatr-link/updatr-link.service';

@Component({
    selector: 'links-group',
    templateUrl: './links-group.component.html',
    styleUrls: ['./links-group.component.css']
})

export class LinksGroupComponent implements OnInit {
    @Input()  title: string;

    constructor() { }

    ngOnInit() { }

}
