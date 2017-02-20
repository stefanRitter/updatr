export class UpdatrLink {
    url:string;
    title:string;
    html:string;
    visited:boolean = false;
    loading:boolean = true;
    lastModified:string;
    lastChecked:Date;

    constructor(url: string) {
        this.url = url;
        this.title = url;
        this.lastChecked = new Date();
    }
}
