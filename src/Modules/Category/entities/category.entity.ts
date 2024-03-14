import { Notice } from "src/Modules/notice/entities/notice.entity";
import { ProposalItem } from "src/Modules/proposal/entities/proposalItem.entity";
import { Column, Entity, JoinColumn, ManyToOne, Not, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('categoria')
export class Category {
    @PrimaryGeneratedColumn()
    id_categoria?: number;

    @Column({length: 32, nullable: false})
    vc_titulo: string;

    @Column({length: 128, nullable: false})
    vc_descricao: string;

    @Column({type: 'boolean', nullable: false})
    bo_ativo: boolean;

    @OneToMany(() => Notice, notices => notices.category)
    notices?: Notice[];

    @OneToMany(() => ProposalItem, proposalItem => proposalItem.category)
    proposalItem?: ProposalItem[];
}
