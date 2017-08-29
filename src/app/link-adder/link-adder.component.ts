import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { UpdatrLinkService } from '../updatr-link/updatr-link.service';


@Component({
    selector: 'link-adder',
    providers: [UpdatrLinkService],
    templateUrl: './link-adder.component.html',
    styleUrls: ['./link-adder.component.css']
})
export class LinkAdderComponent implements OnInit {
    updatrLinkService: UpdatrLinkService;
    newLink:string = 'http://';
    firstTime:boolean = false;

    @Input()  show: boolean;
    @ViewChild('urlInput') vc;

    constructor(updatrLinkService: UpdatrLinkService) {
        this.updatrLinkService = updatrLinkService;
    }

    ngOnInit() {}

    ngDoCheck() {
        if (this.show && this.firstTime) {
            setTimeout(() => this.vc.nativeElement.focus(), 105);
            this.firstTime = false;
        }
        if (!this.show) this.firstTime = true;
    }

    checkHttp() {
        if (this.newLink[0] !== 'h') {
            this.newLink = ''.concat('http://', this.newLink);
        }
    }

    onSubmit() {
        this.updatrLinkService.addUrl(this.newLink);
        this.newLink = 'http://';
    }
}
