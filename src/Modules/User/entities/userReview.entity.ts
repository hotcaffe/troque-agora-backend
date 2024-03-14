import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('avaliacaoUsuario')
export class UserReview {
    @PrimaryColumn()
    id_usuario: number;

    @Column({type: 'int4', nullable: false, default: 0})
    qt_trocasSucedidas: number;

    @Column({type: 'int4', nullable: false, default: 0})
    qt_trocasRecebidas: number;

    @Column({type: 'int4', nullable: false, default: 0})
    qt_trocasAceitas: number;

    @Column({type: 'int4', nullable: false, default: 0})
    qt_trocasRecusadas: number;

    @Column({type: 'int4', nullable: false, default: 0})
    qt_trocasEnviadas: number;

    @Column({type: 'boolean', nullable: false, default: false})
    bo_seloAtivo: boolean;

    @Column({type: 'decimal', precision: 3, scale: 3, nullable: false, default: 0})
    tx_avaliacaoGeral: number;

    @OneToOne(() => User, user => user.id_usuario)
    @JoinColumn({name: 'id_usuario'})
    user?: User;
} 