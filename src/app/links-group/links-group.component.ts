import { Component, Input, OnInit } from '@angular/core';

import { UpdatrLink }        from '../updatr-link/updatr-link';
import { UpdatrLinkGroup }   from '../updatr-link/updatr-link-group';

@Component({
    selector: 'links-group',
    templateUrl: './links-group.component.html',
    styleUrls: ['./links-group.component.css']
})

export class LinksGroupComponent implements OnInit {
    @Input()  group: UpdatrLinkGroup;

    constructor() { }

    ngOnInit() { }

}
