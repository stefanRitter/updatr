import { Injectable, ApplicationRef } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';

import { UpdatrLink } from './updatr-link';
import { UpdatrLinkGroup } from './updatr-link-group';

import { similarity } from './similarity';
import { Batch } from './batch';

import STORE from '../updatr-store/updatr-store';


@Injectable()
export class UpdatrLinkService {
    private http: Http;
    private applicationRef: ApplicationRef;
    private firstSort: boolean = true;

    constructor(applicationRef: ApplicationRef, http: Http) {
        this.applicationRef = applicationRef;
        this.http = http;
        window['similarity'] = similarity;
    }

    addUrl(url: string) {
        let links = this.getData();

        // don't allow dups
        let index = this.findUrl(url, links);
        if (index > -1) return alert('This link is already in the list...');

        // persist new link
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let newLink = new UpdatrLink(url);

        links.unshift(newLink);
        this.persistLinks(links);

        this.http.get(url, options)
            .subscribe(
                response => this.handleResponse(response, newLink, null),
                error => this.handleError(error, null)
            );
    }

    removeUrl(url: string) {
        let links = this.getData();

        // find url
        let index = this.findUrl(url, links);
        if (index === -1) return;

        // remove & persist
        links.splice(index, 1);
        this.persistLinks(links);
    }

    toggleReadUrl(url: string) {
        let links = this.getData();

        // find url
        let index = this.findUrl(url, links);
        if (index === -1) return;

        // udpate & persist
        links[index].visited = true;
        this.persistLinks(links);
    }

    toggleStarUrl(url: string) {
        let links = this.getData();

        // find url
        let index = this.findUrl(url, links);
        if (index === -1) return;

        // udpate & persist
        let stars = links[index].stars + 1;
        if (stars > 2) stars = 0;
        links[index].stars = stars;
        this.persistLinks(links);
    }

    updateLink(link: UpdatrLink) {
        let links = this.getData();

        // find url
        let index = this.findUrl(link.url, links);
        if (index === -1) return;

        // udpate & persist
        links[index] = link;
        this.persistLinks(links);
    }

    getUnreadReadGroups() {
        let links = this.getData();
        if (this.firstSort) {
            links = links.sort(function (linkA, linkB) {
                return linkB.stars - linkA.stars;
            });
            STORE.persistLinks(links);
            this.firstSort = false;
        }

        let unread = new UpdatrLinkGroup();
        let read = new UpdatrLinkGroup();

        unread.links = links.filter(function (link:UpdatrLink) {
            return !link.visited;
        });
        read.links = links.filter(function (link:UpdatrLink) {
            return link.visited;
        });

        return [unread, read];
    }

    updateAllLinks() {
        STORE.setUpdating(true);

        var visitedLinks = this.getData().filter(function (link) { return link.visited; });
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var options = new RequestOptions({ headers: headers });
        var http = this.http;
        var handleResponse = this.handleResponse;
        var handleError = this.handleError;
        var batch = new Batch();
        var that = this;

        visitedLinks.forEach(function(link:UpdatrLink) {
            batch.push(function(done) {
                http.get(link.url, options).subscribe(
                    response => handleResponse.call(that, response, link, done),
                    error => handleError.call(that, error, done)
                );
            });
        });

        batch.onProgress(function (count, link) {
            console.log('progress:', count, link.url);
            STORE.setProgressCount(count);
        });

        batch.onEnd(function() { STORE.setUpdating(false); });
        batch.start();
    }

    private handleResponse(response, newLink, done) {
        if (response.status === 200) {
            newLink.loading = false;
            let newHtml = response._body.split('body')[1];
            let sim = similarity(newLink.html, newHtml)
            if (sim < 0.9) {
                newLink.html = newHtml;
                newLink.updatedOn = (new Date()).toString();
                newLink.visited = false;
            }
            this.updateLink(newLink);
        } else {
            this.handleError(response, null);
        }
        if (done) {done(newLink);}
    }

    private handleError(err:Error, done) {
        console.error('HTTP ERROR', err);
        if (done) {done({});}
    }

    private getData() {
        return STORE.getLinks();
    }

    private persistLinks(links) {
        STORE.persistLinks(links);
        this.applicationRef.tick();
    }

    private findUrl(url:string, links) {
        let index = -1;
        links.forEach(function (link:UpdatrLink, i:number) { if (link.url === url) index = i; });
        return index;
    }
}
