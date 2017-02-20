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
        let uniq = true;
        links.forEach(function (link:UpdatrLink) { if (link.url === url) uniq = false; });
        if (!uniq) return;

        // persist new link
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let newLink = new UpdatrLink(url);

        this.http.get(url, options)
            .subscribe(
                response => this.handleResponse(response, links, newLink),
                error => this.handleError(error)
            );

        links.push(newLink);
        localStorage['updatr_links_store'] = JSON.stringify(links);

        // re-render
        this.applicationRef.tick();
    }

    removeUrl(url: string) {
        let links = this.getData();

        // find url
        let index = -1;
        links.forEach(function (link:UpdatrLink, i:number) { if (link.url === url) index = i; });
        if (index === -1) return;

        // remove & persist
        links.splice(index, 1);
        localStorage['updatr_links_store'] = JSON.stringify(links);

        // re-render
        this.applicationRef.tick();
    }

    toggleReadUrl(url: string) {
        let links = this.getData();

        // find url
        let index = -1;
        links.forEach(function (link:UpdatrLink, i:number) { if (link.url === url) index = i; });
        if (index === -1) return;

        // udpate & persist
        links[index].visited = !links[index].visited;
        localStorage['updatr_links_store'] = JSON.stringify(links);

        // re-render
        this.applicationRef.tick();
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

    getDateUpdatedGroups() {
        let today = new UpdatrLinkGroup();
        today.title = 'today';
        let yesterday = new UpdatrLinkGroup();
        yesterday.title = 'yesterday';
        let week = new UpdatrLinkGroup();
        week.title = 'This week';
        let month = new UpdatrLinkGroup();
        month.title = 'Last month';
        let older = new UpdatrLinkGroup();
        older.title = 'Older';

        return [today, yesterday, week, month, older];
    }

    private getData() {
        if (!localStorage['updatr_links_store']) {
            localStorage['updatr_links_store'] = JSON.stringify([]);
        }
        return JSON.parse(localStorage['updatr_links_store']);
    }

    private handleError(err: Error) {
        console.error('HTTP ERROR', err);
    }

    private handleResponse(response, links, newLink) {
        console.log(response);
    }
}
