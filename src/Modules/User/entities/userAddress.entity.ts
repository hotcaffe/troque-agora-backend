import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, PrimaryColumn, JoinColumn, OneToOne } from "typeorm";
import { User } from "./user.entity";

@Entity('enderecoUsuario')
export class UserAddress {
    @PrimaryColumn()
    id_usuario?: number;
    
    @Column({length: 60, nullable: false})
    vc_lougradouro: string;

    @Column('int2', {nullable: false})
    in_numero: number;

    @Column({length: 120, nullable: false})
    vc_complemento: string;

    @Column({length: 64, nullable: false})
    vc_bairro: string;

    @Column({length: 40, nullable: false})
    vc_cidade: string;

    @Column({length: 32, nullable: false})
    vc_estado: string;

    @OneToOne(() => User, user => user.userAddress, {onUpdate: 'CASCADE', onDelete: 'CASCADE'})
    @JoinColumn({name: 'id_usuario'})
    user?: User;
}