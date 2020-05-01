export class Usuario {

    constructor(
        public nombre: string,
        public correo: string,
        public password: string,
        public img?: string, // Los que tengan ? es por que serán opcionales
        public role?: string,
        public google?: boolean,
        public _id?: string
    ){ }

}