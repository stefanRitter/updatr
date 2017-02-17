export class UpdatrLink {
    url: string;
    title: string;
    lastModified: Date;
    visited:boolean = false;
    lastChecked: Date;

    constructor(url: string) {
        this.url = url;
        this.title = url;
        this.lastModified = new Date();
        this.lastChecked = new Date();
    }
}
