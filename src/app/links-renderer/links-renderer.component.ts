import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'links-renderer',
    templateUrl: './links-renderer.component.html',
    styleUrls: ['./links-renderer.component.css']
})
export class LinksRendererComponent implements OnInit {
    linkGroupTitles: string[];
    sortOrder: string;

    constructor() {
        this.sortOrder = 'date';
        this.linkGroupTitles = ['today', 'yesterday', 'This week', 'Last Week', 'February 2017', 'January 2017', 'Older'];
    }

    ngOnInit() { }

}
