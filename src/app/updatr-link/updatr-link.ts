export class UpdatrLink {
    url:string;
    visited:boolean = false;
    loading:boolean = true;
    stars:number = 0;

    constructor(url: string) {
        this.url = url;
    }
}
