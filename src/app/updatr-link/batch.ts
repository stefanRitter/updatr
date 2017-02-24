
export class Batch {
    private concurrency:number = 10;
    private jobs:Function[] = [];
    private endCallback:Function;
    private progressCallback:Function;
    private progressCount:number = 0;
    private batchCount:number = 0;

    push(job:Function) {
        this.jobs.push(job);
    }

    start() {
        if (this.jobs.length === 0) { return this.endCallback(); }

        for (let i = 0;i<this.concurrency;i++) {
            if (this.batchCount < this.jobs.length) {
                this.jobs[this.batchCount](this.done.bind(this));
                this.batchCount+=1;
            }
        }
    }

    onProgress(callback:Function) {
        this.progressCallback = callback;
    }

    onEnd(callback:Function) {
        this.endCallback = callback;
    }

    private done(data) {
        this.progressCount+=1;
        this.progressCallback(this.progressCount, data);
        if (this.progressCount === this.jobs.length) {
            return this.endCallback();
        }
        if (this.progressCount % this.concurrency === 0) {
            this.start();
        }
    }
}
