import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'link-adder',
    templateUrl: './link-adder.component.html',
    styleUrls: ['./link-adder.component.css']
})
export class LinkAdderComponent implements OnInit {
    newLink: string;

    constructor() {
        this.newLink = "http://";
    }

    ngOnInit() { }

    onSubmit() {
        alert(this.newLink);
        this.newLink = 'http://';
    }
}
