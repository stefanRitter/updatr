import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { UpdatrLink } from '../updatr-link/updatr-link';
import { environment } from '../../environments/environment';

// app store
var _updating:boolean = false;
var _links:UpdatrLink[] = [];
var _linksToCheck:number = 0;
var _getting:boolean = true;


// prepare data
if (!localStorage['updatr_links_store'] || localStorage['updatr_links_store'] === 'undefined') {
    localStorage['updatr_links_store'] = JSON.stringify([]);
}
_links = JSON.parse(localStorage['updatr_links_store']);
_links.forEach(function (link) {
    link.stars = parseInt(<any>link.stars, 10);
});

// handle http response
function handleResponse (response:any) {
    let body = JSON.parse(response._body)
    _links = body.links.sort(function (linkA, linkB) {
        return linkB.stars - linkA.stars;
    });
    localStorage['updatr_links_store'] = JSON.stringify(_links);

    if (body.uid) {
        let d = new Date();
        d.setTime(d.getTime() + (360 * 24 * 60 * 60 * 1000));
        let expires = "expires="+d.toUTCString();
        document.cookie = 'uid='+body.uid+';'+expires;
    }
}

// expose data access
@Injectable()
export class STORE {
    private http: Http;

    constructor(http: Http) {
        this.http = http;

        // get links
        let url = environment.server;
        if (location.pathname === '/demo') {
            url += 'demolinks';
        } else {
            url += 'links';
        }

        this.http.get(url, {withCredentials: true})
            .subscribe(
                response => handleResponse(response),
                error => this.handleError(error)
            );
    }

    setUpdating(updating:boolean) {
        _updating = updating;
    }
    getUpdating() {
        return _updating;
    }

    setLinksToCheck(linksToCheck:number) {
        _linksToCheck = linksToCheck;
    }
    getLinksToCheck() {
        return _linksToCheck;
    }

    persistLinks(links, index, link) {
        _links = links;
        let stringified = JSON.stringify(links)
        localStorage['updatr_links_store'] = stringified;

        // persist changes
        let url = environment.server + 'links';
        if (index > -1) {
            link = JSON.stringify(links[index]);
            this.http.patch(url, link, {withCredentials: true})
                .subscribe(
                    response => {},
                    error => this.handleError(error)
                );
        } else {
            link = JSON.stringify(link);
            this.http.put(url, link, {withCredentials: true})
                .subscribe(
                    response => {},
                    error => this.handleError(error)
                );
        }
    }

    getLinks() {
        return _links;
    }

    private handleError(error) {
        console.error('HTTP ERROR', error);
    }
};
