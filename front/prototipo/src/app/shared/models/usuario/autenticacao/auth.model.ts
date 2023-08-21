import { Usuario } from "../usuario";

export class Auth {

    constructor(
        public id?: number,
        public usuario?: Usuario,
        public login?: string,
        public senha?: string
    ){}

}
