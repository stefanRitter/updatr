import { Injectable } from '@angular/core';
import { UpdatrLink } from './updatr-link';
import { UpdatrLinkGroup } from './updatr-link-group';


@Injectable()
export class UpdatrLinkService {
    links: UpdatrLink[];
    unread: UpdatrLinkGroup;
    read: UpdatrLinkGroup;

    constructor() {
        if (!localStorage['updatr_links_store']) {
            localStorage['updatr_links_store'] = JSON.stringify([]);
        }
        this.links = JSON.parse(localStorage['updatr_links_store']);
        this.unread = new UpdatrLinkGroup();
        this.unread.title = 'Unread updates';
        this.read = new UpdatrLinkGroup();
        this.read.title = 'Visited';
    }

    addUrl(url: string) {
        // don't allow dups
        let uniq = true;
        this.links.forEach(function (link:UpdatrLink) { if (link.url === url) uniq = false; });
        if (!uniq) return;

        // persist new link
        let newLink = new UpdatrLink(url);
        this.links.push(newLink);
        localStorage['updatr_links_store'] = JSON.stringify(this.links);

        // update sorting
        this.getUnreadReadGroups();
    }

    getUnreadReadGroups() {
        this.unread.links = this.links.filter(function (link: UpdatrLink) {
            return !link.visited;
        });
        this.read.links = this.links.filter(function (link: UpdatrLink) {
            return link.visited;
        });
        return [this.unread, this.read];
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

}
