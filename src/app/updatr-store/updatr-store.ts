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
if (!localStorage['updatr_links_store']) {
    localStorage['updatr_links_store'] = JSON.stringify([]);
}
_links = JSON.parse(localStorage['updatr_links_store']);
_links.forEach(function (link) {
    link.stars = parseInt(<any>link.stars, 10);
});

// handle http response
function handleResponse (response:any) {
    _links = JSON.parse(response._body);
    localStorage['updatr_links_store'] = response._body;
}
function handleError (err:Error) {
    console.error('HTTP ERROR', err);
}

// expose data access
@Injectable()
export class STORE {
    private http: Http;

    constructor(http: Http) {
        this.http = http;

        // get links
        let url = environment.server + 'links';
        this.http.get(url, {withCredentials: true})
            .subscribe(
                response => handleResponse(response),
                error => handleError(error)
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

    persistLinks(links, index) {
        _links = links;
        let stringified = JSON.stringify(links)
        localStorage['updatr_links_store'] = stringified;

        // persist new link
        let url = environment.server + 'links';

        if (index > -1) {
            let link = JSON.stringify(links[index]);
            this.http.patch(url, link, {withCredentials: true})
                .subscribe(
                    response => {},
                    error => handleError(error)
                );
        } else {
            this.http.post(url, stringified, {withCredentials: true})
                .subscribe(
                    response => handleResponse(response),
                    error => handleError(error)
                );
        }
    }

    getLinks() {
        return _links;
    }
};
