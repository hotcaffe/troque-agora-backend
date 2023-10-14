import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserAddress } from "./userAddress.entity";
import { UserReview } from "./userReview.entity";

@Entity('usuario')
export class User {
    @PrimaryGeneratedColumn()
    id_usuario?: number;

    @Column({length: 120, nullable: false})
    vc_nome: string;

    @Column({type: 'int8', nullable: false})
    in_cpf: number;

    @Column({type: 'int8', nullable: false})
    in_celular: number;

    @Column({type: 'int2', nullable: false})
    in_idade: number;

    @Column({length: 254, nullable: false})
    vc_email: string;

    @OneToMany(() => UserAddress, userAddress => userAddress.user)
    userAddress?: UserAddress[];

    @OneToOne(() => UserReview, userReview => userReview.user)
    userReview?: UserReview;
}
