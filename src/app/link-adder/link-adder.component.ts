import { Component, OnInit } from '@angular/core';
import { UpdatrLinkService } from '../updatr-link/updatr-link.service';

@Component({
    selector: 'link-adder',
    providers: [UpdatrLinkService],
    templateUrl: './link-adder.component.html',
    styleUrls: ['./link-adder.component.css']
})
export class LinkAdderComponent implements OnInit {
    updatrLinkService: UpdatrLinkService;
    newLink: string;

    constructor(updatrLinkService: UpdatrLinkService) {
        this.updatrLinkService = updatrLinkService;
        this.newLink = "http://";
    }

    ngOnInit() { }

    onSubmit() {
        this.updatrLinkService.addUrl(this.newLink);
        this.newLink = 'http://';
    }
}
