import { CouldNotFindException } from "../../exceptions";

export class UpdateProductDto{
    public constructor(
        public id: string,
        public name?: string,
        public price?: number,
        public plu?: number,
        public unit?:'gram'|'pcs',
        public category? : string,
        public photo?:Buffer
        
    ){}

    public static from(body:Partial<UpdateProductDto>){
        if(!body.id){
            throw new CouldNotFindException('Missing id property');
        }

        return new UpdateProductDto(body.id, body.name, body.price, body.plu, body.unit, body.category, body.photo);
    }
}