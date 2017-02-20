import { Injectable, ApplicationRef } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';

import { UpdatrLink } from './updatr-link';
import { UpdatrLinkGroup } from './updatr-link-group';


@Injectable()
export class UpdatrLinkService {
    private http: Http;
    private applicationRef: ApplicationRef;

    constructor(applicationRef: ApplicationRef, http: Http) {
        this.applicationRef = applicationRef;
        this.http = http;
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

        links.push(newLink);
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
        links[index].visited = !links[index].visited;
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
        alert('update');
    }

    private handleResponse(response, newLink) {
        if (response.status === 200) {
            newLink.html = response._body;
            newLink.loading = false;
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
