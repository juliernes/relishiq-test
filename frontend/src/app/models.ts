export class ResultTo<T>{
    total: number = null;
    data: T = null;
}

export class Company {
    name: string = null;
    catchPhrase: string = null;
    bs: string = null;
}

export class Geo {
    lat: number;
    lng: number;
}

export class Address {
    street: string = null;
    suite: string = null;
    city: string = null;
    zipcode: string = null;
    geo: Geo = null;
    phone: string = null;
    website: string = null;
    company: Company = null;
}

export class User {
    id: number = null;
    name: string = null;
    username: string = null;
    email: string = null;
    address: Address = null;
}

export class Album {
    id: number = null;
    title: string = null;
    user: User = null;
}

export class Photo {
    id: number = null;
    title: string = null;
    url: string = null;
    thumbnailUrl: string = null;
    album: Album = null;
}