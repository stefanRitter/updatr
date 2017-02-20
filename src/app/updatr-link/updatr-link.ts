export class UpdatrLink {
    url:string;
    html:string;
    visited:boolean = false;
    loading:boolean = true;

    constructor(url: string) {
        this.url = url;
    }
}
