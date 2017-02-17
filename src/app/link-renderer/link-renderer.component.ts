import { Component, Input, OnInit } from '@angular/core';

import { UpdatrLink }        from '../updatr-link/updatr-link';

@Component({
    selector: 'link-renderer',
    templateUrl: './link-renderer.component.html',
    styleUrls: ['./link-renderer.component.css']
})
export class LinkRendererComponent implements OnInit {
    @Input()  link: UpdatrLink;

    constructor() { }

    ngOnInit() { }

}
