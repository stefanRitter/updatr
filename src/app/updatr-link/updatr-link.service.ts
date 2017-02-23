import { Injectable, ApplicationRef } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';

import { UpdatrLink } from './updatr-link';
import { UpdatrLinkGroup } from './updatr-link-group';

import { similarity } from './similarity';
import { Batch } from './batch';


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
                response => this.handleResponse(response, newLink),
                error => this.handleError(error)
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
        let stars = parseInt(links[index].stars, 10) + 1;
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
                return parseInt(linkB.stars,10) - parseInt(linkA.stars,10);
            });
            localStorage['updatr_links_store'] = JSON.stringify(links);
            this.firstSort = false;
        }

        let unread = new UpdatrLinkGroup();
        unread.title = 'Unread updates';
        let read = new UpdatrLinkGroup();
        read.title = 'Visited';

        unread.links = links.filter(function (link: UpdatrLink) {
            return !link.visited;
        });
        read.links = links.filter(function (link: UpdatrLink) {
            return link.visited;
        });

        return [unread, read];
    }

    updateAllLinks() {
        var links = this.getData();
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var options = new RequestOptions({ headers: headers });

        links.forEach((link:UpdatrLink) => {
            this.http.get(link.url, options)
                .subscribe(
                    response => this.handleResponse(response, link),
                    error => this.handleError(error)
                );
        });
    }

    private handleResponse(response, newLink) {
        if (response.status === 200) {
            newLink.loading = false;
            let newHtml = response._body.split('body')[1];
            let sim = similarity(newLink.html, newHtml)
            console.log(sim, newLink.url);
            if (sim < 0.9) {
                newLink.html = newHtml;
                newLink.updatedOn = (new Date()).toString();
                newLink.visited = false;
            }
            this.updateLink(newLink);
        } else {
            this.handleError(response);
        }
    }

    private handleError(err: Error) {
        console.error('HTTP ERROR', err);
    }

    private getData() {
        if (!localStorage['updatr_links_store']) {
            localStorage['updatr_links_store'] = JSON.stringify([]);
        }
        return JSON.parse(localStorage['updatr_links_store']);
    }

    private persistLinks(links) {
        localStorage['updatr_links_store'] = JSON.stringify(links);
        this.applicationRef.tick();
    }

    private findUrl(url:string, links) {
        let index = -1;
        links.forEach(function (link:UpdatrLink, i:number) { if (link.url === url) index = i; });
        return index;
    }
}
