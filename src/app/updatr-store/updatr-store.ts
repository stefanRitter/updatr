import { UpdatrLink } from '../updatr-link/updatr-link';

// app store
var _updating:boolean = false;
var _links:UpdatrLink[] = [];


// prepare data
if (!localStorage['updatr_links_store']) {
    localStorage['updatr_links_store'] = JSON.stringify([]);
}
_links = JSON.parse(localStorage['updatr_links_store']);
_links.forEach(function (link) {
    link.stars = parseInt(<any>link.stars, 10);
});


// expose data access
export default {

    setUpdating(updating:boolean) {
        _updating = updating;
    },

    getUpdating() {
        return _updating;
    },

    getLinks() {
        return _links;
    },

    persistLinks(links) {
        _links = links;
        localStorage['updatr_links_store'] = JSON.stringify(links);
    }
};
