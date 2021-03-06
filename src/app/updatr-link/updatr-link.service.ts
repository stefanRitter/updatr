import { environment } from '../../environments/environment';

import { Injectable, ApplicationRef } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';

import { UpdatrLink } from './updatr-link';
import { UpdatrLinkGroup } from './updatr-link-group';

import { STORE } from '../updatr-store/updatr-store';


@Injectable()
export class UpdatrLinkService {
    private http: Http;
    private applicationRef: ApplicationRef;
    private STORE: STORE;

    constructor(applicationRef: ApplicationRef, http: Http, store: STORE) {
        this.applicationRef = applicationRef;
        this.http = http;
        this.STORE = store;
    }

    addUrl(url: string) {
        let links = this.getData();

        // don't allow dups
        let index = this.findUrl(url, links);
        if (index > -1) return alert('This link is already in your list...');

        // add & persist
        let newLink = new UpdatrLink(url);
        links.unshift(newLink);
        this.persistLinks(links, -1, newLink);
    }

    removeUrl(url: string) {
        let links = this.getData();

        // find url
        let index = this.findUrl(url, links);
        if (index === -1) return;

        // remove & persist
        let removed = links.splice(index, 1)[0];
        this.persistLinks(links, -1, removed);
    }

    toggleReadUrl(url: string) {
        let links = this.getData();

        // find url
        let index = this.findUrl(url, links);
        if (index === -1) return;

        // udpate & persist
        links[index].visited = true;
        this.persistLinks(links, index, null);
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
        this.persistLinks(links, index, null);
    }

    getUnreadReadGroups() {
        let links = this.getData();
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
        var visitedLinks = this.getData().filter(function (link) { return link.visited; });

        this.STORE.setUpdating(true);
        this.STORE.setLinksToCheck(visitedLinks.length);

        this.http.get(environment.server+'update', {withCredentials: true}).subscribe(
            response => { this.STORE.setUpdating(false); this.applicationRef.tick(); },
            error => {
                this.STORE.setUpdating(false); this.applicationRef.tick();
                this.handleError.call(this, error);
            }
        );
    }

    private handleError(err:Error) {
        console.error('HTTP ERROR', err);
    }

    private getData() {
        return this.STORE.getLinks();
    }

    private persistLinks(links, index, link) {
        this.STORE.persistLinks(links, index, link);
        this.applicationRef.tick();
    }

    private findUrl(url:string, links) {
        let index = -1;
        links.forEach(function (link:UpdatrLink, i:number) { if (link.url === url) index = i; });
        return index;
    }
}
