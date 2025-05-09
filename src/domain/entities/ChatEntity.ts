interface Attachment{
    type: string;   
    url: string;
    name: string;
    size: number;
}

export class MessageEntities{
    constructor(
        public id:string,
        public sender:string,
        public receiver:string,
        public message:string,
        public userType:"user"|"volunteer",
        public timestamp:Date,
        public isRead:boolean,
        public attachment?:Attachment,
        

    ){}
}