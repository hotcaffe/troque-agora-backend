import { Category } from "src/Modules/Category/entities/category.entity";
import { User } from "src/modules/User/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { NoticeDetails } from "./noticeDetails.entity";
import { ProposalNotices } from "src/Modules/Proposal/entities/proposalNotices.entity";

@Entity('anuncioTroca')
export class Notice {
    @PrimaryGeneratedColumn()
    id_anuncioTroca: number;

    @PrimaryColumn()
    id_usuarioAnuncio: number

    @Column({type: 'int4'})
    id_categoria: number;
    
    @Column({length: 120, nullable: false})
    vc_titulo: string;

    @Column({length: 256, nullable: false})
    vc_descricao: string;

    @Column({type: 'number', nullable: false, precision: 15})
    fl_quantidade: number;

    @Column({length: 4, nullable: false})
    ch_unidade: string;

    @Column({type: 'number', nullable: false, precision: 14})
    vl_preco: number;

    @Column({length: 32, nullable: false})
    vc_situacaoProduto: string;

    @Column({type: 'boolean', nullable: false})
    bo_ativo: boolean;

    @Column({length: 32, nullable: false})
    vc_situacaoAnuncio: string;

    @ManyToOne(() => User, user => user.userNotices)
    @JoinColumn({name: 'id_usuarioAnuncio', referencedColumnName: 'id_usuario'})
    user?: User;

    @ManyToOne(() => Category, category => category.notices)
    @JoinColumn({name: 'id_categoria'})
    category: number;

    @OneToMany(() => NoticeDetails, noticeDetails => noticeDetails.notice)
    noticeDetails?: NoticeDetails[];

    @OneToMany(() => ProposalNotices, proposalNotices => proposalNotices.notice)
    proposalNotices?: ProposalNotices[];
}
